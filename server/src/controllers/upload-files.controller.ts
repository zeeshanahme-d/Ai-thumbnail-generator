import type { Request, Response } from "express";
import uploadFileOnCloudniary, { deleteFileFromCloudinary } from "../utils/cloudniary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { UploadErrorCode } from "../constants/enums.js";
import userModel from "../models/user.model.js";

// File type/size are already rejected by uploadSingleImage before this runs.
async function handleUploadAvatar(req: Request, res: Response) {
  try {
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized access.");
    }

    if (!req.file) {
      return ApiResponse.error(
        res,
        400,
        "No image received. Send the request as multipart/form-data with the file under the 'avatar' field.",
        UploadErrorCode.FileMissing,
      );
    }

    // Fetch user to get old avatar publicId
    const currentUser = await userModel.findById(userId);
    if (!currentUser) {
      return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
    }

    // Delete old avatar from Cloudinary if it exists
    if (currentUser.avatar && currentUser.avatar.publicId) {
      await deleteFileFromCloudinary(currentUser.avatar.publicId);
    }

    const result = await uploadFileOnCloudniary(req.file.path, "avatar");

    if (!result) {
      return ApiResponse.error(
        res,
        502,
        "Image upload failed. Please try again.",
        UploadErrorCode.UploadFailed,
      );
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: {
            url: result.secure_url,
            publicId: result.public_id,
            originalName: result.original_filename,
            directory: result.asset_folder,
            format: result.format,
            bytes: result.bytes,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
    }

    return ApiResponse.success(
      res,
      200,
      "Profile picture uploaded successfully.",
      { user: updatedUser }
    );
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

export { handleUploadAvatar };
