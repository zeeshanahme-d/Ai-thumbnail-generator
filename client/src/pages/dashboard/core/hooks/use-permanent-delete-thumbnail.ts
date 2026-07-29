import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permanentDeleteThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";

export function usePermanentDeleteThumbnail() {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, string>({
    mutationFn: permanentDeleteThumbnail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thumbnailKeys.mine(true) });
    },
  });
}
