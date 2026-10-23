import type { ICapability } from "../types";
import { ACCEPTED_IMAGE_LABEL, MAX_IMAGE_SIZE_MB } from "../lib/imageValidation";
import { PROMPT_TEMPLATES, THUMBNAIL_STYLES, THUMBNAIL_STYLES_COLORS } from "./generator";

// The homepage bento: one tile per generator control. CapabilitiesSection picks each tile's demo and size by id.
export const capabilities: ICapability[] = [
    {
        id: "aspect-ratio",
        label: "Size",
        title: "Made at the size you post",
        description:
            "YouTube 16:9, Shorts 9:16, square, 4:3 or 3:4. The image is generated at that size, so nothing gets cropped afterwards.",
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
];

// The Improve tile's example: a rough idea and the Gaming template as the fuller prompt.
export const IMPROVE_EXAMPLE = {
    idea: "gaming video, boss fight, focused gamer",
    improved: PROMPT_TEMPLATES[0].prompt,
};
