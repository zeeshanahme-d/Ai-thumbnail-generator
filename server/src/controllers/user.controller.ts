import { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import userModel from "../models/user.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";
import likeDislikModel from "../models/likeDislik.modal.js";
import thumbnailModel from "../models/thumbnail.model.js";
import { deleteFileFromCloudinary } from "../utils/cloudniary.js";
import { deleteThumbnailsForever } from "../utils/delete-thumbnails.js";
import { matchHashedPassword } from "../helper/halper-functions.js";
import { usernameSchema } from "../validations/user-fields.validation.js";
import { isLiveSubscription } from "../utils/billing.js";
import paddle from "../config/paddle.js";
import logger from "../utils/logger.js";

async function handleUpdateUserProfile(req: Request, res: Response) {
  const { fullName, username, bio, website } = req.validated!.body;
  const userId = req.user?.userId || req.user?._id;

  if (!userId) {
    return ApiResponse.error(res, 401, "Unauthorized access.");
  }

  // Only set fields that were actually sent in the request body
  const updateFields: Record<string, unknown> = {};
  if (fullName !== undefined) updateFields.fullName = fullName;
  // An empty username keeps the current one.
  if (username) updateFields.username = username;
  if (bio !== undefined) updateFields.bio = bio;
  if (website !== undefined) updateFields.website = website;

  const updatedUser = await userModel
    .findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { returnDocument: "after", runValidators: true },
    )
    .select("-password");

  if (!updatedUser) {
    return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
  }

  return ApiResponse.success(res, 200, "Profile updated successfully.", {
    user: updatedUser,
  });
}

async function handleCheckUsername(req: Request, res: Response) {
  const parsed = usernameSchema.safeParse(req.params.username ?? "");
  if (!parsed.success) {
    return ApiResponse.error(res, 400, parsed.error.issues[0]?.message ?? "Invalid username.");
  }

  // The requester's own username counts as available, so their current one never reads as taken.
  const existingUser = await userModel.exists({
    username: parsed.data,
    _id: mongoose.trusted({ $ne: req.user!.userId }),
  });

  return ApiResponse.success(res, 200, existingUser ? "Username is taken." : "Username is available.", {
    available: !existingUser,
  });
}

async function handleGetPublicProfile(req: Request, res: Response) {
  const rawUsername = String(req.params.username || "").trim();
  const username = rawUsername.toLowerCase();

  const user = await userModel
    .findOne({ username })
    .select("fullName username avatar.url bio website followersCount followingCount createdAt");

  if (!user) {
    return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
  }

  // Likes across everything they have published, not just the cards a page has loaded.
  const [likes] = await thumbnailModel.aggregate<{ total: number }>([
    { $match: { userId: user._id, published: true, deletedAt: null } },
    { $group: { _id: null, total: { $sum: "$likesCount" } } },
  ]);

  return ApiResponse.success(res, 200, "Public profile fetched.", { user, likesCount: likes?.total ?? 0 });
}

async function handleDeleteAccount(req: Request, res: Response) {
  const userId = req.user?.userId || req.user?._id;
  if (!userId) {
    return ApiResponse.error(res, 401, "Unauthorized access.");
  }

  const { password } = req.validated!.body;

  const user = await userModel.findById(userId).select("+password +avatar.publicId");
  if (!user) {
    return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
  }

  if (!user.password || !(await matchHashedPassword(password, user.password))) {
    return ApiResponse.error(res, 400, "Password is incorrect.", "INVALID_PASSWORD");
  }

  // Otherwise Paddle keeps charging a customer whose account is gone. A failure stops the deletion.
  if (user.subscriptionId && isLiveSubscription(user.subscriptionStatus)) {
    await paddle().subscriptions.cancel(user.subscriptionId, { effectiveFrom: "immediately" });
    logger.info("Subscription canceled for account deletion", { userId: String(userId), subscriptionId: user.subscriptionId });
  }

  // Delete avatar from Cloudinary if it exists
  if (user.avatar?.publicId) {
    await deleteFileFromCloudinary(user.avatar.publicId);
  }

  // Take this user's likes off other thumbnails' counts. A user likes a thumbnail at most once.
  const likedThumbnailIds = await likeDislikModel.distinct("thumbnailId", { userId });
  await thumbnailModel.updateMany(
    { _id: mongoose.trusted({ $in: likedThumbnailIds }), likesCount: mongoose.trusted({ $gt: 0 }) },
    { $inc: { likesCount: -1 } },
  );
  await likeDislikModel.deleteMany({ userId });


  // The user's thumbnails go with their images and the likes other users gave them.
  await deleteThumbnailsForever({ userId });
  await refreshTokenModel.deleteMany({ userId });
  await userModel.findByIdAndDelete(userId);
  logger.info("Account deleted", { userId: String(userId) });

  // Clear auth cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return ApiResponse.success(res, 200, "Account deleted successfully.");
}

export {
  handleUpdateUserProfile,
  handleCheckUsername,
  handleGetPublicProfile,
  handleDeleteAccount,
};



