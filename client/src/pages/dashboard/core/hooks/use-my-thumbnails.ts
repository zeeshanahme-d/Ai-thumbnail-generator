import useGetMyThumbnails from "./useGetMyThumbnails";

export default function useMyThumbnails() {
  const { data } = useGetMyThumbnails();
  return {
    data: data?.thumbnails || [],
    isLoading: !data,
  };
}
