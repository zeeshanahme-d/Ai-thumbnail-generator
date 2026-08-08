import type { ApiSuccess } from "../../auth/core/_models";
import type { Thumbnail } from "../../../types";

export interface GenerateThumbnailPayload {
  title: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  color_scheme: string;
  text_overlay?: boolean;
  referenceImage?: File | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  style?: string;
  userId?: string;
}

export type GetThumbnailsParams = PaginationParams;

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedThumbnailsResponse {
  thumbnails: Thumbnail[];
  meta: PaginatedMeta;
}

export interface LikeResponse {
  isLiked: boolean;
}

export type ApiSuccessEnvelope<T> = ApiSuccess<T>;
