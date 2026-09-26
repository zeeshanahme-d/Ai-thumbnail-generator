import mongoose from "mongoose";
import thumbnailModel from "../models/thumbnail.model.js";
import {
  CREDIT_COST,
  RECYCLE_BIN_RETENTION_MS,
  SCHEDULED_JOB_INTERVAL_MS,
  STUCK_GENERATION_MS,
} from "../constants/constants.js";
import { refundCredits, resetDueCredits } from "./credits.js";
import { deleteThumbnailsForever } from "./delete-thumbnails.js";

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
      await refundCredits(String(removed.userId), CREDIT_COST.GENERATE_COST);
    }
  }
}

// Deletes recycle-bin items forever once they have been there for RECYCLE_BIN_RETENTION_MS.
const purgeRecycleBins = () =>
  deleteThumbnailsForever({
    deletedAt: mongoose.trusted({ $lt: new Date(Date.now() - RECYCLE_BIN_RETENTION_MS) }),
  });

// Runs the maintenance jobs once at startup, then every SCHEDULED_JOB_INTERVAL_MS.
export function startScheduledJobs() {
  const run = () => {
    removeStuckGenerations().catch((error) => console.error("Stuck generation cleanup failed:", error));
    resetDueCredits().catch((error) => console.error("Monthly credit reset failed:", error));
    purgeRecycleBins().catch((error) => console.error("Recycle bin purge failed:", error));
  };

  run();
  setInterval(run, SCHEDULED_JOB_INTERVAL_MS);
}
