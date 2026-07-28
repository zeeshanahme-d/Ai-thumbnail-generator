import type { Thumbnail } from "../types";

export function getThumbnailImageUrl(thumbnail: Thumbnail): string {
  return thumbnail.thumbnail?.url ?? thumbnail.image_url ?? "";
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
