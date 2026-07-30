import api from "../../../lib/axios";
import type {
  ApiSuccessEnvelope,
  GenerateThumbnailPayload,
  PaginatedThumbnailsResponse,
  PaginationParams,
  LikeResponse,
} from "./_models";
import type { Thumbnail } from "../../../types";

export const THUMBNAIL_URL = {
  root: "/thumbnail",
  community: "/thumbnail/community",
  recycleBin: "/thumbnail/recycle-bin",
  byId: (id: string) => `/thumbnail/${id}`,
  publish: (id: string) => `/thumbnail/${id}/publish`,
  like: (id: string) => `/thumbnail/${id}/like`,
  restore: (id: string) => `/thumbnail/${id}/restore`,
  permanent: (id: string) => `/thumbnail/${id}/permanent`,
};

export async function getMyThumbnails(params?: PaginationParams) {
  const { data } = await api.get<ApiSuccessEnvelope<PaginatedThumbnailsResponse>>(
    THUMBNAIL_URL.root,
    { params }
  );
  return data.data as PaginatedThumbnailsResponse;
}

export async function getCommunityThumbnails(params?: PaginationParams) {
  const { data } = await api.get<ApiSuccessEnvelope<PaginatedThumbnailsResponse>>(
    THUMBNAIL_URL.community,
    { params }
  );
  return data.data as PaginatedThumbnailsResponse;
}

export async function getRecycleBinThumbnails(params?: PaginationParams) {
  const { data } = await api.get<ApiSuccessEnvelope<PaginatedThumbnailsResponse>>(
    THUMBNAIL_URL.recycleBin,
    { params }
  );
  return data.data as PaginatedThumbnailsResponse;
}

export async function generateThumbnail(payload: GenerateThumbnailPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("prompt", payload.prompt || "");
  formData.append("style", payload.style);
  formData.append("aspect_ratio", payload.aspect_ratio);
  formData.append("color_scheme", payload.color_scheme);
  if (payload.text_overlay !== undefined) {
    formData.append("text_overlay", String(payload.text_overlay));
  }
  if (payload.referenceImage) {
    formData.append("referenceImage", payload.referenceImage);
  }

  const { data } = await api.post<ApiSuccessEnvelope<Thumbnail>>(
    THUMBNAIL_URL.root,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.data as Thumbnail;
}

export async function publishThumbnail(id: string, published: boolean) {
  const { data } = await api.patch<ApiSuccessEnvelope<Thumbnail>>(
    THUMBNAIL_URL.publish(id),
    { published }
  );
  return data.data as Thumbnail;
}

export async function likeThumbnail(id: string) {
  const { data } = await api.post<ApiSuccessEnvelope<LikeResponse>>(
    THUMBNAIL_URL.like(id)
  );
  return data.data as LikeResponse;
}

export async function deleteThumbnail(id: string) {
  const { data } = await api.delete<ApiSuccessEnvelope<Thumbnail>>(
    THUMBNAIL_URL.byId(id)
  );
  return data.data as Thumbnail;
}

export async function restoreThumbnail(id: string) {
  const { data } = await api.patch<ApiSuccessEnvelope<Thumbnail>>(
    THUMBNAIL_URL.restore(id)
  );
  return data.data as Thumbnail;
}

export async function permanentDeleteThumbnail(id: string) {
  const { data } = await api.delete<ApiSuccessEnvelope<null>>(
    THUMBNAIL_URL.permanent(id)
  );
  return data;
}
