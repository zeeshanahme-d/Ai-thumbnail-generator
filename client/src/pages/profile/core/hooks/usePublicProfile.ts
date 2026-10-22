import { useQuery } from "@tanstack/react-query";
import { getPublicProfileRequest } from "../_requests";

export function usePublicProfile(username?: string) {
  return useQuery({
    queryKey: ["public-profile", username],
    queryFn: () => getPublicProfileRequest(username!),
    enabled: Boolean(username && username.trim().length > 0),
  });
}
