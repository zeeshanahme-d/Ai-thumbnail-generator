// One-time move from totalcredits / creditsUsed to freeCredits, usedCredits and subscriptionCredits.
// Run once after deploying: npx tsx src/db/migrate-credits.ts
// Safe to run again: it only touches accounts that still have the old fields. Values the new code
// already wrote (a refill can run at startup, before this) are kept.
import "dotenv/config";
import mongoose from "mongoose";
import connectMongoose from "./connection.js";
import userModel from "../models/user.model.js";
import thumbnailModel from "../models/thumbnail.model.js";
import { CREDIT_COST } from "../constants/constants.js";
import { SubscriptionStatus, UserPlan } from "../constants/enums.js";
import logger from "../utils/logger.js";

// Mirrors credits_per_month on the Paddle prices; the next payment sets the real value anyway.
const PLAN_CREDITS = { [UserPlan.Pro]: 500, [UserPlan.Ultra]: 2500 };
const LIVE_STATUSES = [SubscriptionStatus.Active, SubscriptionStatus.Trialing, SubscriptionStatus.PastDue];

async function migrate() {
  await connectMongoose();

  // The raw collection, because the old fields are no longer in the schema.
  const oldFields = { $or: [{ totalcredits: { $exists: true } }, { creditsUsed: { $exists: true } }] };
  const users = await userModel.collection.updateMany(oldFields, [
    {
      $set: {
        freeCredits: {
          $ifNull: ["$freeCredits", { $min: [{ $max: [0, { $ifNull: ["$totalcredits", 0] }] }, CREDIT_COST.SIGNUP_BONUS] }],
        },
        usedCredits: { $ifNull: ["$usedCredits", { $max: [0, { $ifNull: ["$creditsUsed", 0] }] }] },
        subscriptionCredits: {
          $cond: [
            { $in: ["$subscriptionStatus", LIVE_STATUSES] },
            {
              $switch: {
                branches: Object.entries(PLAN_CREDITS).map(([plan, credits]) => ({
                  case: { $eq: ["$plan", plan] },
                  then: credits,
                })),
                default: 0,
              },
            },
            0,
          ],
        },
        packCredits: { $max: [0, { $ifNull: ["$packCredits", 0] }] },
      },
    },
    { $unset: ["totalcredits", "creditsUsed"] },
  ]);

  const thumbnails = await thumbnailModel.collection.updateMany(
    { packCreditsUsed: { $exists: true } },
    { $unset: { packCreditsUsed: "" } },
  );

  logger.info("Credits migrated", { users: users.modifiedCount, thumbnails: thumbnails.modifiedCount });
}

migrate()
  .catch((error) => {
    logger.error("Credit migration failed", { error });
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
