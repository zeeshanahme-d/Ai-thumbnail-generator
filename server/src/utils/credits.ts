import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import { SubscriptionStatus, UserPlan } from "../constants/enums.js";
import { CREDIT_COST, CREDIT_RESET_INTERVAL_MS } from "../constants/constants.js";

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

type CreditFields = { totalcredits?: number | null; creditsUsed?: number | null } | null;

export const getRemainingCredits = (user: CreditFields) =>
  Math.max(0, (user?.totalcredits ?? 0) - (user?.creditsUsed ?? 0));

/**
 * Takes `amount` credits in one atomic update that only matches while enough remain,
 * so parallel requests cannot all pass the check and overspend.
 * Returns the balance after the charge, or null when the user is missing or short on credits.
 */
export async function reserveCredits(userId: string, amount: number) {
  return userModel.findOneAndUpdate(
    {
      _id: userId,
      // Marked trusted so sanitizeFilter lets this intentional operator through.
      $expr: mongoose.trusted({
        $lte: [
          { $add: [{ $ifNull: ["$creditsUsed", 0] }, amount] },
          { $ifNull: ["$totalcredits", 0] },
        ],
      }),
    },
    { $inc: { creditsUsed: amount } },
    { returnDocument: "after", projection: { _id: 0, totalcredits: 1, creditsUsed: 1, creditsResetAt: 1 } },
  ).lean();
}

/**
 * Gives back credits taken by reserveCredits when the work they paid for failed.
 * Skipped when a monthly refill already cleared the usage in between.
 */
export async function refundCredits(userId: string, amount: number): Promise<void> {
  await userModel.updateOne(
    { _id: userId, creditsUsed: mongoose.trusted({ $gte: amount }) },
    { $inc: { creditsUsed: -amount } },
  );
}

/**
 * Refills verified free accounts whose reset date has passed, or one user when `userId` is given.
 * Accounts verified before resets existed have no date yet and are refilled on the first run.
 * Paid plans refill inside the period they paid for; payments for new periods refill in utils/billing.ts.
 */
export async function resetDueCredits(userId?: string): Promise<void> {
  const now = new Date();
  const filter: Record<string, unknown> = {
    plan: UserPlan.Free,
    isVerified: true,
    $or: [{ creditsResetAt: null }, { creditsResetAt: mongoose.trusted({ $lte: now }) }],
  };
  if (userId) filter._id = userId;

  await userModel.updateMany(filter, {
    $set: {
      totalcredits: CREDIT_COST.SIGNUP_BONUS,
      creditsUsed: 0,
      creditsResetAt: nextCreditResetDate(now),
    },
  });

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
