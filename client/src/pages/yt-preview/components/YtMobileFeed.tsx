import { EllipsisVertical, Play, Search } from "lucide-react";
import YtAvatar from "./YtAvatar";
import YtThumbnail from "./YtThumbnail";
import { ytTheme } from "../theme";
import type { YtFeedProps } from "../../../types";

export default function YtMobileFeed({ videos, theme }: YtFeedProps) {
  const colors = ytTheme[theme];

  return (
    <div className={`flex justify-center p-6 ${colors.surface}`}>
      <div className={`w-full max-w-sm overflow-hidden rounded-[2.5rem] border-8 border-neutral-900 ${colors.page}`}>
        <header className={`flex items-center justify-between px-3 py-3 ${colors.title}`}>
          <span className="flex items-center gap-1 text-sm font-semibold tracking-tight">
            <span className="flex h-4 w-6 items-center justify-center rounded bg-red-600">
              <Play size={9} className="fill-white text-white" />
            </span>
            YouTube
          </span>
          <Search size={20} />
        </header>

        <div className="flex max-h-160 flex-col gap-5 overflow-y-auto pb-6">
          {videos.map((video) => (
            <article key={video.id}>
              <YtThumbnail video={video} className="rounded-none" />
              <div className="mt-2 flex gap-3 px-3">
                <YtAvatar name={video.channelName} imageUrl={video.channelAvatarUrl} />
                <div className="min-w-0 flex-1">
                  <h3 className={`line-clamp-2 text-sm leading-5 ${colors.title}`}>{video.title}</h3>
                  <p className={`mt-0.5 text-xs ${colors.meta}`}>
                    {video.channelName} • {video.views} • {video.publishedAgo}
                  </p>
                </div>
                <EllipsisVertical size={16} className={`shrink-0 ${colors.meta}`} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
