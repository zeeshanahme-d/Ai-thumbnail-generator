import type { ApiSuccess } from "../auth/_models";
import type { IUser, Thumbnail, ThumbnailFilters } from "../../types";

export interface GenerateThumbnailPayload {
  title: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  color_scheme: string;
  text_overlay?: boolean;
  referenceImage?: File | null;
}

export interface GenerateThumbnailResponse {
  thumbnail: Thumbnail;
  credits: Pick<IUser, "totalcredits" | "creditsUsed" | "creditsResetAt">;
}

export interface PaginationParams extends ThumbnailFilters {
  page?: number;
}

export type ThumbnailListSource = "mine" | "community" | "recycleBin";

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
