import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { getCommunityThumbnails, getMyThumbnails, getRecycleBinThumbnails } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import { useSession } from "../../../store/useSessionStore";
import type { PaginatedThumbnailsResponse, ThumbnailListSource } from "../_models";
import type { Thumbnail, ThumbnailFilters } from "../../../types";

interface InfiniteThumbnailsOptions {
  enabled?: boolean;
  /** Keep showing the current results while a changed filter loads. */
  keepResultsWhileLoading?: boolean;
}

const fetchers = {
  mine: getMyThumbnails,
  community: getCommunityThumbnails,
  recycleBin: getRecycleBinThumbnails,
};

// Items can shift between pages when new thumbnails arrive, so repeats are dropped.
function flattenUnique(data?: InfiniteData<PaginatedThumbnailsResponse>): Thumbnail[] {
  const seen = new Set<string>();
  const thumbnails: Thumbnail[] = [];

  for (const page of data?.pages ?? []) {
    for (const thumbnail of page.thumbnails) {
      if (seen.has(thumbnail._id)) continue;
      seen.add(thumbnail._id);
      thumbnails.push(thumbnail);
    }
  }

  return thumbnails;
}

const useInfiniteThumbnails = (
  source: ThumbnailListSource,
  filters: ThumbnailFilters,
  { enabled = true, keepResultsWhileLoading = true }: InfiniteThumbnailsOptions = {},
) => {
  const isAuthenticated = useSession((state) => state.isAuthenticated);

  const query = useInfiniteQuery({
    queryKey: thumbnailKeys.infinite(source, filters),
    queryFn: ({ pageParam }) => fetchers[source]({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.page < meta.totalPages ? meta.page + 1 : undefined),
    placeholderData: keepResultsWhileLoading ? keepPreviousData : undefined,
    enabled: enabled && (source === "community" || isAuthenticated),
    staleTime: 30 * 1000,
  });

  const thumbnails = useMemo(() => flattenUnique(query.data), [query.data]);

  return {
    thumbnails,
    total: query.data?.pages[0]?.meta.total ?? 0,
    isPending: query.isPending,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};

export default useInfiniteThumbnails;
