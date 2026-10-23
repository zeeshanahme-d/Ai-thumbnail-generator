import type { CommunitySort } from "../types";

export const ALL_STYLES = "All Styles";

// style label -> tailwind dot color, shared by the filter pills and card badges
export const STYLE_DOTS: Record<string, string> = {
    "Bold & Graphic": "bg-red-500",
    Minimalist: "bg-gray-400",
    Photorealistic: "bg-amber-500",
    Illustrated: "bg-teal-500",
    "Tech/Futuristic": "bg-purple-500",
};

export const STYLE_FILTERS: string[] = [ALL_STYLES, ...Object.keys(STYLE_DOTS)];

export const SORT_TABS: { label: string; value: CommunitySort }[] = [
    { label: "Trending", value: "trending" },
    { label: "Newest", value: "newest" },
    { label: "Most Liked", value: "most-liked" },
];

