import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";

const useDeleteThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (id: string) => deleteThumbnail(id),
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

export default useDeleteThumbnail;
export { useDeleteThumbnail };
