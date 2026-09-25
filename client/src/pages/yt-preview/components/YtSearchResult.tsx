import YtAvatar from "./YtAvatar";
import YtThumbnail from "./YtThumbnail";
import { ytTheme } from "../theme";
import type { YtVideoProps } from "../../../types";

export default function YtSearchResult({ video, theme }: YtVideoProps) {
  const colors = ytTheme[theme];

  return (
    <article className="flex flex-col gap-4 sm:flex-row">
      <YtThumbnail video={video} className="rounded-xl sm:w-90 sm:shrink-0" />
      <div className="min-w-0">
        <h3 className={`line-clamp-2 text-lg leading-6 ${colors.title}`}>{video.title}</h3>
        <p className={`mt-1 text-xs ${colors.meta}`}>
          {video.views} • {video.publishedAgo}
        </p>
        <div className={`mt-3 flex items-center gap-2 text-xs ${colors.meta}`}>
          <YtAvatar name={video.channelName} imageUrl={video.channelAvatarUrl} className="size-6 text-[10px]" />
          {video.channelName}
        </div>
      </div>
    </article>
  );
}
