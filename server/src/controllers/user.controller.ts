import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import userModel from "../models/user.model.js";

async function handleUpdateUserProfile(req: Request, res: Response) {
  try {
    const { fullName, username, bio, website } = req.body;
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
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return ApiResponse.error(
        res,
        409,
        "Username is already taken.",
        "DUPLICATE_USERNAME",
      );
    }
    return ApiResponse.error(res, 500, "Failed to update profile.");
  }
}

export { handleUpdateUserProfile };

