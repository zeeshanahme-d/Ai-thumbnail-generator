import assert from "node:assert/strict";
import { buildThumbnailPrompt } from "./thumbnail-prompt.js";
import { ColorScheme, ThumbnailCategory, ThumbnailFormat, ThumbnailStyle } from "../constants/enums.js";
import { THUMBNAIL_FORMATS, stylePrompts } from "../constants/constants.js";
import logger from "./logger.js";

const base = {
  title: "I tried every budget smartwatch",
  prompt: "",
  style: ThumbnailStyle.BoldGraphic,
  colorScheme: ColorScheme.Vibrant,
  format: ThumbnailFormat.YouTube,
  category: ThumbnailCategory.General,
  textOverlay: true,
  hasReferenceImage: false,
};

const plain = buildThumbnailPrompt(base);
assert.ok(plain.includes(`"I tried every budget smartwatch"`));
assert.ok(plain.startsWith("Design a YouTube thumbnail for a video titled"));
assert.ok(!plain.includes("Brief"), "no brief line without a prompt");
assert.ok(!plain.includes("visual language"), "no category line for General");
assert.ok(plain.includes("headline"));
assert.ok(plain.includes("bottom-right corner"), "16:9 keeps the timestamp corner clear");
assert.ok(plain.includes("Show a person only if"));

// No preset asks for a facial reaction, so expressions come from the topic.
for (const text of Object.values(stylePrompts)) assert.ok(!/facial|reaction|expression/i.test(text), text);

const withBrief = buildThumbnailPrompt({ ...base, prompt: "  A runner checking her watch at sunrise  " });
assert.ok(withBrief.includes(`"A runner checking her watch at sunrise"`), "brief is trimmed and quoted");

const noText = buildThumbnailPrompt({ ...base, textOverlay: false });
assert.ok(noText.includes("No text") && !noText.includes("headline"));

const withReference = buildThumbnailPrompt({ ...base, hasReferenceImage: true });
assert.ok(withReference.includes("as the brief says") && withReference.includes("keep their exact face"));
assert.ok(withReference.includes("copy only its layout, lettering and colors"), "a thumbnail reference lends only its look");
assert.ok(!withReference.includes("Show a person only if"), "the reference replaces the casting rule");
assert.ok(!plain.includes("attached image"), "no reference paragraph without an image");
// With text off, a logo the creator attached is still allowed.
assert.ok(buildThumbnailPrompt({ ...base, textOverlay: false, hasReferenceImage: true }).includes("no logos other than one from the attached image"));
assert.ok(noText.includes("no logos.") && !noText.includes("attached image"));

// The platform's own badges and buttons are never drawn, whatever the format.
assert.ok(plain.includes("platform interface"));

const gaming = buildThumbnailPrompt({ ...base, category: ThumbnailCategory.Gaming });
assert.ok(gaming.includes("popular gaming content"));

// Every format names its platform's subject and its own frame, with no other platform's safe area.
for (const format of Object.values(ThumbnailFormat)) {
  const { aspectRatio, subject, safeArea } = THUMBNAIL_FORMATS[format];
  const text = buildThumbnailPrompt({ ...base, format });
  assert.ok(text.startsWith(`Design ${subject} "`), format);
  assert.ok(text.includes(`a ${aspectRatio} frame`), format);
  if (safeArea) assert.ok(text.includes(safeArea), format);
  if (format !== ThumbnailFormat.YouTube) assert.ok(!text.includes("YouTube places"), format);
}

const tiktok = buildThumbnailPrompt({ ...base, format: ThumbnailFormat.TikTok });
assert.ok(tiktok.includes("TikTok cover") && tiktok.includes("9:16 frame") && !tiktok.includes("YouTube"));

const square = buildThumbnailPrompt({ ...base, format: ThumbnailFormat.Square });
assert.ok(!square.includes("bottom-right") && square.includes("1:1 frame"));

if (process.argv.includes("--print")) process.stdout.write(`${withBrief}\n`);
logger.info("thumbnail prompt checks passed");
