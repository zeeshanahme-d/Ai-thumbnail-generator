import mongoose from "mongoose";

// One record per viewer per thumbnail, so each viewer adds to viewsCount only once.
const thumbnailViewSchema = new mongoose.Schema(
  {
    thumbnailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thumbnail",
      required: true,
    },
    // "user:<userId>" for signed-in viewers, "guest:<visitorId>" for guests (utils/viewer.ts).
    viewerKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

thumbnailViewSchema.index({ thumbnailId: 1, viewerKey: 1 }, { unique: true });

export default mongoose.model("ThumbnailView", thumbnailViewSchema);
