import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import { CREDIT_COST, CREDIT_RESET_INTERVAL_MS } from "../constants/constants.js";

export const nextCreditResetDate = (from = new Date()) => new Date(from.getTime() + CREDIT_RESET_INTERVAL_MS);

type CreditFields = { freeCredits?: number | null; usedCredits?: number | null } | null;

// The fields can be edited by hand in the database, which skips the schema's checks, so a
// missing or negative value counts as 0.
const atLeastZero = (value: number | null | undefined) => Math.max(0, Number(value) || 0);

/** The credits a user can spend: only free credits; subscription and pack credits never are. */
export const getRemainingCredits = (user: CreditFields) =>
  Math.max(0, atLeastZero(user?.freeCredits) - atLeastZero(user?.usedCredits));

// The same rule as atLeastZero / getRemainingCredits, worked out inside MongoDB.
const usedExpr = { $max: [0, { $ifNull: ["$usedCredits", 0] }] };
const remainingExpr = { $subtract: [{ $max: [0, { $ifNull: ["$freeCredits", 0] }] }, usedExpr] };

/**
 * Takes `amount` free credits in one atomic update that only matches while enough remain,
 * so parallel requests cannot all pass the check and overspend.
 * Returns the credit fields after the charge, or null when the user is missing or short on credits.
 */
export async function reserveCredits(userId: string, amount: number) {
  return userModel
    .findOneAndUpdate(
      // Marked trusted so sanitizeFilter lets this intentional operator through.
      { _id: userId, $expr: mongoose.trusted({ $gte: [remainingExpr, amount] }) },
      [{ $set: { usedCredits: { $add: [usedExpr, amount] } } }],
      {
        returnDocument: "after",
        updatePipeline: true,
        projection: { _id: 0, freeCredits: 1, usedCredits: 1, creditsResetAt: 1 },
      },
    )
    .lean();
}

/**
 * Gives back credits taken by reserveCredits when the work they paid for failed. Skipped when a
 * refill already cleared the usage, so usedCredits never goes below 0.
 */
export async function refundCredits(userId: string, amount: number): Promise<void> {
  await userModel.updateOne(
    { _id: userId, usedCredits: mongoose.trusted({ $gte: amount }) },
    { $inc: { usedCredits: -amount } },
  );
}

/**
 * Every 30 days a verified account gets CREDIT_COST.SIGNUP_BONUS free credits again with none
 * used, whatever its plan, so credits added by hand last until the next refill. Runs for every due
 * account, or for one user when `userId` is given. Accounts without a date refill on the first run.
 */
export async function resetDueCredits(userId?: string): Promise<void> {
  const now = new Date();
  const filter: Record<string, unknown> = {
    isVerified: true,
    $or: [{ creditsResetAt: null }, { creditsResetAt: mongoose.trusted({ $lte: now }) }],
  };
  if (userId) filter._id = userId;

  await userModel.updateMany(filter, {
    $set: {
      freeCredits: CREDIT_COST.SIGNUP_BONUS,
      usedCredits: 0,
      creditsResetAt: nextCreditResetDate(now),
    },
  });
}
