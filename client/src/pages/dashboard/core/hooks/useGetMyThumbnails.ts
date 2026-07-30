import { useQuery } from "@tanstack/react-query";
import { getMyThumbnails } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import { useSession } from "../../../../store/useSessionStore";
import type { PaginationParams } from "../_models";

const useGetMyThumbnails = (params?: PaginationParams) => {
  const isAuthenticated = useSession((state) => state.isAuthenticated);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: thumbnailKeys.mine(params),
    queryFn: () => getMyThumbnails(params),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  return {
    data,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetMyThumbnails;
