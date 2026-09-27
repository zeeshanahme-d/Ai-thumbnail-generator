import { useQuery } from "@tanstack/react-query";
import { getThumbnail } from "../_requests";
import { thumbnailKeys } from "./query-keys";
import type { Thumbnail } from "../../../types";

// One thumbnail by id. The card the user clicked, if any, shows while it loads.
const useThumbnail = (id: string, placeholder?: Thumbnail) =>
  useQuery({
    queryKey: thumbnailKeys.detail(id),
    queryFn: () => getThumbnail(id),
    placeholderData: placeholder,
  });

export default useThumbnail;
