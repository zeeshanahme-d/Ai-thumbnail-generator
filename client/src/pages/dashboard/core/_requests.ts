import api from "../../../lib/axios";
import type {
  ApiSuccessEnvelope,
  GenerateThumbnailPayload,
  MyThumbnailsResponse,
} from "./_models";
import type { Thumbnail } from "../../../types";

export const THUMBNAIL_URL = {
  root: "/thumbnail",
  byId: (id: string) => `/thumbnail/${id}`,
};

export async function generateThumbnail(payload: GenerateThumbnailPayload) {
  const { data } = await api.post<ApiSuccessEnvelope<Thumbnail>>(
    THUMBNAIL_URL.root,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
  );
  return data.data as Thumbnail;
}

export async function getMyThumbnails(deleted = false) {
  const { data } = await api.get<ApiSuccessEnvelope<MyThumbnailsResponse>>(
    THUMBNAIL_URL.root,
    { params: deleted ? { deleted: "true" } : undefined },
  );
  return data.data as MyThumbnailsResponse;
}

export async function deleteThumbnail(id: string) {
  const { data } = await api.delete<ApiSuccessEnvelope<Thumbnail>>(
    THUMBNAIL_URL.byId(id),
  );
  return data.data as Thumbnail;
}

export async function restoreThumbnail(id: string) {
  const { data } = await api.patch<ApiSuccessEnvelope<Thumbnail>>(
    `${THUMBNAIL_URL.byId(id)}/restore`,
  );
  return data.data as Thumbnail;
}

export async function permanentDeleteThumbnail(id: string) {
  const { data } = await api.delete<ApiSuccessEnvelope<null>>(
    `${THUMBNAIL_URL.byId(id)}/permanent`,
  );
  return data;
}
