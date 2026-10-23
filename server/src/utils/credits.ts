import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import { SubscriptionStatus, UserPlan } from "../constants/enums.js";
import { CREDIT_COST, CREDIT_RESET_INTERVAL_MS, PAID_CREDITS_SPENDABLE } from "../constants/constants.js";

export const nextCreditResetDate = (from = new Date()) => new Date(from.getTime() + CREDIT_RESET_INTERVAL_MS);

/** Calendar months in UTC, clamped to the month's last day: Jan 31 + 1 month is Feb 28. */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

/**
 * When a paid plan next refills: the first monthly anniversary of the period start after `now`,
 * but never past the period end. A monthly plan therefore waits for its next payment, and a
 * yearly plan refills every month of the year it paid for.
 */
export function nextPaidRefill(periodStart: Date, periodEnd: Date, now = new Date()): Date {
  let months = 1;
  while (addMonths(periodStart, months) <= now) months++;
  const next = addMonths(periodStart, months);
  return next < periodEnd ? next : periodEnd;
}

type CreditFields = { totalcredits?: number | null; creditsUsed?: number | null; packCredits?: number | null } | null;

// The part of the allowance that can be spent: all of it, or only the free credits while paid
// credits are display-only (an account may still hold a paid plan's allowance from before).
const spendableTotal = (total: number) => (PAID_CREDITS_SPENDABLE ? total : Math.min(total, CREDIT_COST.SIGNUP_BONUS));

/** What is left of the monthly allowance, which refills and doesn't roll over. */
export const getAllowanceLeft = (user: CreditFields) =>
  Math.max(0, spendableTotal(user?.totalcredits ?? 0) - (user?.creditsUsed ?? 0));

/** Everything the user can spend. Pack credits only count while paid credits are spendable. */
export const getRemainingCredits = (user: CreditFields) =>
  getAllowanceLeft(user) + (PAID_CREDITS_SPENDABLE ? Math.max(0, user?.packCredits ?? 0) : 0);

/** Splits a charge: the allowance pays first because it expires, bought pack credits pay the rest. */
export function splitCharge(user: CreditFields, amount: number) {
  const fromAllowance = Math.min(amount, getAllowanceLeft(user));
  return { fromAllowance, fromPack: amount - fromAllowance };
}

// The same split as splitCharge, worked out inside MongoDB so the check and the charge are one write.
const totalExpr = { $ifNull: ["$totalcredits", 0] };
const allowanceLeftExpr = {
  $max: [
    0,
    {
      $subtract: [
        PAID_CREDITS_SPENDABLE ? totalExpr : { $min: [totalExpr, CREDIT_COST.SIGNUP_BONUS] },
        { $ifNull: ["$creditsUsed", 0] },
      ],
    },
  ],
};
const packExpr = PAID_CREDITS_SPENDABLE ? { $ifNull: ["$packCredits", 0] } : 0;

/** The condition and update reserveCredits runs, exported so the check can run them in MongoDB. */
export function chargeExpressions(amount: number) {
  const fromAllowance = { $min: [amount, allowanceLeftExpr] };
  return {
    enoughCredits: { $gte: [{ $add: [allowanceLeftExpr, packExpr] }, amount] },
    charge: {
      creditsUsed: { $add: [{ $ifNull: ["$creditsUsed", 0] }, fromAllowance] },
      packCredits: { $subtract: [{ $ifNull: ["$packCredits", 0] }, { $subtract: [amount, fromAllowance] }] },
    },
  };
}

/**
 * Takes `amount` credits in one atomic update that only matches while enough remain,
 * so parallel requests cannot all pass the check and overspend.
 * Returns the balance after the charge and how many pack credits it took (needed to refund),
 * or null when the user is missing or short on credits.
 */
export async function reserveCredits(userId: string, amount: number) {
  const { enoughCredits, charge } = chargeExpressions(amount);

  // returnDocument "before" so the split can be worked out exactly as the update applied it.
  const before = await userModel.findOneAndUpdate(
    // Marked trusted so sanitizeFilter lets this intentional operator through.
    { _id: userId, $expr: mongoose.trusted(enoughCredits) },
    [{ $set: charge }],
    {
      returnDocument: "before",
      updatePipeline: true,
      projection: { _id: 0, totalcredits: 1, creditsUsed: 1, packCredits: 1, creditsResetAt: 1 },
    },
  ).lean();

  if (!before) return null;

  const split = splitCharge(before, amount);
  return {
    fromPack: split.fromPack,
    balance: {
      totalcredits: before.totalcredits ?? 0,
      creditsUsed: (before.creditsUsed ?? 0) + split.fromAllowance,
      packCredits: (before.packCredits ?? 0) - split.fromPack,
      creditsResetAt: before.creditsResetAt ?? null,
    },
  };
}

/**
 * Gives back credits taken by reserveCredits when the work they paid for failed. Pack credits
 * always go back; allowance credits are skipped when a monthly refill already cleared the usage.
 */
export async function refundCredits(userId: string, amount: number, fromPack = 0): Promise<void> {
  const fromAllowance = amount - fromPack;
  if (fromPack > 0) {
    await userModel.updateOne({ _id: userId }, { $inc: { packCredits: fromPack } });
  }
  if (fromAllowance > 0) {
    await userModel.updateOne(
      { _id: userId, creditsUsed: mongoose.trusted({ $gte: fromAllowance }) },
      { $inc: { creditsUsed: -fromAllowance } },
    );
  }
}

/**
 * Refills verified free accounts whose reset date has passed, or one user when `userId` is given.
 * Accounts verified before resets existed have no date yet and are refilled on the first run.
 * Paid plans refill inside the period they paid for; payments for new periods refill in utils/billing.ts.
 * While paid credits aren't spendable, every verified account gets the free refill instead.
 */
export async function resetDueCredits(userId?: string): Promise<void> {
  const now = new Date();
  const filter: Record<string, unknown> = {
    isVerified: true,
    $or: [{ creditsResetAt: null }, { creditsResetAt: mongoose.trusted({ $lte: now }) }],
  };
  if (PAID_CREDITS_SPENDABLE) filter.plan = UserPlan.Free;
  if (userId) filter._id = userId;

  await userModel.updateMany(filter, {
    $set: {
      totalcredits: CREDIT_COST.SIGNUP_BONUS,
      creditsUsed: 0,
      creditsResetAt: nextCreditResetDate(now),
    },
  });

  if (!PAID_CREDITS_SPENDABLE) return;

  // A paid refill keeps totalcredits at the plan's allowance, so a new month only clears the usage.
  const paidFilter: Record<string, unknown> = {
    plan: mongoose.trusted({ $in: [UserPlan.Pro, UserPlan.Ultra] }),
    subscriptionStatus: SubscriptionStatus.Active,
    creditsResetAt: mongoose.trusted({ $lte: now }),
    $expr: mongoose.trusted({ $lt: ["$creditsResetAt", "$subscriptionPeriodEnd"] }),
  };
  if (userId) paidFilter._id = userId;

  const due = await userModel
    .find(paidFilter)
    .select("creditsResetAt subscriptionPeriodStart subscriptionPeriodEnd")
    .lean();

  for (const user of due) {
    if (!user.subscriptionPeriodStart || !user.subscriptionPeriodEnd) continue;
    // Matching the old date means a parallel run that already refilled this user changes nothing.
    await userModel.updateOne(
      { _id: user._id, creditsResetAt: user.creditsResetAt },
      {
        $set: {
          creditsUsed: 0,
          creditsResetAt: nextPaidRefill(user.subscriptionPeriodStart, user.subscriptionPeriodEnd, now),
        },
      },
    );
  }
}
