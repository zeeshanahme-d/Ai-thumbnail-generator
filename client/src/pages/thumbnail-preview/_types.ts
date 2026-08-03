import type { Thumbnail } from "../../types";

export type PreviewSource =
  | "community"          // /community or /dashboard/community
  | "gallery"            // /dashboard/gallery
  | "generate"           // /dashboard/generate
  | "profile"            // /profile
  | "recycle-bin";       // /dashboard/recycle-bin

export interface ThumbnailPreviewState {
  thumbnail: Thumbnail;
  /** Where the user navigated from — used to build breadcrumbs */
  source: PreviewSource;
}
