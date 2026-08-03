import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { GenerateThumbnailPayload } from "../_models";

const useGenerateThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (payload: GenerateThumbnailPayload) => generateThumbnail(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: thumbnailKeys.all,
      });
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