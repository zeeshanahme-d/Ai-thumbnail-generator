import type { MediaAsset } from "../../../types";

export interface PublicUserProfile {
  _id: string;
  fullName: string;
  username: string;
  avatar?: MediaAsset;
  bio?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

export interface PublicProfileResponse {
  user: PublicUserProfile;
  /** Likes across all of the user's published thumbnails. */
  likesCount: number;
}

export interface CheckUsernameResponse {
  available: boolean;
}
