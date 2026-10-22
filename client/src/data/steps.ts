import type { IProcessSetting, IStep, IYtPreviewVideo } from "../types";
import { THUMBNAIL_STYLES, THUMBNAIL_STYLES_COLORS } from "./generator";
import { YT_PREVIEW_NEIGHBORS, YT_PREVIEW_SAMPLE } from "./ytPreview";

export const steps: IStep[] = [
    {
        title: "Describe it",
        description: "Write what the video is about in plain words, or start from a template.",
    },
    {
        title: "Set the controls",
        description: "Pick a style, a size and a color scheme. Add a reference image if you have one.",
    },
    {
        title: "Generate",
        description: "The thumbnail is ready in seconds and saved to your gallery. If it fails, your credits come back.",
    },
    {
        title: "Check it on YouTube",
        description: "Preview it in a home feed, in search and on mobile, in light or dark, before you upload.",
    },
];

// The walkthrough's example: a prompt written to describe the sample thumbnail it turns into.
export const PROCESS_PROMPT =
    "A shocked creator surrounded by floating smartwatches, bold text TOP SMARTWATCH UNDER 1499, glowing blue tech background";

export const PROCESS_SETTINGS: IProcessSetting[] = [
    { label: "Style", value: THUMBNAIL_STYLES[0].label },
    { label: "Size", value: "16:9" },
    { label: "Color", value: THUMBNAIL_STYLES_COLORS[0].label },
];

/** Full-size original, for the large frame. */
export const PROCESS_THUMBNAIL = YT_PREVIEW_SAMPLE.thumbnailUrl;

const withWebp = (video: IYtPreviewVideo): IYtPreviewVideo => ({
    ...video,
    thumbnailUrl: video.thumbnailUrl.replace(/\.jpg$/, ".webp"),
});

// The home feed it lands in: the sample video second, between the other sample videos.
// The square burger thumbnail is left out, since 16:9 feed cards would crop its title.
const [firstNeighbor, ...otherNeighbors] = YT_PREVIEW_NEIGHBORS.filter(({ id }) => id !== "burger");

export const PROCESS_FEED_SLOT = 1;
export const PROCESS_FEED: IYtPreviewVideo[] = [firstNeighbor, YT_PREVIEW_SAMPLE, ...otherNeighbors.slice(0, 4)].map(
    withWebp,
);
