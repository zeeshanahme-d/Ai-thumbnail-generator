import { useQuery } from "@tanstack/react-query";
import { checkUsernameRequest } from "../_requests";

export function useCheckUsername(username?: string, excludeUserId?: string) {
  const clean = username?.trim().toLowerCase() || "";
  const isValidFormat =
    clean.length >= 3 && clean.length <= 30 && /^[a-z0-9_]+$/.test(clean);

  return useQuery({
    queryKey: ["check-username", clean, excludeUserId],
    queryFn: () => checkUsernameRequest(clean, excludeUserId),
    enabled: isValidFormat,
    staleTime: 1000 * 30,
    retry: false,
  });
}
