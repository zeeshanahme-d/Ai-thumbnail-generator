import { THUMBNAIL_FORMATS, colorSchemeDescriptions, stylePrompts } from "../constants/constants.js";
import { ThumbnailCategory, type ColorScheme, type ThumbnailFormat, type ThumbnailStyle } from "../constants/enums.js";

type ThumbnailPromptInput = {
  title: string;
  prompt?: string;
  style: ThumbnailStyle;
  colorScheme: ColorScheme;
  format: ThumbnailFormat;
  category: ThumbnailCategory;
  textOverlay: boolean;
  hasReferenceImage: boolean;
};

/**
 * The prompt sent to the image model: short plain sentences, which image models follow better than
 * keyword lists, and kept brief because every word is billed. The creator's brief wins over the
 * presets, and expressions come from the topic, so faces aren't the same "shocked" reaction every time.
 */
export function buildThumbnailPrompt(input: ThumbnailPromptInput): string {
  const { title, style, colorScheme, format, category, textOverlay, hasReferenceImage } = input;
  const { aspectRatio, subject, safeArea } = THUMBNAIL_FORMATS[format];
  const brief = input.prompt?.trim();

  const parts = [
    `Design ${subject} "${title.trim()}": professional, one clear focal point, a simple layout and strong contrast that reads at phone size.`,
  ];

  if (category !== ThumbnailCategory.General) {
    parts.push(`Use the visual language of popular ${category.toLowerCase()} content.`);
  }

  if (brief) parts.push(`Brief, which overrides the style notes: "${brief}"`);

  parts.push(`Style: ${stylePrompts[style]} Colors: ${colorSchemeDescriptions[colorScheme]}, lighting included.`);

  if (hasReferenceImage) {
    parts.push(
      "Use the attached image as the brief says. Otherwise: if it is a thumbnail or design, copy only its layout, lettering and colors, never its people, logos or text; if it shows a person, make them the main person and keep their exact face, skin tone, hair and build in a new scene; if it is a product or logo, feature it.",
    );
  } else {
    parts.push(
      "Show a person only if the brief or topic needs one, cast as a specific, real-looking individual who fits the video, not a stock model. Otherwise let the subject fill the frame.",
    );
  }

  parts.push("Expressions are natural and fit the mood; no open-mouthed shocked face unless the brief asks for one.");

  parts.push(
    textOverlay
      ? "Add one headline of two to five words with the title's hook, in its language, never the full title: large heavy lettering, at most two lines, one key word in an accent color, spelled correctly, never covering a face or the subject. No other text."
      : `No text, letters or numbers anywhere, and no logos${hasReferenceImage ? " other than one from the attached image" : ""}.`,
  );

  parts.push(
    [
      `Composition: a ${aspectRatio} frame, the subject large and sharp, a clean background, faces fully in frame.`,
      safeArea,
      "No borders, watermarks or platform interface such as badges or buttons.",
    ].filter(Boolean).join(" "),
  );

  return parts.join("\n\n");
}

type ImproverInput = { prompt: string; format: ThumbnailFormat; textOverlay: boolean; hasReferenceImage: boolean };

/** What the prompt improver gets: the settings it can't see, then the idea (PROMPT_IMPROVER_INSTRUCTION). */
export function buildImproverInput({ prompt, format, textOverlay, hasReferenceImage }: ImproverInput): string {
  const { aspectRatio, subject } = THUMBNAIL_FORMATS[format];
  // "a YouTube thumbnail for a video titled" → "a YouTube thumbnail"
  const platform = subject.replace(/ (for a (video|stream) titled|titled|about)$/, "");
  return [
    `Settings: ${platform}, ${aspectRatio}; text on the image ${textOverlay ? "on" : "off"}; ${hasReferenceImage ? "an image is attached" : "no image attached"}.`,
    `Idea: ${prompt.trim()}`,
  ].join("\n");
}
