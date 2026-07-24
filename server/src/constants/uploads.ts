/** Mirrors client/src/lib/imageValidation.ts — keep both in sync. */

export const ACCEPTED_IMAGE_EXTENSIONS: readonly string[] = [
  "jpg",
  "jpeg",
  "png",
  "webp",
];

export const ACCEPTED_IMAGE_MIME_TYPES: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_IMAGE_LABEL = ACCEPTED_IMAGE_EXTENSIONS.map((extension) =>
  extension.toUpperCase(),
).join(", ");

export const MAX_IMAGE_SIZE_MB = 5;

export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const UPLOAD_TEMP_DIR = "public/temp/uploads";
