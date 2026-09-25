import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import { useSyncSessionUser } from "../../../auth/core/hooks";
import type { GenerateThumbnailPayload, PaginatedThumbnailsResponse } from "../_models";
import type { Thumbnail } from "../../../../types";

const useGenerateThumbnail = () => {
  const queryClient = useQueryClient();
  const syncSessionUser = useSyncSessionUser();

  const { mutate, mutateAsync, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (payload: GenerateThumbnailPayload) => generateThumbnail(payload),
    onSuccess: (newThumbnail: Thumbnail) => {
      if (newThumbnail && newThumbnail._id) {
        // Prepend directly into existing cached mine queries
        queryClient.setQueriesData<PaginatedThumbnailsResponse>(
          { queryKey: ["thumbnails", "mine"] },
          (old) => {
            if (!old) return old;
            // Prevent duplicate entries
            const exists = old.thumbnails.some((t) => t._id === newThumbnail._id);
            if (exists) return old;
            return {
              ...old,
              thumbnails: [newThumbnail, ...old.thumbnails],
              meta: {
                ...old.meta,
                total: (old.meta?.total ?? old.thumbnails.length) + 1,
              },
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: thumbnailKeys.all,
      });

      // The balance shown on the page comes from the session user.
      syncSessionUser().catch(() => {});
    },
  });

  return {
    mutate,
    mutateAsync,
    generateThumbnailMutate: mutate,
    generateThumbnailMutateAsync: mutateAsync,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useGenerateThumbnail;