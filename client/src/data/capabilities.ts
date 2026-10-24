import type { ICapability } from "../types";
import { ACCEPTED_IMAGE_LABEL, MAX_IMAGE_SIZE_MB } from "../lib/imageValidation";
import {
    PLATFORM_NAMES,
    PROMPT_TEMPLATES,
    THUMBNAIL_CATEGORIES,
    THUMBNAIL_STYLES,
    THUMBNAIL_STYLES_COLORS,
} from "./generator";

const platformList = new Intl.ListFormat("en", { type: "conjunction" }).format(PLATFORM_NAMES);

// The homepage bento: one tile per generator control. CapabilitiesSection picks each tile's demo and size by id.
export const capabilities: ICapability[] = [
    {
        id: "format",
        label: "Platform",
        title: "Made for where you post",
        description: `${platformList}, or a plain square, 4:3 or 3:4. Each format is generated at its own size, so nothing gets cropped afterwards.`,
    },
    {
        id: "style",
        label: "Style",
        title: `${THUMBNAIL_STYLES.length} style presets`,
        description: "Each preset adds its own rules for composition, type and lighting to your prompt.",
    },
    {
        id: "color-scheme",
        label: "Color",
        title: `${THUMBNAIL_STYLES_COLORS.length} color schemes`,
        description: "Pick a palette and the whole thumbnail is built around it.",
    },
    {
        id: "improve",
        label: "Prompt",
        title: "Rough idea in, full prompt out",
        description: "Improve rewrites your prompt with the detail an image model needs. Free when you're signed in.",
    },
    {
        id: "reference",
        label: "Reference",
        title: "Bring your face, logo or product",
        description: `Add a ${ACCEPTED_IMAGE_LABEL} image up to ${MAX_IMAGE_SIZE_MB} MB to guide the result. It's used for that one generation and never stored.`,
    },
    {
        id: "category",
        label: "Category",
        title: `${THUMBNAIL_CATEGORIES.length} niches to pick from`,
        description: "Gaming, tech, finance, food and more. Pick your niche and the AI is asked for the look its viewers expect.",
    },
];

// The Improve tile's example: a rough idea and the Gaming template as the fuller prompt.
export const IMPROVE_EXAMPLE = {
    idea: "gaming video, boss fight, focused gamer",
    improved: PROMPT_TEMPLATES[0].prompt,
};
