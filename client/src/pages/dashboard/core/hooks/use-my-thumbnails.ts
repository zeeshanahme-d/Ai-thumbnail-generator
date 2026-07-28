import { useQuery } from "@tanstack/react-query";
import { getMyThumbnails } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import { useSession } from "../../../../store/useSessionStore";
import type { Thumbnail } from "../../../../types";

export default function useMyThumbnails(deleted = false) {
  const isAuthenticated = useSession((state) => state.isAuthenticated);

  return useQuery<Thumbnail[]>({
    queryKey: thumbnailKeys.mine(deleted),
    queryFn: async () => {
      const result = await getMyThumbnails(deleted);
      return result.thumbnails;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}
