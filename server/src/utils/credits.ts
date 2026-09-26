import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import { UserPlan } from "../constants/enums.js";
import { CREDIT_COST, CREDIT_RESET_INTERVAL_MS } from "../constants/constants.js";

export const nextCreditResetDate = (from = new Date()) => new Date(from.getTime() + CREDIT_RESET_INTERVAL_MS);

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
}
