import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MonitorPlay } from "lucide-react";
import Wrapper from "../../components/Wrapper";
import BackButton from "../../components/BackButton";
import Alert from "../../components/Alert";
import TabSwitcher from "../../components/TabSwitcher";
import YtHomeFeed from "./components/YtHomeFeed";
import YtSearchResults from "./components/YtSearchResults";
import YtMobileFeed from "./components/YtMobileFeed";
import { ytTheme } from "./theme";
import { useSession } from "../../store/useSessionStore";
import { getThumbnailImageUrl } from "../../lib/thumbnail";
import {
  YT_PREVIEW_LAYOUTS,
  YT_PREVIEW_NEIGHBORS,
  YT_PREVIEW_SAMPLE,
  YT_PREVIEW_THEMES,
} from "../../data/ytPreview";
import type { IUser, IYtPreviewVideo, Thumbnail, YtPreviewState } from "../../types";

const FEEDS = {
  home: YtHomeFeed,
  search: YtSearchResults,
  mobile: YtMobileFeed,
};

// Presents the thumbnail as a fresh upload on its creator's channel.
function toPreviewVideo(thumbnail: Thumbnail, user: IUser | null): IYtPreviewVideo {
  const creator = typeof thumbnail.userId === "object" ? thumbnail.userId : undefined;

  return {
    id: thumbnail._id,
    title: thumbnail.title,
    thumbnailUrl: getThumbnailImageUrl(thumbnail),
    channelName: creator?.fullName ?? user?.fullName ?? "Your channel",
    channelAvatarUrl: creator?.avatar?.url || user?.avatar?.url || undefined,
    views: "1.2K views",
    publishedAgo: "2 hours ago",
    duration: "10:24",
  };
}

export default function YtPreview() {
  const location = useLocation();
  const user = useSession((state) => state.user);
  const thumbnail = (location.state as YtPreviewState | null)?.thumbnail;
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);

  const theme = YT_PREVIEW_THEMES[themeIndex].value;
  const Feed = FEEDS[YT_PREVIEW_LAYOUTS[layoutIndex].value];
  const featured = thumbnail ? toPreviewVideo(thumbnail, user) : YT_PREVIEW_SAMPLE;
  // Placed among the other videos, not first, so it has to stand out the way it would in a real feed.
  const middle = Math.floor(YT_PREVIEW_NEIGHBORS.length / 2);
  const videos = [
    ...YT_PREVIEW_NEIGHBORS.slice(0, middle),
    featured,
    ...YT_PREVIEW_NEIGHBORS.slice(middle),
  ];

  return (
    <main className="py-8 lg:py-10">
      <Wrapper>
        <BackButton />

        <div className="mt-6 flex items-center gap-2 text-primary">
          <MonitorPlay size={18} />
          <span className="text-xs font-semibold uppercase tracking-wide">YouTube preview</span>
        </div>
        <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl md:text-4xl">
          See it the way <span className="text-primary">viewers</span> will
        </h1>
        <p className="mt-2 max-w-lg text-sm text-text-secondary">
          Check how your thumbnail stands out next to other videos on the home feed, in
          search results and on a phone.
        </p>

        {!thumbnail && (
          <Alert variant="info" className="mt-6">
            Showing a sample. Open one of your thumbnails and choose YouTube preview to see
            it here.{" "}
            <Link to="/dashboard/gallery" className="font-medium text-primary hover:underline">
              Go to my gallery
            </Link>
          </Alert>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <TabSwitcher tabs={YT_PREVIEW_LAYOUTS} selectedTab={layoutIndex} onSelectTab={setLayoutIndex} />
          <TabSwitcher tabs={YT_PREVIEW_THEMES} selectedTab={themeIndex} onSelectTab={setThemeIndex} />
        </div>

        <div className={`mt-6 overflow-hidden rounded-2xl border border-border ${ytTheme[theme].page}`}>
          <Feed videos={videos} theme={theme} searchQuery={featured.title} />
        </div>
      </Wrapper>
    </main>
  );
}
