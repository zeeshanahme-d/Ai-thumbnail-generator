import type { IHeroSpec, IThumbnailSample } from "../types";
import {
    PLATFORM_NAMES,
    THUMBNAIL_CATEGORIES,
    THUMBNAIL_FORMATS,
    THUMBNAIL_STYLES,
    THUMBNAIL_STYLES_COLORS,
} from "./generator";
import { FREE_MONTHLY_CREDITS, GENERATION_CREDIT_COST } from "../lib/credits";

// What the generator offers, counted from the same data the generator uses.
export const heroSpecs: IHeroSpec[] = [
    {
        label: "Platforms",
        value: `${PLATFORM_NAMES.length} platforms · ${THUMBNAIL_FORMATS.length} formats`,
        note: PLATFORM_NAMES.join(", "),
    },
    { label: "Categories", value: `${THUMBNAIL_CATEGORIES.length} niches` },
    { label: "Styles", value: `${THUMBNAIL_STYLES.length} presets` },
    { label: "Colors", value: `${THUMBNAIL_STYLES_COLORS.length} schemes` },
    { label: "Cost", value: `${GENERATION_CREDIT_COST} credits / thumbnail` },
    { label: "Free", value: `${FREE_MONTHLY_CREDITS} credits / month`, note: "Once your email is verified." },
];

// The sample thumbnails in public/assets, as 640px WebP copies of the .jpg originals.
export const sampleThumbnails: IThumbnailSample[] = [
    { src: "/assets/thumb_1.webp", alt: "Thumbnail: top smartwatches under 1499", width: 640, height: 357 },
    { src: "/assets/thumb_2.webp", alt: "Thumbnail: how to make 100K in 10 days", width: 640, height: 357 },
    { src: "/assets/thumb_3.webp", alt: "Thumbnail: learn Next.js 16 with a project", width: 640, height: 357 },
    { src: "/assets/thumb_4.webp", alt: "Thumbnail: learn Photoshop fast", width: 640, height: 357 },
    { src: "/assets/thumb_5.webp", alt: "Square thumbnail: make a burger in 30 minutes", width: 640, height: 640 },
    { src: "/assets/thumb_6.webp", alt: "Thumbnail: full stack development roadmap", width: 640, height: 357 },
    { src: "/assets/thumb_7.webp", alt: "Thumbnail: learn React JS in 2 hours", width: 640, height: 357 },
];
