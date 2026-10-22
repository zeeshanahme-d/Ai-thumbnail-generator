import type { IYtPreviewVideo, YtPreviewLayout, YtPreviewTheme } from "../types";

export const YT_PREVIEW_LAYOUTS: { label: string; value: YtPreviewLayout }[] = [
    { label: "Home feed", value: "home" },
    { label: "Search", value: "search" },
    { label: "Mobile", value: "mobile" },
];

export const YT_PREVIEW_THEMES: { label: string; value: YtPreviewTheme }[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
];

// Shown when the page is opened without a thumbnail.
export const YT_PREVIEW_SAMPLE: IYtPreviewVideo = {
    id: "sample",
    title: "Top 5 Smartwatches Under 1499 You Can Buy Right Now",
    thumbnailUrl: "/assets/thumb_1.jpg",
    channelName: "Gadget Guru",
    views: "248K views",
    publishedAgo: "2 days ago",
    duration: "12:08",
};

// Other videos around the featured thumbnail, so it can be judged in context.
export const YT_PREVIEW_NEIGHBORS: IYtPreviewVideo[] = [
    {
        id: "money",
        title: "How I Made $100K in 10 Days (Step by Step)",
        thumbnailUrl: "/assets/thumb_2.jpg",
        channelName: "Money Mindset",
        views: "1.2M views",
        publishedAgo: "1 week ago",
        duration: "18:42",
    },
    {
        id: "nextjs",
        title: "Learn Next.js 16 by Building a Real Project",
        thumbnailUrl: "/assets/thumb_3.jpg",
        channelName: "Code With Ravi",
        views: "89K views",
        publishedAgo: "4 days ago",
        duration: "2:14:30",
    },
    {
        id: "photoshop",
        title: "Learn Photoshop Fast: Master the Basics in 20 Minutes",
        thumbnailUrl: "/assets/thumb_4.jpg",
        channelName: "Design Daily",
        views: "412K views",
        publishedAgo: "3 weeks ago",
        duration: "20:05",
    },
    {
        id: "burger",
        title: "Make a Juicy Burger at Home in 30 Minutes",
        thumbnailUrl: "/assets/thumb_5.jpg",
        channelName: "Street Kitchen",
        views: "63K views",
        publishedAgo: "5 days ago",
        duration: "9:47",
    },
    {
        id: "fullstack",
        title: "Learn Full Stack Development: The Complete Roadmap",
        thumbnailUrl: "/assets/thumb_6.jpg",
        channelName: "Dev Journey",
        views: "730K views",
        publishedAgo: "1 month ago",
        duration: "45:12",
    },
    {
        id: "react",
        title: "Learn React JS in 2 Hours: Master the Basics Fast",
        thumbnailUrl: "/assets/thumb_7.jpg",
        channelName: "React Lab",
        views: "1.9M views",
        publishedAgo: "8 months ago",
        duration: "2:03:44",
    },
];
