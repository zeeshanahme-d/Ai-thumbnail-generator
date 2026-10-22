import type { ChangePasswordPayload, IUser } from "../../../../types";

export type { ChangePasswordPayload };

export interface UploadAvatarResponse {

    user: IUser;
}

export interface UpdateProfilePayload {
    fullName: string;
    username: string;
    bio: string;
    website: string;
}

export interface UpdateProfileResponse {
    user: IUser;
}

export interface DeleteAccountPayload {
    password: string;
}
