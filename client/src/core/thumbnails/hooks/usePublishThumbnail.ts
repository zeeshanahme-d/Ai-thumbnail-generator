import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";

interface PublishParams {
  id: string;
  published: boolean;
}

const usePublishThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: ({ id, published }: PublishParams) => publishThumbnail(id, published),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: thumbnailKeys.all,
      });
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

export default usePublishThumbnail;
