import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { likeThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { PaginatedThumbnailsResponse } from "../_models";
import type { Thumbnail } from "../../../types";

type ThumbnailListData = PaginatedThumbnailsResponse | InfiniteData<PaginatedThumbnailsResponse>;

const toggleLikeInPage = (
  page: PaginatedThumbnailsResponse,
  targetId: string
): PaginatedThumbnailsResponse => {
  return {
    ...page,
    thumbnails: page.thumbnails.map((t: Thumbnail) => {
      if (t._id === targetId) {
        const isCurrentlyLiked = !!t.isLiked;
        return {
          ...t,
          isLiked: !isCurrentlyLiked,
          likesCount: Math.max(0, (t.likesCount || 0) + (isCurrentlyLiked ? -1 : 1)),
        };
      }
      return t;
    }),
  };
};

// List caches hold either one page or every loaded page of an infinite list.
const updateThumbnailInCache = (data: ThumbnailListData | undefined, targetId: string) => {
  if (!data) return data;
  if ("pages" in data) {
    return { ...data, pages: data.pages.map((page) => toggleLikeInPage(page, targetId)) };
  }
  return data.thumbnails ? toggleLikeInPage(data, targetId) : data;
};

const useLikeThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (id: string) => likeThumbnail(id),
    onMutate: async (targetId: string) => {
      await queryClient.cancelQueries({ queryKey: thumbnailKeys.all });

      const previousQueries = queryClient.getQueriesData<ThumbnailListData>({
        queryKey: thumbnailKeys.all,
      });

      queryClient.setQueriesData<ThumbnailListData>(
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
