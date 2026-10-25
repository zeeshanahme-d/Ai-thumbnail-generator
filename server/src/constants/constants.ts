import { AspectRatio, ColorScheme, GenerationErrorCode, ThumbnailFormat, ThumbnailStyle } from "./enums.js";

// `subject` opens the prompt ("Design {subject} "{title}""); `safeArea` is where the platform
// draws over the image. Mirrored in client/src/data/generator.ts.
export const THUMBNAIL_FORMATS: Record<ThumbnailFormat, { aspectRatio: AspectRatio; subject: string; safeArea?: string }> = {
  [ThumbnailFormat.YouTube]: {
    aspectRatio: AspectRatio.Widescreen,
    subject: "a YouTube thumbnail for a video titled",
    safeArea: "Keep the bottom-right corner free of anything important, because YouTube places the video length there.",
  },
  [ThumbnailFormat.YouTubeShorts]: {
    aspectRatio: AspectRatio.Vertical,
    subject: "a YouTube Shorts cover for a video titled",
    safeArea: "Keep the bottom fifth and the right edge free of anything important, because YouTube Shorts places its buttons and caption there.",
  },
  [ThumbnailFormat.TikTok]: {
    aspectRatio: AspectRatio.Vertical,
    subject: "a TikTok cover for a video titled",
    safeArea: "Keep the bottom fifth and the right edge free of anything important, because TikTok places its buttons and caption there.",
  },
  [ThumbnailFormat.InstagramPost]: {
    aspectRatio: AspectRatio.Feed,
    subject: "an Instagram feed post about",
    safeArea: "Keep the subject and any text away from the top and bottom edges, because Instagram's profile grid crops them.",
  },
  [ThumbnailFormat.InstagramReel]: {
    aspectRatio: AspectRatio.Vertical,
    subject: "an Instagram Reels cover for a video titled",
    safeArea: "Keep the subject and any text in the middle of the frame, because the profile grid shows only the centre and Reels places its buttons and caption along the bottom and right edge.",
  },
  [ThumbnailFormat.InstagramStory]: {
    aspectRatio: AspectRatio.Vertical,
    subject: "an Instagram Story about",
    safeArea: "Keep the top seventh and the bottom fifth free of anything important, because Stories place the profile name at the top and the reply bar at the bottom.",
  },
  [ThumbnailFormat.FacebookVideo]: {
    aspectRatio: AspectRatio.Widescreen,
    subject: "a Facebook video thumbnail for a video titled",
  },
  [ThumbnailFormat.FacebookPost]: {
    aspectRatio: AspectRatio.Feed,
    subject: "a Facebook feed post about",
  },
  [ThumbnailFormat.X]: {
    aspectRatio: AspectRatio.Widescreen,
    subject: "an image for a post on X about",
  },
  [ThumbnailFormat.Twitch]: {
    aspectRatio: AspectRatio.Widescreen,
    subject: "a Twitch stream thumbnail for a stream titled",
    safeArea: "Keep the top-left and bottom-left corners free of anything important, because Twitch places the live badge and viewer count there.",
  },
  [ThumbnailFormat.Vimeo]: {
    aspectRatio: AspectRatio.Widescreen,
    subject: "a Vimeo thumbnail for a video titled",
  },
  [ThumbnailFormat.Square]: { aspectRatio: AspectRatio.Square, subject: "a square thumbnail titled" },
  [ThumbnailFormat.Classic]: { aspectRatio: AspectRatio.Standard, subject: "a thumbnail titled" },
  [ThumbnailFormat.Portrait]: { aspectRatio: AspectRatio.Portrait, subject: "a portrait thumbnail titled" },
};

// Style presets, written as descriptions: image models follow a described look better than a
// keyword list. None of them asks for a facial expression; the prompt picks one from the topic.
export const stylePrompts: Record<ThumbnailStyle, string> = {
  [ThumbnailStyle.BoldGraphic]:
    "Bold graphic design: one large subject cut out cleanly against a simple background, big simple shapes, strong outlines and punchy contrast, a confident layout that reads at a glance.",
  [ThumbnailStyle.TechFuturistic]:
    "Sleek futuristic look: dark polished surfaces, subtle interface elements and holographic details, crisp glowing accents and sharp, controlled lighting.",
  [ThumbnailStyle.Minimalist]:
    "Minimalist design: a clean layout with generous empty space, two or three colors, simple flat shapes and a single clear focal point.",
  [ThumbnailStyle.Photorealistic]:
    "Photorealistic photograph: shot like a professional DSLR photo with natural light, true-to-life skin and textures and a shallow depth of field that separates the subject from the background.",
  [ThumbnailStyle.Illustrated]:
    "Custom digital illustration: stylized characters and objects with bold outlines, flat or softly shaded vector-style color and a playful, hand-made feel.",
};

export const colorSchemeDescriptions: Record<ColorScheme, string> = {
  [ColorScheme.Vibrant]: "vibrant, highly saturated colors with bold contrasts",
  [ColorScheme.Sunset]: "warm sunset tones of orange, pink and purple with soft gradients and a cinematic glow",
  [ColorScheme.Forest]: "natural greens and earthy tones, calm and organic",
  [ColorScheme.Neon]: "electric neon blues and pinks glowing against darkness, cyberpunk lighting",
  [ColorScheme.Purple]: "a purple-led palette of violet and magenta, modern and stylish",
  [ColorScheme.Monochrome]: "black and white only, high contrast and dramatic light",
  [ColorScheme.Ocean]: "cool blues and teals, fresh and clean",
  [ColorScheme.Pastel]: "soft pastel colors with low saturation, gentle and friendly",
};

// SIGNUP_BONUS is the freeCredits a verified account gets, and gets back at every refill.
// Only free credits are spent; subscription and pack credits are recorded but never spendable.
export const CREDIT_COST = {
  SIGNUP_BONUS: 10,
  GENERATE_COST: 5,
  RECREATE_COST: 10,
};

export const CREDIT_PACK = {
  CREDITS_PER_UNIT: 5,
  MIN_CREDITS: 25,
  MAX_CREDITS: 2500,
};

// Free accounts get CREDIT_COST.SIGNUP_BONUS back this long after the last refill.
export const CREDIT_RESET_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;

// A generation still running after this long was cut off by a crash or restart.
export const STUCK_GENERATION_MS = 10 * 60 * 1000;
export const SCHEDULED_JOB_INTERVAL_MS = 10 * 60 * 1000;

// Thumbnails in the recycle bin are deleted forever this long after they were moved there.
export const RECYCLE_BIN_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

export const PROMPT_MAX_LENGTH = 500;

export const GEMINI_IMAGE_MODEL = "gemini-3.1-flash-lite-image";
export const GEMINI_TEXT_MODEL = "gemini-3.1-flash-lite";

// The improved prompt's first line becomes the thumbnail's title (buildThumbnailTitle on the
// client), and the image prompt makes the headline from the title, so line 1 must be the topic.
// The style, colors and lighting are left out because the creator's presets choose them.
export const PROMPT_IMPROVER_INSTRUCTION = `You turn a creator's rough idea into a brief for an AI thumbnail generator. The creator's settings already choose the art style, colors, lighting and platform, and the generator sets the lettering.

Reply in this form, in the creator's language, with no labels:
Line 1: the video's title as the creator would write it, under 70 characters. It must include any product, channel or brand name the creator wrote.
An empty line.
The brief, under 350 characters: the one main subject and what it shows, how it ties to the topic, the hook or feeling that makes someone click, and where things sit in the frame.

Rules:
- Keep everything the creator asked for, such as names of their product, channel or brand, people, objects, words and how to use the attached image. Never drop or contradict any of it.
- Never choose colors, lighting, camera or art style.
- You can't see the attached image, so call it "the attached image" and never guess what it shows. If the idea says to use it, say how in the brief.
- Add a person only if the idea needs one, and never describe someone new when an image is attached.
- Any person has a natural expression that fits the mood, never shocked or screaming unless asked.
- When text on the image is on, end the brief with the headline in quotes, two to five words. When it is off, ask for no text.
- No hashtags, emojis or explanations.`;

export const GEMINI_TIMEOUT_MS = 60 * 1000;
export const GEMINI_MAX_ATTEMPTS = 3;
export const GEMINI_RETRY_BASE_DELAY_MS = 1000;

export const GENERATION_FAILURES: Record<GenerationErrorCode, { status: number; message: string }> = {
  [GenerationErrorCode.Failed]: {
    status: 502,
    message: "AI image generation failed. Please try again in a moment.",
  },
  [GenerationErrorCode.Blocked]: {
    status: 422,
    message: "The safety filter blocked this prompt or reference image. Try rewording it or using a different image.",
  },
  [GenerationErrorCode.Busy]: {
    status: 503,
    message: "The image service is busy right now. Please try again in a minute.",
  },
  [GenerationErrorCode.TimedOut]: {
    status: 504,
    message: "Generation took too long. Please try again.",
  },
};

export const THUMBNAIL_SORT_OPTIONS: Record<string, any> = {
  newest: {
    createdAt: -1,
  },

  trending: {
    trendingScore: -1,
    createdAt: -1,
  },

  "most-liked": {
    likesCount: -1,
    createdAt: -1,
  },

  oldest: {
    createdAt: 1,
  },
};

// Trending score = likes / (hours since publishing + AGE_OFFSET) ^ GRAVITY, as on Hacker News.
export const TRENDING_AGE_OFFSET_HOURS = 2;
export const TRENDING_GRAVITY = 1.5;

// Cloudinary rendition for link previews: a JPEG every crawler accepts, small enough for WhatsApp.
export const SHARE_IMAGE_TRANSFORMATION = "f_jpg,q_auto,w_1200";

export const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// A refresh token used again within this window is a parallel refresh (two tabs, or page
// load and an API call at once), not a stolen token, so the session is not revoked.
export const REFRESH_REUSE_GRACE_MS = 30 * 1000;

// Wrong guesses allowed per emailed code before it stops working.
export const MAX_OTP_ATTEMPTS = 5;

export const BCRYPT_SALT_ROUNDS = 10;

// bcrypt ignores everything past 72 bytes, so longer passwords are rejected.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_BYTES = 72;

export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 50;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

// Names that could pass for staff, the brand or an app route.
export const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "root",
  "system",
  "support",
  "help",
  "staff",
  "moderator",
  "mod",
  "official",
  "team",
  "security",
  "billing",
  "thumblify",
  "eyecatch",
  "eyecatchai",
  "api",
  "settings",
  "dashboard",
  "login",
  "signup",
  "logout",
  "account",
  "profile",
  "community",
  "gallery",
  "generate",
  "preview",
  "thumbnail",
  "me",
  "null",
  "undefined",
]);

