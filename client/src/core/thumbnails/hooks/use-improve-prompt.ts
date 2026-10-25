import { useMutation } from "@tanstack/react-query";
import { improvePrompt } from "../_requests";
import type { ImprovePromptPayload } from "../_models";

// Asks the server to rewrite a prompt into a thumbnail brief. Resolves to the new prompt.
const useImprovePrompt = () => {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ImprovePromptPayload) => improvePrompt(payload),
  });

  return { mutate, mutateAsync, isPending };
};

export default useImprovePrompt;
