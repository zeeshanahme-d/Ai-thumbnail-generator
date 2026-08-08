import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import userModel from "../models/user.model.js";

async function handleUpdateUserProfile(req: Request, res: Response) {
  try {
    const { fullName, username, bio, website } = req.validated!.body;
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized access.");
    }

    // Only set fields that were actually sent in the request body
    const updateFields: Record<string, unknown> = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (username !== undefined) updateFields.username = username;
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
  } catch (error: unknown) {
    // Handle MongoDB duplicate key error (e.g. username taken)
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 11000) {
      return ApiResponse.error(res, 409, "Username is already taken.", "DUPLICATE_USERNAME");
    }
    return ApiResponse.error(res, 500, "Failed to update profile.");
  }
}


async function handleCheckUsername(req: Request, res: Response) {
  try {
    const rawUsername = String(req.params.username || "").trim();
    const excludeUserId = req.query.excludeUserId as string | undefined;

    // Validate format
    if (!rawUsername || rawUsername.length < 3 || rawUsername.length > 30) {
      return ApiResponse.error(res, 400, "Username must be between 3 and 30 characters.");
    }

    if (!/^[a-z0-9_]+$/i.test(rawUsername)) {
      return ApiResponse.error(res, 400, "Username can only contain lowercase letters, numbers, and underscores.");
    }

    const username = rawUsername.toLowerCase();

    // Check if taken — optionally exclude the requester's own username
    const query: Record<string, unknown> = { username };
    if (excludeUserId) {
      query._id = { $ne: excludeUserId };
    }

    const existingUser = await userModel.exists(query);

    return ApiResponse.success(res, 200, existingUser ? "Username is taken." : "Username is available.", {
      available: !existingUser,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

async function handleGetPublicProfile(req: Request, res: Response) {
  try {
    const rawUsername = String(req.params.username || "").trim();
    const username = rawUsername.toLowerCase();

    const user = await userModel
      .findOne({ username })
      .select("fullName username avatar bio website followersCount followingCount createdAt");

    if (!user) {
      return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
    }

    return ApiResponse.success(res, 200, "Public profile fetched.", { user });
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

export { handleUpdateUserProfile, handleCheckUsername, handleGetPublicProfile };

