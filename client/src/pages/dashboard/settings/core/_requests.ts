import api from "../../../../lib/axios";
import type {
    ChangePasswordPayload,
    UpdateProfilePayload,
} from "./_models";

export const SETTINGS_URL = {
    uploadAvatar: "/upload/avatar",
    updateProfile: "/users/profile",
    changePassword: "/auth/change-password",
    deleteAccount: "/users/account",
};

export const uploadAvatarRequest = (formData: FormData) => {
    return api
        .post(SETTINGS_URL.uploadAvatar, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => response.data);
};

export const updateProfileRequest = (body: UpdateProfilePayload) => {
    return api.patch(SETTINGS_URL.updateProfile, body).then((response) => response.data);
};

export const changePasswordRequest = (body: ChangePasswordPayload) => {
    return api.post(SETTINGS_URL.changePassword, body).then((response) => response.data);
};

export const deleteAccountRequest = () => {
    return api.delete(SETTINGS_URL.deleteAccount).then((response) => response.data);
};


