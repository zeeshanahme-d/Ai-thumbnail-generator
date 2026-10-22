import YtHeader from "./YtHeader";
import YtVideoCard from "./YtVideoCard";
import type { YtFeedProps } from "../../../types";

export default function YtHomeFeed({ videos, theme }: YtFeedProps) {
  return (
    <>
      <YtHeader theme={theme} />
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <YtVideoCard key={video.id} video={video} theme={theme} />
        ))}
      </div>
    </>
  );
}
