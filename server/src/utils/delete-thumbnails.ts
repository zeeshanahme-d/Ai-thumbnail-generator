import mongoose from "mongoose";
import thumbnailModel from "../models/thumbnail.model.js";
import likeDislikeModel from "../models/likeDislik.modal.js";
import thumbnailViewModel from "../models/thumbnailView.model.js";
import { deleteFileFromCloudinary } from "./cloudniary.js";

/**
 * Permanently removes the thumbnails matching `filter`: their Cloudinary images, like and view
 * records, and documents. Returns how many were deleted.
 */
export async function deleteThumbnailsForever(filter: Record<string, unknown>): Promise<number> {
  const thumbnails = await thumbnailModel.find(filter).select("_id thumbnail.publicId").lean();
  if (thumbnails.length === 0) return 0;

  // ponytail: one Cloudinary call per image in parallel; batch with delete_resources if bins grow to hundreds.
  await Promise.all(
    thumbnails.map((thumbnail) => thumbnail.thumbnail?.publicId && deleteFileFromCloudinary(thumbnail.thumbnail.publicId)),
  );

  const ids = thumbnails.map((thumbnail) => thumbnail._id);
  await likeDislikeModel.deleteMany({ thumbnailId: mongoose.trusted({ $in: ids }) });
  await thumbnailViewModel.deleteMany({ thumbnailId: mongoose.trusted({ $in: ids }) });
  const { deletedCount } = await thumbnailModel.deleteMany({ _id: mongoose.trusted({ $in: ids }) });
  return deletedCount;
}
