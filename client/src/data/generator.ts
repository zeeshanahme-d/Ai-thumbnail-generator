import type { IAspectRatio, IThumbnailStyle } from "../types";

export const THUMBNAIL_STYLES: IThumbnailStyle[] = [
  {
    label: "Bold & Graphic",
    description:
      "Energetic composition, striking vibrant colors. Optimized for stunning, high-contrast, clickable thumbnails.",
  },
  {
    label: "Minimalist",
    description:
      "Clean layouts with generous whitespace and a restrained palette for a calm, premium feel.",
  },
  {
    label: "Photorealistic",
    description:
      "Lifelike, DSLR-quality imagery with natural lighting, depth and realistic textures.",
  },
  {
    label: "Illustrated",
    description:
      "Hand-drawn, vector-style artwork with playful shapes, characters and flat color.",
  },
  {
    label: "Tech/Futuristic",
    description:
      "Sleek, high-tech visuals with neon accents, glows and futuristic interface elements.",
  },
];

export const THUMBNAIL_STYLES_COLORS = [
  {
    label: "Vibrant",
    description:
      "Vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette.",
    schemeColors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
  },
  {
    label: "Sunset",
    description:
      "Warm sunset tones with orange, pink, and purple hues, soft gradients, and a cinematic glow.",
    schemeColors: ["#FF8C42", "#FF3C38", "#A23B72"],
  },
  {
    label: "Forest",
    description:
      "Natural green tones, earthy colors, calm and organic palette with a fresh atmosphere.",
    schemeColors: ["#2D6A4F", "#40916C", "#95D5B2"],
  },
  {
    label: "Neon",
    description:
      "Neon glow effects with electric blues and pinks, cyberpunk lighting, and high-contrast visuals.",
    schemeColors: ["#FF00FF", "#00FFFF", "#FFFF00"],
  },
  {
    label: "Purple",
    description:
      "Purple-dominant color palette featuring magenta and violet tones for a modern, stylish mood.",
    schemeColors: ["#7B2CBF", "#9D4EDD", "#C77DFF"],
  },
  {
    label: "Monochrome",
    description:
      "Black and white color scheme with high contrast, dramatic lighting, and a timeless aesthetic.",
    schemeColors: ["#212529", "#495057", "#ADB5BD"],
  },
  {
    label: "Ocean",
    description:
      "Cool blue and teal tones, aquatic-inspired colors, and a fresh, clean atmosphere.",
    schemeColors: ["#0077B6", "#00B4D8", "#90E0EF"],
  },
  {
    label: "Pastel",
    description:
      "Soft pastel colors with low saturation, gentle tones, and a calm, friendly aesthetic.",
    schemeColors: ["#FFB5A7", "#FCD5CE", "#F8EDEB"],
  },
] as const;

export const ASPECT_RATIOS: IAspectRatio[] = [
  { value: "16:9", label: "YouTube", ratio: "16 / 9" },
  { value: "9:16", label: "Shorts", ratio: "9 / 16" },
  { value: "1:1", label: "Square", ratio: "1 / 1" },
  { value: "4:3", label: "Traditional", ratio: "4 / 3" },
  { value: "3:4", label: "Portrait", ratio: "3 / 4" },
];
