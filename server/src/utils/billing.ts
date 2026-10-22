import mongoose from "mongoose";
import type { SubscriptionNotification, TransactionNotification } from "@paddle/paddle-node-sdk";
import paddle from "../config/paddle.js";
import userModel from "../models/user.model.js";
import { SubscriptionStatus, UserPlan } from "../constants/enums.js";
import { nextPaidRefill, resetDueCredits } from "./credits.js";
import logger from "./logger.js";

// Statuses that keep the paid plan. past_due keeps it while Paddle retries the payment.
const LIVE_STATUSES: (string | null | undefined)[] = [
  SubscriptionStatus.Active,
  SubscriptionStatus.Trialing,
  SubscriptionStatus.PastDue,
];

export const isLiveSubscription = (status?: string | null) => LIVE_STATUSES.includes(status);

// Transactions that pay for a billing period. A payment-method change can be a $0 transaction,
// so it never refills.
const PAID_PERIOD_ORIGINS = ["api", "web", "subscription_recurring", "subscription_update"];

type BillingUser = { _id: unknown; subscriptionId?: string | null; subscriptionStatus?: string | null };

/** What a price grants, read from its custom_data so no Paddle IDs are hardcoded. */
export function readPlanGrant(customData: unknown): { plan: UserPlan; credits: number } | null {
  const data = (customData ?? {}) as Record<string, unknown>;
  const credits = data.credits_per_month;
  if (data.plan !== UserPlan.Pro && data.plan !== UserPlan.Ultra) return null;
  if (typeof credits !== "number" || !Number.isInteger(credits) || credits <= 0) return null;
  return { plan: data.plan, credits };
}

/** Credits one unit of a credit pack price grants, or null when the price is not a credit pack. */
export function readCreditPack(customData: unknown): number | null {
  const data = (customData ?? {}) as Record<string, unknown>;
  const perUnit = data.credits_per_unit;
  if (data.type !== "credit_pack") return null;
  if (typeof perUnit !== "number" || !Number.isInteger(perUnit) || perUnit <= 0) return null;
  return perUnit;
}

// Our checkout puts the userId in the transaction's custom_data; Paddle copies it to the
// subscription and every renewal. The subscription id is the fallback.
async function findBillingUser(customData: unknown, subscriptionId: string): Promise<BillingUser | null> {
  const userId = (customData as Record<string, unknown> | null)?.userId;
  if (typeof userId === "string" && mongoose.isValidObjectId(userId)) {
    const user = await userModel.findById(userId).select("subscriptionId subscriptionStatus").lean();
    if (user) return user;
  }
  return userModel.findOne({ subscriptionId }).select("subscriptionId subscriptionStatus").lean();
}

// Another subscription that is still live owns the account, so events from this one are ignored.
// Checkout refuses accounts with a live plan, so a real second subscription only starts after the
// first ended, or when two checkouts were paid at once (two tabs).
const ownedByOtherSubscription = (user: BillingUser, subscriptionId: string) =>
  Boolean(user.subscriptionId && user.subscriptionId !== subscriptionId && isLiveSubscription(user.subscriptionStatus));

// The account keeps the subscription it already has, so Paddle must stop billing the duplicate.
// Paddle's current state decides, so a late or repeated event never cancels twice. The duplicate's
// first payment is refunded by hand from the Paddle dashboard.
async function cancelDuplicateSubscription(subscriptionId: string, userId: string) {
  const current = await paddle().subscriptions.get(subscriptionId);
  if (!isLiveSubscription(current.status)) return;

  await paddle().subscriptions.cancel(subscriptionId, { effectiveFrom: "immediately" });
  logger.warn("Duplicate subscription canceled, refund its first payment in Paddle", { userId, subscriptionId });
}

/** subscription.* events: mirrors the plan and status. Credits come from paid transactions. */
export async function syncSubscription(subscription: SubscriptionNotification): Promise<void> {
  const context = { subscriptionId: subscription.id, status: subscription.status };

  const user = await findBillingUser(subscription.customData, subscription.id);
  if (!user) {
    logger.warn("Subscription event for no known user", context);
    return;
  }
  const userId = String(user._id);
  if (ownedByOtherSubscription(user, subscription.id)) {
    logger.warn("Subscription event ignored: another live subscription owns the account", { ...context, userId, currentSubscriptionId: user.subscriptionId });
    if (isLiveSubscription(subscription.status)) {
      await cancelDuplicateSubscription(subscription.id, userId);
    }
    return;
  }

  const live = isLiveSubscription(subscription.status);
  const grant = readPlanGrant(subscription.items[0]?.price?.customData);
  if (live && !grant) {
    logger.error("Subscription price has no plan custom_data", { ...context, userId, priceId: subscription.items[0]?.price?.id });
    return;
  }

  const updatedAt = new Date(subscription.updatedAt);
  const set: Record<string, unknown> = {
    plan: live && grant ? grant.plan : UserPlan.Free,
    paddleCustomerId: subscription.customerId,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionRenewsAt: subscription.nextBilledAt ? new Date(subscription.nextBilledAt) : null,
    subscriptionUpdatedAt: updatedAt,
  };
  // Back on the free plan: the refill below replaces the paid credits with the free allowance.
  if (!live) set.creditsResetAt = new Date();

  const { modifiedCount } = await userModel.updateOne(
    {
      _id: user._id,
      $or: [
        { subscriptionId: mongoose.trusted({ $ne: subscription.id }) },
        { subscriptionUpdatedAt: null },
        { subscriptionUpdatedAt: mongoose.trusted({ $lt: updatedAt }) },
      ],
    },
    { $set: set },
  );

  if (!modifiedCount) {
    logger.debug("Subscription event already applied", { ...context, userId });
    return;
  }

  logger.info("Subscription synced", { ...context, userId, plan: set.plan });
  if (!live) {
    await resetDueCredits(userId);
  }
}

/** transaction.completed: a paid billing period refills the plan's credits, once per period. */
export async function grantPaidPeriod(transaction: TransactionNotification): Promise<void> {
  const { subscriptionId, billingPeriod } = transaction;
  if (!subscriptionId || !billingPeriod || !PAID_PERIOD_ORIGINS.includes(transaction.origin)) return;

  const context = { transactionId: transaction.id, subscriptionId, origin: transaction.origin };

  const grant = readPlanGrant(transaction.items.find((item) => item.price?.billingCycle)?.price?.customData);
  if (!grant) {
    logger.error("Paid transaction has no plan custom_data", context);
    return;
  }

  const user = await findBillingUser(transaction.customData, subscriptionId);
  if (!user) {
    logger.warn("Paid transaction for no known user", context);
    return;
  }
  const userId = String(user._id);
  if (ownedByOtherSubscription(user, subscriptionId)) {
    logger.warn("Paid transaction ignored: another live subscription owns the account", { ...context, userId });
    return;
  }
  // A payment that arrives after this subscription already ended grants nothing.
  if (user.subscriptionId === subscriptionId && user.subscriptionStatus && !isLiveSubscription(user.subscriptionStatus)) {
    logger.warn("Paid transaction ignored: subscription already ended", { ...context, userId, status: user.subscriptionStatus });
    return;
  }

  const periodStart = new Date(billingPeriod.startsAt);
  const periodEnd = new Date(billingPeriod.endsAt);

  // Retries and duplicate events find the period already granted and change nothing.
  const { modifiedCount } = await userModel.updateOne(
    {
      _id: user._id,
      $or: [{ subscriptionPeriodStart: null }, { subscriptionPeriodStart: mongoose.trusted({ $lt: periodStart }) }],
    },
    {
      $set: {
        totalcredits: grant.credits,
        creditsUsed: 0,
        subscriptionPeriodStart: periodStart,
        subscriptionPeriodEnd: periodEnd,
        creditsResetAt: nextPaidRefill(periodStart, periodEnd),
      },
    },
  );

  if (modifiedCount) {
    logger.info("Plan credits granted", { ...context, userId, plan: grant.plan, credits: grant.credits, periodStart, periodEnd });
  } else {
    logger.debug("Billing period already granted", { ...context, userId });
  }
}

// Our checkout puts the userId in custom_data; the Paddle customer is the fallback.
async function findPackBuyer(customData: unknown, customerId: string | null) {
  const userId = (customData as Record<string, unknown> | null)?.userId;
  if (typeof userId === "string" && mongoose.isValidObjectId(userId)) {
    const user = await userModel.findById(userId).select("_id").lean();
    if (user) return user;
  }
  return customerId ? userModel.findOne({ paddleCustomerId: customerId }).select("_id").lean() : null;
}

/**
 * transaction.completed without a subscription: a credit pack. Adds credits_per_unit × quantity
 * to the pack balance, once per transaction, read from the paid transaction rather than the client.
 */
export async function grantCreditPack(transaction: TransactionNotification): Promise<void> {
  const context = { transactionId: transaction.id, origin: transaction.origin };

  const item = transaction.items.find((entry) => readCreditPack(entry.price?.customData) !== null);
  if (!item) {
    logger.debug("Completed transaction is not a credit pack", context);
    return;
  }
  const perUnit = readCreditPack(item.price?.customData)!;
  if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
    logger.error("Credit pack transaction has an invalid quantity", { ...context, quantity: item.quantity });
    return;
  }
  const credits = perUnit * item.quantity;

  const user = await findPackBuyer(transaction.customData, transaction.customerId);
  if (!user) {
    logger.warn("Credit pack paid for no known user", { ...context, credits });
    return;
  }

  // One write adds the credits and records the transaction, so a retry finds it and adds nothing.
  const { modifiedCount } = await userModel.updateOne(
    { _id: user._id, creditPackTransactionIds: mongoose.trusted({ $ne: transaction.id }) },
    { $inc: { packCredits: credits }, $push: { creditPackTransactionIds: transaction.id } },
  );

  if (modifiedCount) {
    logger.info("Credit pack granted", { ...context, userId: String(user._id), credits });
  } else {
    logger.debug("Credit pack already granted", { ...context, userId: String(user._id) });
  }
}
