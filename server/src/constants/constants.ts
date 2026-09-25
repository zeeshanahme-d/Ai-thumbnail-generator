export const stylePrompts = {
  "Bold & Graphic":
    "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",
  "Tech/Futuristic":
    "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",
  Minimalist:
    "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",
  Photorealistic:
    "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",
  Illustrated:
    "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style",
};

export const colorSchemeDescriptions = {
  Vibrant:
    "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",
  Sunset:
    "warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow",
  Forest:
    "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",
  Neon: "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",
  Purple:
    "purple-dominant color palette, magenta and violet tones, modern and stylish mood",
  Monochrome:
    "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",
  Ocean:
    "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",
  Pastel:
    "soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic",
};

export const CREDIT_COST = {
  SIGNUP_BONUS: 20,
  GENERATE_COST: 5,
  RECREATE_COST: 10,
};

export const THUMBNAIL_SORT_OPTIONS: Record<string, any> = {
  newest: {
    createdAt: -1,
  },

  trending: {
    likesCount: -1,
    views: -1,
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

export const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

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

