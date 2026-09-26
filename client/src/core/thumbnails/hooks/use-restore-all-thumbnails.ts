import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreAllThumbnails } from "../_requests";
import { thumbnailKeys } from "./query-keys";

const useRestoreAllThumbnails = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: restoreAllThumbnails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thumbnailKeys.all });
    },
  });

  return { mutate, isPending };
};

export default useRestoreAllThumbnails;
