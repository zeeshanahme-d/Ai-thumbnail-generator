import type { IUser } from "../../../../types";

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
