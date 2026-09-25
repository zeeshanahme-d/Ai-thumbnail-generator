import mongoose from "mongoose";
import userModel from "../models/user.model.js";

/**
 * Takes `amount` credits in one atomic update that only matches while enough remain,
 * so parallel requests cannot all pass the check and overspend.
 * Returns false when the user is missing or short on credits.
 */
export async function reserveCredits(userId: string, amount: number): Promise<boolean> {
  const updated = await userModel.findOneAndUpdate(
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
    { returnDocument: "after", projection: { _id: 1 } },
  );
  return updated !== null;
}

/** Gives back credits taken by reserveCredits when the work they paid for failed. */
export async function refundCredits(userId: string, amount: number): Promise<void> {
  await userModel.updateOne({ _id: userId }, { $inc: { creditsUsed: -amount } });
}
