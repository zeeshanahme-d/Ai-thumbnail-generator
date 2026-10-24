import {
  Briefcase,
  ChefHat,
  Cpu,
  Dumbbell,
  Gamepad2,
  GraduationCap,
  LayoutGrid,
  Laugh,
  Music,
  Newspaper,
  Plane,
  Shirt,
  Star,
  TrendingUp,
  Trophy,
  Video,
} from "lucide-react";
import type {
  IPromptTemplate,
  IThumbnailCategory,
  IThumbnailFormat,
  IThumbnailStyle,
} from "../types";

export const PROMPT_TEMPLATES: IPromptTemplate[] = [
  {
    label: "Gaming",
    icon: Gamepad2,
    prompt: "A focused gamer in a headset leaning toward a glowing screen, an epic boss battle with fire and lightning exploding behind them, neon rim lighting",
  },
  {
    label: "Tech",
    icon: Cpu,
    prompt: "A sleek new smartphone floating above a dark desk, a creator pointing at it with a confident grin, glowing blue accents and sharp studio lighting",
  },
  {
    label: "Vlog",
    icon: Video,
    prompt: "A smiling creator holding a camera at golden hour in a busy city street, warm cinematic light and a blurred background full of life",
  },
  {
    label: "Education",
    icon: GraduationCap,
    prompt: "A teacher next to a giant glowing lightbulb and simple diagrams on a chalkboard, a curious expression, clean bright composition",
  },
  {
    label: "Finance",
    icon: TrendingUp,
    prompt: "A confident person in front of a rising green stock chart with stacks of cash and gold coins, dramatic contrast lighting",
  },
  {
    label: "Fitness",
    icon: Dumbbell,
    prompt: "A muscular athlete mid-lift with a determined face in a dark gym, sweat glistening under a dramatic spotlight",
  },
  {
    label: "Food",
    icon: ChefHat,
    prompt: "A chef tasting a steaming dish with a satisfied smile, colorful fresh ingredients flying around, warm kitchen lighting",
  },
];

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

export const ANY_PLATFORM = "Any platform";

// Mirrors ThumbnailFormat and THUMBNAIL_FORMATS in the server; the first one is the default.
export const THUMBNAIL_FORMATS: IThumbnailFormat[] = [
  { value: "youtube", platform: "YouTube", label: "Video", name: "YouTube video", aspectRatio: "16:9" },
  { value: "youtube-shorts", platform: "YouTube", label: "Shorts", name: "YouTube Shorts", aspectRatio: "9:16" },
  { value: "tiktok", platform: "TikTok", label: "Video cover", name: "TikTok", aspectRatio: "9:16" },
  { value: "instagram-post", platform: "Instagram", label: "Post", name: "Instagram post", aspectRatio: "4:5" },
  { value: "instagram-reel", platform: "Instagram", label: "Reel", name: "Instagram Reel", aspectRatio: "9:16" },
  { value: "instagram-story", platform: "Instagram", label: "Story", name: "Instagram Story", aspectRatio: "9:16" },
  { value: "facebook-video", platform: "Facebook", label: "Video", name: "Facebook video", aspectRatio: "16:9" },
  { value: "facebook-post", platform: "Facebook", label: "Post", name: "Facebook post", aspectRatio: "4:5" },
  { value: "x", platform: "X", label: "Post", name: "X post", aspectRatio: "16:9" },
  { value: "twitch", platform: "Twitch", label: "Stream", name: "Twitch stream", aspectRatio: "16:9" },
  { value: "vimeo", platform: "Vimeo", label: "Video", name: "Vimeo video", aspectRatio: "16:9" },
  { value: "square", platform: ANY_PLATFORM, label: "Square", name: "Square", aspectRatio: "1:1" },
  { value: "classic", platform: ANY_PLATFORM, label: "Classic", name: "Classic", aspectRatio: "4:3" },
  { value: "portrait", platform: ANY_PLATFORM, label: "Portrait", name: "Portrait", aspectRatio: "3:4" },
];

export const PLATFORM_NAMES = [...new Set(THUMBNAIL_FORMATS.map(({ platform }) => platform))].filter(
  (platform) => platform !== ANY_PLATFORM,
);

// Mirrors ThumbnailCategory in the server; the first one is the default.
export const THUMBNAIL_CATEGORIES: IThumbnailCategory[] = [
  { label: "General", icon: LayoutGrid },
  { label: "Gaming", icon: Gamepad2 },
  { label: "Tech", icon: Cpu },
  { label: "Vlog", icon: Video },
  { label: "Education", icon: GraduationCap },
  { label: "Finance", icon: TrendingUp },
  { label: "Business", icon: Briefcase },
  { label: "Fitness", icon: Dumbbell },
  { label: "Food", icon: ChefHat },
  { label: "Travel", icon: Plane },
  { label: "Beauty & Fashion", icon: Shirt },
  { label: "Music", icon: Music },
  { label: "Comedy", icon: Laugh },
  { label: "Sports", icon: Trophy },
  { label: "News", icon: Newspaper },
  { label: "Reviews", icon: Star },
];
