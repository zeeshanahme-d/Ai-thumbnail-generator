import { useQuery } from "@tanstack/react-query";
import { NO_THUMBNAILS } from "../../../lib/thumbnail";
import { getCommunityThumbnails } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { PaginationParams } from "../_models";

const useGetCommunityThumbnails = (
  params?: PaginationParams,
  { enabled = true }: { enabled?: boolean } = {},
) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: thumbnailKeys.community(params),
    queryFn: () => getCommunityThumbnails(params),
    staleTime: 30 * 1000,
    enabled,
  });

  return {
    data: data?.thumbnails ?? NO_THUMBNAILS,
    pagination: data?.meta,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetCommunityThumbnails;
