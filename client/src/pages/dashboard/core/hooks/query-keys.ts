import type { PaginationParams } from "../_models";

export const thumbnailKeys = {
  all: ["thumbnails"] as const,
  mine: (params?: PaginationParams) =>
    [...thumbnailKeys.all, "mine", params] as const,
  community: (params?: PaginationParams) =>
    [...thumbnailKeys.all, "community", params] as const,
  recycleBin: (params?: PaginationParams) =>
    [...thumbnailKeys.all, "recycleBin", params] as const,
};
