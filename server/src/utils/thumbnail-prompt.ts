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
 * The prompt sent to the image model. Written as plain paragraphs, which image models follow
 * better than keyword lists, and phrased as what to show rather than long lists of what to avoid.
 * The creator's brief wins over the presets, and expressions come from the topic, so faces aren't
 * the same open-mouthed "shocked" reaction every time.
 */
export function buildThumbnailPrompt(input: ThumbnailPromptInput): string {
  const { title, style, colorScheme, format, category, textOverlay, hasReferenceImage } = input;
  const { aspectRatio, subject, safeArea } = THUMBNAIL_FORMATS[format];
  const brief = input.prompt?.trim();

  const parts = [
    `Design ${subject} "${title.trim()}". It should look like the work of a professional designer: one clear focal point, a simple layout and strong contrast, so it reads instantly at small sizes on a phone.`,
  ];

  if (category !== ThumbnailCategory.General) {
    parts.push(
      `It's for the ${category} niche: use the visual language viewers know from popular ${category.toLowerCase()} content, so it's recognisable at a glance.`,
    );
  }

  if (brief) {
    parts.push(`The creator's brief, which takes priority over the style notes below: "${brief}"`);
  }

  parts.push(
    `Style: ${stylePrompts[style]}`,
    `Colors: ${colorSchemeDescriptions[colorScheme]}. Use them for the whole image, including the lighting.`,
  );

  if (hasReferenceImage) {
    parts.push(
      "A reference image is attached. Use what it shows, such as a person, product, logo or mascot, as the main subject of a new scene. If it shows a person, keep exactly that person: the same face, features, skin tone, hairstyle and build, so they're instantly recognisable. Their clothing, pose and expression can change to suit the scene. Light them to match the new scene. Don't reuse the reference's background or layout.",
    );
  } else {
    parts.push(
      "Include a person only if the brief asks for one or the topic is about a person (a vlog, a reaction, a tutorial with a host). Otherwise let the subject itself, such as the product, place, food or object, fill the frame. When a person appears, follow any description of them in the brief and cast a specific individual for the rest: decide their age, look, hairstyle, clothing and surroundings from the topic, so they look like a real person who belongs in this video and not a generic stock-photo model.",
    );
  }

  parts.push(
    "Give any person a natural, believable expression that fits the mood of the video, such as focused, confident, curious, calm, amused or determined. Don't default to an open-mouthed shocked or screaming face; use one only when the brief asks for surprise or shock.",
  );

  if (textOverlay) {
    parts.push(
      `Add a short headline of two to five words that captures the hook of the title, in the title's language. Never write out the full title. Set it in large, heavy, easy-to-read lettering on at most two lines, with strong contrast against the background, and highlight one key word in an accent color. Spell every word correctly. Place it in an empty part of the frame so it never covers a face or the main subject. The headline is the only text in the image.`,
    );
  } else {
    parts.push("The image has no text, letters, numbers, captions or logos anywhere; the visuals tell the story on their own.");
  }

  parts.push(
    [
      `Composition: a ${aspectRatio} frame with the main subject large and in sharp focus, a clean background that doesn't compete with it, and faces fully inside the frame.`,
      safeArea,
      "No borders, frames or watermarks.",
    ].filter(Boolean).join(" "),
  );

  return parts.join("\n\n");
}
