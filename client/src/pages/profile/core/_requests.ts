import api from "../../../lib/axios";
import type { ApiSuccess } from "../../auth/core/_models";
import type { CheckUsernameResponse, PublicProfileResponse } from "./_models";

export async function getPublicProfileRequest(username: string) {
  const { data } = await api.get<ApiSuccess<PublicProfileResponse>>(
    `/users/${username}/profile`,
  );
  return data.data as PublicProfileResponse;
}

export async function checkUsernameRequest(
  username: string,
  excludeUserId?: string,
) {
  const { data } = await api.get<ApiSuccess<CheckUsernameResponse>>(
    `/users/check-username/${username}`,
    {
      params: excludeUserId ? { excludeUserId } : undefined,
    },
  );
  return data.data as CheckUsernameResponse;
}
