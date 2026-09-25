import type { Thumbnail } from "../types";

const CARD_IMAGE_WIDTH = 640;
const CLOUDINARY_UPLOAD_PATH = "/image/upload/";

export function getThumbnailImageUrl(thumbnail: Thumbnail): string {
  return thumbnail.thumbnail?.url ?? thumbnail.image_url ?? "";
}

// Smaller, auto-format rendition for grid cards. Non-Cloudinary URLs are returned as is.
export function getThumbnailCardImageUrl(thumbnail: Thumbnail): string {
  const url = getThumbnailImageUrl(thumbnail);
  if (!url.startsWith("https://res.cloudinary.com/") || !url.includes(CLOUDINARY_UPLOAD_PATH)) {
    return url;
  }
  return url.replace(
    CLOUDINARY_UPLOAD_PATH,
    `${CLOUDINARY_UPLOAD_PATH}f_auto,q_auto,w_${CARD_IMAGE_WIDTH}/`,
  );
}

export function getThumbnailAuthorName(thumbnail: Thumbnail): string {
  if (!thumbnail.userId || typeof thumbnail.userId === "string") {
    return "You";
  }

  return (
    thumbnail.userId.fullName ?? thumbnail.userId.name ?? "Anonymous"
  );
}

export function buildThumbnailTitle(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return "Untitled thumbnail";

  const firstLine = trimmed.split("\n")[0]?.trim() ?? trimmed;
  return firstLine.length > 200 ? `${firstLine.slice(0, 197)}...` : firstLine;
}
