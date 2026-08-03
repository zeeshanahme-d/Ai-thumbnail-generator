import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permanentDeleteThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";

const usePermanentDeleteThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (id: string) => permanentDeleteThumbnail(id),
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

export default usePermanentDeleteThumbnail;
export { usePermanentDeleteThumbnail };
