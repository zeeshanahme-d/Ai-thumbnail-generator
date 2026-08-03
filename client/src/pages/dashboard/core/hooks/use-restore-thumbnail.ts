import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";

const useRestoreThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (id: string) => restoreThumbnail(id),
    onSuccess: () => {
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

export default useRestoreThumbnail;
export { useRestoreThumbnail };
