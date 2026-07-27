import api from "../../../../lib/axios";
import type { ApiSuccess } from "../../../auth/core/_models";
import type {
    UpdateProfilePayload,
    UpdateProfileResponse,
    UploadAvatarResponse,
} from "./_models";

export const SETTINGS_URL = {
    uploadAvatar: "/upload/avatar",
    updateProfile: "/users/profile",
};

export async function uploadAvatarRequest(formData: FormData) {
    const { data } = await api.post<ApiSuccess<UploadAvatarResponse>>(
        SETTINGS_URL.uploadAvatar,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return data.data as UploadAvatarResponse;
}

export async function updateProfileRequest(payload: UpdateProfilePayload) {
    const { data } = await api.patch<ApiSuccess<UpdateProfileResponse>>(
        SETTINGS_URL.updateProfile,
        payload,
    );
    return data.data as UpdateProfileResponse;
}
