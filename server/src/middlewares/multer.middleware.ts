import path from "path";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { UploadErrorCode } from "../constants/enums.js";
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
} from "../constants/uploads.js";

const unsupportedImageMessage = (fileName: string) =>
  `"${fileName}" is not a supported image. Use ${ACCEPTED_IMAGE_LABEL}.`;

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const extension = path.extname(file.originalname).slice(1).toLowerCase();
  const hasAllowedExtension = ACCEPTED_IMAGE_EXTENSIONS.includes(extension);
  const hasAllowedMimeType = ACCEPTED_IMAGE_MIME_TYPES.includes(file.mimetype);

  if (!hasAllowedExtension || !hasAllowedMimeType) {
    return cb(new Error(unsupportedImageMessage(file.originalname)));
  }

  cb(null, true);
};

// Kept in memory (one file, at most MAX_IMAGE_SIZE_BYTES) and streamed to Cloudinary from there.
const multerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
});

function sendMulterError(res: Response, error: unknown, fieldName: string) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return ApiResponse.error(
        res,
        400,
        `Image is too large. Maximum size is ${MAX_IMAGE_SIZE_MB} MB.`,
        UploadErrorCode.FileTooLarge,
      );
    }

    // Sent under a different form field than the one we expect.
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return ApiResponse.error(
        res,
        400,
        `Unexpected file field "${error.field}". Send the image as "${fieldName}".`,
        UploadErrorCode.InvalidFileType,
      );
    }

    return ApiResponse.error(res, 400, error.message, UploadErrorCode.UploadFailed);
  }

  return ApiResponse.error(res, 400, (error as Error).message, UploadErrorCode.InvalidFileType);
}

export const uploadSingleImage =
  (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    multerUpload.single(fieldName)(req, res, async (error: unknown) => {
      if (error) return sendMulterError(res, error, fieldName);
      if (!req.file) return next();

      try {
        // The name and browser-reported type can be faked, so check the file's actual bytes.
        const detected = await fileTypeFromBuffer(req.file.buffer);
        if (!detected || !ACCEPTED_IMAGE_MIME_TYPES.includes(detected.mime)) {
          return ApiResponse.error(
            res,
            400,
            unsupportedImageMessage(req.file.originalname),
            UploadErrorCode.InvalidFileType,
          );
        }

        req.file.mimetype = detected.mime;
        next();
      } catch (checkError) {
        next(checkError);
      }
    });
  };

export default multerUpload;
