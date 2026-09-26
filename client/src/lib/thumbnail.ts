import dayjs from "dayjs";
import type { Thumbnail } from "../types";

// Mirrors RECYCLE_BIN_RETENTION_MS in server/src/constants/constants.ts.
export const RECYCLE_BIN_RETENTION_DAYS = 30;

// One shared empty list, so hooks return the same reference while data loads.
export const NO_THUMBNAILS: Thumbnail[] = [];

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

// Compact age for thumbnail cards: 45s, 12min, 3h, 2d, 1w, 5mo, 1y.
export function getShortTimeAgo(date: string, now: dayjs.ConfigType = undefined): string {
  if (!date) return "";
  const current = dayjs(now);
  const created = dayjs(date);

  const seconds = Math.max(0, current.diff(created, "second"));
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

  const days = current.diff(created, "day");
  if (days < 7) return `${days}d`;

  const months = current.diff(created, "month");
  if (months < 1) return `${Math.floor(days / 7)}w`;
  if (months < 12) return `${months}mo`;
  return `${current.diff(created, "year")}y`;
}

export function buildThumbnailTitle(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return "Untitled thumbnail";

  const firstLine = trimmed.split("\n")[0]?.trim() ?? trimmed;
  return firstLine.length > 200 ? `${firstLine.slice(0, 197)}...` : firstLine;
}
