import { z } from "zod";
import {
  AspectRatio,
  ColorScheme,
  THUMBNAIL_SORT,
  ThumbnailStyle,
} from "../constants/enums.js";
import { PROMPT_MAX_LENGTH } from "../constants/constants.js";

const thumbnailStyleValues = Object.values(ThumbnailStyle) as [
  string,
  ...string[],
];

const aspectRatioValues = Object.values(AspectRatio) as [string, ...string[]];

const colorSchemeValues = Object.values(ColorScheme) as [string, ...string[]];

const promptMaxMessage = `Prompt must be at most ${PROMPT_MAX_LENGTH} characters`;

const generateThumbnailSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
  prompt: z.string().trim().max(PROMPT_MAX_LENGTH, promptMaxMessage).optional().default(""),
  style: z.enum(thumbnailStyleValues),
  aspect_ratio: z.enum(aspectRatioValues).optional().default(AspectRatio.Widescreen),
  color_scheme: z.enum(colorSchemeValues).optional().default(ColorScheme.Vibrant),
  // Multipart fields arrive as strings; stringbool reads "false" as false, unlike coerce.
  text_overlay: z.stringbool().optional().default(false),
});

const improvePromptSchema = z.object({
  prompt: z.string().trim().min(1, "Write a prompt to improve").max(PROMPT_MAX_LENGTH, promptMaxMessage),
});

const publishThumbnailSchema = z.object({
  published: z.boolean(),
});

const getThumbnailSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional().default(""),
  style: z.enum(ThumbnailStyle).optional(),
  sort: z.enum(THUMBNAIL_SORT).optional().default(THUMBNAIL_SORT.Newest),
  userId: z.string().optional(),
});

export { generateThumbnailSchema, improvePromptSchema, publishThumbnailSchema, getThumbnailSchema };
