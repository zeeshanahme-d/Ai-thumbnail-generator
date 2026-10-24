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
assert.ok(!plain.includes("creator's brief"), "no brief line without a prompt");
assert.ok(!plain.includes("niche"), "no category line for General");
assert.ok(plain.includes("headline"));
assert.ok(plain.includes("bottom-right corner"), "16:9 keeps the timestamp corner clear");
assert.ok(plain.includes("Include a person only if"));

// No preset asks for a facial reaction, so expressions come from the topic.
for (const text of Object.values(stylePrompts)) assert.ok(!/facial|reaction|expression/i.test(text), text);

const withBrief = buildThumbnailPrompt({ ...base, prompt: "  A runner checking her watch at sunrise  " });
assert.ok(withBrief.includes(`"A runner checking her watch at sunrise"`), "brief is trimmed and quoted");

const noText = buildThumbnailPrompt({ ...base, textOverlay: false });
assert.ok(noText.includes("no text") && !noText.includes("headline"));

const withReference = buildThumbnailPrompt({ ...base, hasReferenceImage: true });
assert.ok(withReference.includes("keep exactly that person") && !withReference.includes("Include a person only if"));

const gaming = buildThumbnailPrompt({ ...base, category: ThumbnailCategory.Gaming });
assert.ok(gaming.includes("Gaming niche") && gaming.includes("popular gaming content"));

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
