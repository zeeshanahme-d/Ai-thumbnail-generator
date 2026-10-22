import { EllipsisVertical } from "lucide-react";
import YtAvatar from "./YtAvatar";
import YtThumbnail from "./YtThumbnail";
import { ytTheme } from "../theme";
import type { YtVideoProps } from "../../../types";

export default function YtVideoCard({ video, theme }: YtVideoProps) {
  const colors = ytTheme[theme];

  return (
    <article>
      <YtThumbnail video={video} />
      <div className="mt-3 flex gap-3">
        <YtAvatar name={video.channelName} imageUrl={video.channelAvatarUrl} />
        <div className="min-w-0 flex-1">
          <h3 className={`line-clamp-2 text-sm font-semibold leading-5 ${colors.title}`}>
            {video.title}
          </h3>
          <p className={`mt-1 text-xs ${colors.meta}`}>{video.channelName}</p>
          <p className={`text-xs ${colors.meta}`}>
            {video.views} • {video.publishedAgo}
          </p>
        </div>
        <EllipsisVertical size={18} className={`shrink-0 ${colors.meta}`} />
      </div>
    </article>
  );
}
