import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emptyRecycleBin } from "../_requests";
import { thumbnailKeys } from "./query-keys";

const useEmptyRecycleBin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: emptyRecycleBin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thumbnailKeys.all });
    },
  });

  return { mutate, isPending };
};

export default useEmptyRecycleBin;
