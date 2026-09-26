import { useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { restoreThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";

const RESTORE_MUTATION_KEY = [...thumbnailKeys.all, "restore"];

const useRestoreThumbnail = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: RESTORE_MUTATION_KEY,
    mutationFn: (id: string) => restoreThumbnail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thumbnailKeys.all });
    },
  });

  // Ids of every restore still in flight, so each card can show its own progress.
  const restoringIds = useMutationState({
    filters: { mutationKey: RESTORE_MUTATION_KEY, status: "pending" },
    select: (mutation) => mutation.state.variables as string,
  });

  return {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
    restoringIds,
  };
};

export default useRestoreThumbnail;
export { useRestoreThumbnail };
