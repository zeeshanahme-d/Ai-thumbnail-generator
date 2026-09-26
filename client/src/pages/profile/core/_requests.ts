import api from "../../../lib/axios";
import type { ApiSuccess } from "../../../core/auth/_models";
import type { CheckUsernameResponse, PublicProfileResponse } from "./_models";

export async function getPublicProfileRequest(username: string) {
  const { data } = await api.get<ApiSuccess<PublicProfileResponse>>(
    `/users/${encodeURIComponent(username)}/profile`,
  );
  return data.data as PublicProfileResponse;
}

export async function checkUsernameRequest(
  username: string,
  excludeUserId?: string,
) {
  const { data } = await api.get<ApiSuccess<CheckUsernameResponse>>(
    `/users/check-username/${encodeURIComponent(username)}`,
    {
      params: excludeUserId ? { excludeUserId } : undefined,
    },
  );
  return data.data as CheckUsernameResponse;
}
