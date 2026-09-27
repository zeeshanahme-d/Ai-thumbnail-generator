import type { PaginationParams, ThumbnailListSource } from "../_models";
import type { ThumbnailFilters } from "../../../types";

export const thumbnailKeys = {
  all: ["thumbnails"] as const,
  mine: (params?: PaginationParams) =>
    [...thumbnailKeys.all, "mine", params] as const,
  community: (params?: PaginationParams) =>
    [...thumbnailKeys.all, "community", params] as const,
  infinite: (source: ThumbnailListSource, filters: ThumbnailFilters) =>
    [...thumbnailKeys.all, "infinite", source, filters] as const,
  detail: (id: string) => [...thumbnailKeys.all, "detail", id] as const,
};
