import type { Request, Response } from "express";
import uploadFileOnCloudniary from "../utils/cloudniary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { UploadErrorCode } from "../constants/enums.js";

// File type/size are already rejected by uploadSingleImage before this runs.
async function handleUploadImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return ApiResponse.error(
        res,
        400,
        "No image received. Send the request as multipart/form-data with the file under the 'imageFile' field.",
        UploadErrorCode.FileMissing,
      );
    }

    const result = await uploadFileOnCloudniary(req.file.path, "references");

    if (!result) {
      return ApiResponse.error(
        res,
        502,
        "Image upload failed. Please try again.",
        UploadErrorCode.UploadFailed,
      );
    }

    return ApiResponse.success(res, 201, "Image uploaded successfully.", {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

export { handleUploadImage };
