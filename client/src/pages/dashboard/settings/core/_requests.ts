import api from "../../../../lib/axios";
import type { ApiSuccess } from "../../../auth/core/_models";
import type {
    ChangePasswordPayload,
    DeleteAccountPayload,
    UpdateProfilePayload,
    UpdateProfileResponse,
    UploadAvatarResponse,
} from "./_models";

export const SETTINGS_URL = {
    uploadAvatar: "/upload/avatar",
    updateProfile: "/users/profile",
    changePassword: "/auth/change-password",
    deleteAccount: "/users/account",
};

export const uploadAvatarRequest = (formData: FormData) => {
    return api
        .post<ApiSuccess<UploadAvatarResponse>>(SETTINGS_URL.uploadAvatar, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => response.data);
};

export const updateProfileRequest = (body: UpdateProfilePayload) => {
    return api
        .patch<ApiSuccess<UpdateProfileResponse>>(SETTINGS_URL.updateProfile, body)
        .then((response) => response.data);
};

export const changePasswordRequest = (body: ChangePasswordPayload) => {
    return api
        .post<ApiSuccess<never>>(SETTINGS_URL.changePassword, body)
        .then((response) => response.data);
};

export const deleteAccountRequest = (body: DeleteAccountPayload) => {
    return api
        .delete<ApiSuccess<never>>(SETTINGS_URL.deleteAccount, { data: body })
        .then((response) => response.data);
};
