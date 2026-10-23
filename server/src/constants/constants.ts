import { ColorScheme, GenerationErrorCode, ThumbnailStyle } from "./enums.js";

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

export const CREDIT_COST = {
  SIGNUP_BONUS: 10,
  GENERATE_COST: 5,
  RECREATE_COST: 10,
};


export const PAID_CREDITS_SPENDABLE = false;


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

export const PROMPT_IMPROVER_INSTRUCTION = `You improve prompts for an AI YouTube thumbnail generator.
Rewrite the user's idea into one vivid image description: the main subject and what it is doing, the composition, the background, the lighting and the mood.
If a person appears, describe a specific individual who fits the topic (age, look, clothing, setting), not a generic model, with a natural expression that suits the mood. Never add a shocked, screaming or open-mouthed face unless the user asked for one.
Keep the user's topic and language. Do not add brand names, hashtags, quotes or explanations.
Reply with the improved prompt only, under ${PROMPT_MAX_LENGTH - 100} characters.`;

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

  "most-views": {
    viewsCount: -1,
    createdAt: -1,
  },

  oldest: {
    createdAt: 1,
  },
};

// Trending score = (likes × LIKE_WEIGHT + views) / (hours since publishing + AGE_OFFSET) ^ GRAVITY,
// as on Hacker News. A like needs an account, so it counts for more than a view.
export const TRENDING_LIKE_WEIGHT = 5;
export const TRENDING_AGE_OFFSET_HOURS = 2;
export const TRENDING_GRAVITY = 1.5;

// Guests are told apart by a random visitor cookie, so each one adds a view only once.
export const VISITOR_COOKIE_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

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

