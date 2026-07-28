import type { ApiSuccess } from "../../auth/core/_models";
import type { Thumbnail } from "../../../types";

export interface GenerateThumbnailPayload {
  title: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  color_scheme: string;
  text_overlay?: boolean;
}

export interface MyThumbnailsResponse {
  thumbnails: Thumbnail[];
  total: number;
}

export type ApiSuccessEnvelope<T> = ApiSuccess<T>;
