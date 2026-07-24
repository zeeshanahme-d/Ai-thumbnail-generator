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
    { label: "Featured", value: "featured" },
];

// Mock data has no likes/views — derive stable numbers from the id so sorting is deterministic.
export const getEngagement = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return { likes: hash % 40, views: 3 + (hash % 280) };
};
