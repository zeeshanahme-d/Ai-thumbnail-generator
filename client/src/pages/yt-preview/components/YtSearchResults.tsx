import YtHeader from "./YtHeader";
import YtSearchResult from "./YtSearchResult";
import type { YtFeedProps } from "../../../types";

export default function YtSearchResults({ videos, theme }: YtFeedProps) {
  return (
    <>
      <YtHeader theme={theme} query={videos[0]?.title} />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
        {videos.map((video) => (
          <YtSearchResult key={video.id} video={video} theme={theme} />
        ))}
      </div>
    </>
  );
}
