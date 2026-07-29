import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { Thumbnail } from "../../../../types";

export function useRestoreThumbnail() {
  const queryClient = useQueryClient();

  return useMutation<Thumbnail, unknown, string>({
    mutationFn: restoreThumbnail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thumbnailKeys.all });
    },
  });
}
