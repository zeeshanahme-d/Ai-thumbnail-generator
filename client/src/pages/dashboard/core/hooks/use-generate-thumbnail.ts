import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { GenerateThumbnailPayload } from "../_models";
import type { Thumbnail } from "../../../../types";

const useGenerateThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate: generateThumbnailMutate, mutateAsync: generateThumbnailMutateAsync, isPending, isSuccess, isError, error, data, reset } = useMutation<Thumbnail, unknown, GenerateThumbnailPayload>({
    mutationFn: generateThumbnail,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: thumbnailKeys.mine(false),
      });
    },
  });

  return {
    generateThumbnailMutate,
    generateThumbnailMutateAsync,
    isPending,
    isSuccess,
    isError,
    error,
    data,
    reset,
  };
};

export default useGenerateThumbnail;