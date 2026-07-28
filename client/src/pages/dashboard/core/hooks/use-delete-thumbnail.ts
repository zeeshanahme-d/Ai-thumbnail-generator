import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { Thumbnail } from "../../../../types";

export function useDeleteThumbnail() {
  const queryClient = useQueryClient();

  return useMutation<Thumbnail, unknown, string>({
    mutationFn: deleteThumbnail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thumbnailKeys.all });
    },
  });
}
