import { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import userModel from "../models/user.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";
import likeDislikModel from "../models/likeDislik.modal.js";
import thumbnailModel from "../models/thumbnail.model.js";
import thumbnailViewModel from "../models/thumbnailView.model.js";
import { deleteFileFromCloudinary } from "../utils/cloudniary.js";
import { deleteThumbnailsForever } from "../utils/delete-thumbnails.js";
import { userViewerKey } from "../utils/viewer.js";
import { matchHashedPassword } from "../helper/halper-functions.js";
import { usernameSchema } from "../validations/user-fields.validation.js";

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
      { new: true, runValidators: true },
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
  const excludeUserId = req.query.excludeUserId as string | undefined;

  const parsed = usernameSchema.safeParse(req.params.username ?? "");
  if (!parsed.success) {
    return ApiResponse.error(res, 400, parsed.error.issues[0]?.message ?? "Invalid username.");
  }

  const username = parsed.data;

  // Check if taken — optionally exclude the requester's own username
  const query: Record<string, unknown> = { username };
  if (excludeUserId) {
    query._id = mongoose.trusted({ $ne: excludeUserId });
  }

  const existingUser = await userModel.exists(query);

  return ApiResponse.success(res, 200, existingUser ? "Username is taken." : "Username is available.", {
    available: !existingUser,
  });
}

async function handleGetPublicProfile(req: Request, res: Response) {
  const rawUsername = String(req.params.username || "").trim();
  const username = rawUsername.toLowerCase();

  const user = await userModel
    .findOne({ username })
    .select("fullName username avatar bio website followersCount followingCount createdAt");

  if (!user) {
    return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
  }

  return ApiResponse.success(res, 200, "Public profile fetched.", { user });
}

async function handleDeleteAccount(req: Request, res: Response) {
  const userId = req.user?.userId || req.user?._id;
  if (!userId) {
    return ApiResponse.error(res, 401, "Unauthorized access.");
  }

  const { password } = req.validated!.body;

  const user = await userModel.findById(userId).select("+password");
  if (!user) {
    return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
  }

  if (!user.password || !(await matchHashedPassword(password, user.password))) {
    return ApiResponse.error(res, 400, "Password is incorrect.", "INVALID_PASSWORD");
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

  // Their views stay in the counts; only the records that stopped them counting twice go.
  // ponytail: no index on viewerKey alone, so this scans the view records; add one if deletions get slow.
  await thumbnailViewModel.deleteMany({ viewerKey: userViewerKey(String(userId)) });

  // The user's thumbnails go with their images and the likes other users gave them.
  await deleteThumbnailsForever({ userId });
  await refreshTokenModel.deleteMany({ userId });
  await userModel.findByIdAndDelete(userId);

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



