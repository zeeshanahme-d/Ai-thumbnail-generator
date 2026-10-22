import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { likeThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { PaginatedThumbnailsResponse } from "../_models";
import type { Thumbnail } from "../../../types";

type ThumbnailCacheData = PaginatedThumbnailsResponse | InfiniteData<PaginatedThumbnailsResponse> | Thumbnail;

const toggleLike = (t: Thumbnail): Thumbnail => ({
  ...t,
  isLiked: !t.isLiked,
  likesCount: Math.max(0, (t.likesCount || 0) + (t.isLiked ? -1 : 1)),
});

const toggleLikeInPage = (
  page: PaginatedThumbnailsResponse,
  targetId: string
): PaginatedThumbnailsResponse => ({
  ...page,
  thumbnails: page.thumbnails.map((t) => (t._id === targetId ? toggleLike(t) : t)),
});

// List caches hold one page or every loaded page of an infinite list; detail caches hold one thumbnail.
const updateThumbnailInCache = (data: ThumbnailCacheData | undefined, targetId: string) => {
  if (!data) return data;
  if ("pages" in data) {
    return { ...data, pages: data.pages.map((page) => toggleLikeInPage(page, targetId)) };
  }
  if ("thumbnails" in data) return toggleLikeInPage(data, targetId);
  return data._id === targetId ? toggleLike(data) : data;
};

const useLikeThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (id: string) => likeThumbnail(id),
    onMutate: async (targetId: string) => {
      await queryClient.cancelQueries({ queryKey: thumbnailKeys.all });

      const previousQueries = queryClient.getQueriesData<ThumbnailCacheData>({
        queryKey: thumbnailKeys.all,
      });

      queryClient.setQueriesData<ThumbnailCacheData>(
        { queryKey: thumbnailKeys.all },
        (oldData) => updateThumbnailInCache(oldData, targetId)
      );

      return { previousQueries };
    },
    onError: (_err, _targetId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: thumbnailKeys.all });
    },
  });

  return {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  };
};

export default useLikeThumbnail;
