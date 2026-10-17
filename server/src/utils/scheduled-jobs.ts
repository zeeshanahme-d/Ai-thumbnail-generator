import mongoose from "mongoose";
import thumbnailModel from "../models/thumbnail.model.js";
import {
  CREDIT_COST,
  RECYCLE_BIN_RETENTION_MS,
  SCHEDULED_JOB_INTERVAL_MS,
  STUCK_GENERATION_MS,
  TRENDING_AGE_OFFSET_HOURS,
  TRENDING_GRAVITY,
  TRENDING_LIKE_WEIGHT,
} from "../constants/constants.js";
import { refundCredits, resetDueCredits } from "./credits.js";
import { deleteThumbnailsForever } from "./delete-thumbnails.js";
import logger from "./logger.js";

// Removes generations that a crash or restart left running and refunds their credits.
async function removeStuckGenerations() {
  const stuck = await thumbnailModel
    .find({
      isGenerating: true,
      createdAt: mongoose.trusted({ $lt: new Date(Date.now() - STUCK_GENERATION_MS) }),
    })
    .select("_id")
    .lean();

  for (const { _id } of stuck) {
    // Whoever deletes the record refunds it, so this job and the request never both refund.
    const removed = await thumbnailModel.findOneAndDelete({ _id, isGenerating: true });
    if (removed) {
      await refundCredits(String(removed.userId), CREDIT_COST.GENERATE_COST, removed.packCreditsUsed ?? 0);
      // Each one means a request died mid-generation: a crash, a restart or a function timeout.
      logger.warn("Stuck generation removed and refunded", { thumbnailId: String(_id), userId: String(removed.userId) });
    }
  }
}

// Deletes recycle-bin items forever once they have been there for RECYCLE_BIN_RETENTION_MS.
const purgeRecycleBins = () =>
  deleteThumbnailsForever({
    deletedAt: mongoose.trusted({ $lt: new Date(Date.now() - RECYCLE_BIN_RETENTION_MS) }),
  });

// Scores published thumbnails for the trending sort: likes and views, discounted by age.
// ponytail: rewrites every published thumbnail each run; score only recent ones if that grows slow.
const updateTrendingScores = () =>
  thumbnailModel.updateMany(
    { published: true },
    [
      {
        $set: {
          trendingScore: {
            $divide: [
              { $add: [{ $multiply: ["$likesCount", TRENDING_LIKE_WEIGHT] }, "$viewsCount"] },
              {
                $pow: [
                  {
                    $add: [
                      { $divide: [{ $subtract: ["$$NOW", { $ifNull: ["$publishedAt", "$createdAt"] }] }, 60 * 60 * 1000] },
                      TRENDING_AGE_OFFSET_HOURS,
                    ],
                  },
                  TRENDING_GRAVITY,
                ],
              },
            ],
          },
        },
      },
    ],
    { updatePipeline: true, timestamps: false },
  );

// Runs the maintenance jobs once at startup, then every SCHEDULED_JOB_INTERVAL_MS.
export function startScheduledJobs() {
  const run = () => {
    removeStuckGenerations().catch((error) => logger.error("Stuck generation cleanup failed", { error }));
    resetDueCredits().catch((error) => logger.error("Monthly credit reset failed", { error }));
    purgeRecycleBins()
      .then((count) => {
        if (count) logger.info("Recycle bins purged", { count });
      })
      .catch((error) => logger.error("Recycle bin purge failed", { error }));
    updateTrendingScores().catch((error) => logger.error("Trending score update failed", { error }));
  };

  run();
  setInterval(run, SCHEDULED_JOB_INTERVAL_MS);
}
