import { useQuery } from "@tanstack/react-query";
import { getCommunityThumbnails } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { PaginationParams } from "../_models";

const useGetCommunityThumbnails = (params?: PaginationParams) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: thumbnailKeys.community(params),
    queryFn: () => getCommunityThumbnails(params),
    staleTime: 30 * 1000,
  });

  return {
    data: data?.thumbnails || [],
    pagination: data?.meta,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetCommunityThumbnails;
