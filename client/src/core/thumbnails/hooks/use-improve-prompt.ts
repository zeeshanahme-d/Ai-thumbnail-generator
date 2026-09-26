import { useMutation } from "@tanstack/react-query";
import { improvePrompt } from "../_requests";

// Asks the server to rewrite a prompt into a more detailed one. Resolves to the new prompt.
const useImprovePrompt = () => {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (prompt: string) => improvePrompt(prompt),
  });

  return { mutate, mutateAsync, isPending };
};

export default useImprovePrompt;
