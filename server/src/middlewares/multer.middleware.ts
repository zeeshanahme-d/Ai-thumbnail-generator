import fs from "fs";
import path from "path";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { UploadErrorCode } from "../constants/enums.js";
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
  UPLOAD_TEMP_DIR,
} from "../constants/uploads.js";

fs.mkdirSync(UPLOAD_TEMP_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_TEMP_DIR),
  filename: (_req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/\s+/g, "-");
    cb(null, `${file.fieldname}-${Date.now()}-${safeName}`);
  },
});

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const extension = path.extname(file.originalname).slice(1).toLowerCase();
  const hasAllowedExtension = ACCEPTED_IMAGE_EXTENSIONS.includes(extension);
  const hasAllowedMimeType = ACCEPTED_IMAGE_MIME_TYPES.includes(file.mimetype);

  if (!hasAllowedExtension || !hasAllowedMimeType) {
    return cb(
      new Error(
        `"${file.originalname}" is not a supported image. Use ${ACCEPTED_IMAGE_LABEL}.`,
      ),
    );
  }

  cb(null, true);
};

const multerUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
});

export const uploadSingleImage =
  (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    multerUpload.single(fieldName)(req, res, (error: unknown) => {
      if (!error) return next();

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

        return ApiResponse.error(
          res,
          400,
          error.message,
          UploadErrorCode.UploadFailed,
        );
      }

      return ApiResponse.error(
        res,
        400,
        (error as Error).message,
        UploadErrorCode.InvalidFileType,
      );
    });
  };

export default multerUpload;
