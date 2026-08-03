/**
 * Single source of truth for every enumerated value in the API.
 * Mongoose schemas use `Object.values(...)` so the DB can never drift from these.
 */

// ---------------------------------------------------------------- thumbnails

export enum ThumbnailModel {
  Basic = "basic",
  Premium = "premium",
}

export enum ThumbnailStyle {
  BoldGraphic = "Bold & Graphic",
  Minimalist = "Minimalist",
  Photorealistic = "Photorealistic",
  Illustrated = "Illustrated",
  TechFuturistic = "Tech/Futuristic",
}

export enum THUMBNAIL_SORT {
  Newest = "newest",
  Oldest = "oldest",
  MostLiked = "most-liked",
  MostViews = "most-views",
  Trending = "trending",
}

export enum AspectRatio {
  Widescreen = "16:9",
  Vertical = "9:16",
  Square = "1:1",
  Standard = "4:3",
  Portrait = "3:4",
}

export enum ColorScheme {
  Vibrant = "Vibrant",
  Sunset = "Sunset",
  Ocean = "Ocean",
  Forest = "Forest",
  Purple = "Purple",
  Monochrome = "Monochrome",
  Neon = "Neon",
  Pastel = "Pastel",
}

// --------------------------------------------------------------------- users

export enum AuthProvider {
  Email = "email",
  Google = "google",
}

export enum UserPlan {
  Free = "free",
  Pro = "pro",
  Ultra = "ultra",
}

export enum SubscriptionStatus {
  Active = "active",
  Canceled = "canceled",
  PastDue = "past_due",
  Trialing = "trialing",
}

// ---------------------------------------------------------------------- auth

/** Machine-readable codes the client branches on (see lib/axios.ts). */
export enum AuthErrorCode {
  TokenMissing = "TOKEN_MISSING",
  TokenExpired = "TOKEN_EXPIRED",
  TokenInvalid = "TOKEN_INVALID",
  RefreshMissing = "REFRESH_MISSING",
  RefreshInvalid = "REFRESH_INVALID",
  RefreshExpired = "REFRESH_EXPIRED",
}

// ------------------------------------------------------------------ uploads

export enum UploadErrorCode {
  FileMissing = "FILE_MISSING",
  FileTooLarge = "FILE_TOO_LARGE",
  InvalidFileType = "INVALID_FILE_TYPE",
  UploadFailed = "UPLOAD_FAILED",
}
