import { useQuery } from "@tanstack/react-query";
import { checkUsernameRequest } from "../_requests";
import { usernameSchema } from "../../../../lib/userValidation";

export function useCheckUsername(username?: string, excludeUserId?: string) {
  const clean = username?.trim().toLowerCase() || "";
  const isValidFormat = usernameSchema.safeParse(clean).success;

  return useQuery({
    queryKey: ["check-username", clean, excludeUserId],
    queryFn: () => checkUsernameRequest(clean, excludeUserId),
    enabled: isValidFormat,
    staleTime: 1000 * 30,
    retry: false,
  });
}
