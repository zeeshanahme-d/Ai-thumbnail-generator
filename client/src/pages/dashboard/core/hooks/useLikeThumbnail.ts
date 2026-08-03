import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { PaginatedThumbnailsResponse } from "../_models";
import type { Thumbnail } from "../../../../types";

const updateThumbnailInResponse = (
  response: PaginatedThumbnailsResponse | undefined,
  targetId: string
): PaginatedThumbnailsResponse | undefined => {
  if (!response?.thumbnails) return response;

  return {
    ...response,
    thumbnails: response.thumbnails.map((t: Thumbnail) => {
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

const useLikeThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (id: string) => likeThumbnail(id),
    onMutate: async (targetId: string) => {
      await queryClient.cancelQueries({ queryKey: thumbnailKeys.all });

      const previousQueries = queryClient.getQueriesData<PaginatedThumbnailsResponse>({
        queryKey: thumbnailKeys.all,
      });

      queryClient.setQueriesData<PaginatedThumbnailsResponse>(
        { queryKey: thumbnailKeys.all },
        (oldData) => updateThumbnailInResponse(oldData, targetId)
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
