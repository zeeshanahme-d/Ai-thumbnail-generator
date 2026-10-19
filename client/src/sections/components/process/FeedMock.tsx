import YtVideoCard from "../../../pages/yt-preview/components/YtVideoCard";
import { ytTheme } from "../../../pages/yt-preview/theme";
import { useTheme } from "../../../store/useTheme";
import type { FeedMockProps } from "../../../types";

// A YouTube home feed in YouTube's own colors (light or dark, following the site theme),
// built from the YouTube preview page's video card.
export default function FeedMock({ videos, slot, className = "" }: FeedMockProps) {
  const theme = useTheme((state) => state.theme);

  return (
    <div className={`grid content-start ${ytTheme[theme].page} ${className}`}>
      {videos.map((video, index) => (
        <div key={video.id} data-process={index === slot ? "slot" : undefined}>
          <YtVideoCard video={video} theme={theme} />
        </div>
      ))}
    </div>
  );
}
