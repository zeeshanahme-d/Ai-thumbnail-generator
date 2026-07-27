// Envelope returned by the server's ApiResponse helper.
export interface ApiSuccess<T> {
    success: true;
    statusCode: number;
    message: string;
    data?: T;
    timestamp: string;
}

export interface ApiError {
    success: false;
    statusCode: number;
    message: string;
    error?: string;
    timestamp: string;
}

export interface IUser {
    _id: string;
    fullName: string;
    username?: string;
    email: string;
    image_url?: string;
    avatar?: {
        url: string;
        publicId: string;
        originalName: string;
        directory: string;
        format: string;
        bytes: number;
    };
    coverUrl?: string;
    bio?: string;
    website?: string;
    provider: "email" | "google";
    isVerified: boolean;
    plan: "free" | "pro" | "ultra";
    credits: number;
    subscriptionId?: string | null;
    subscriptionStatus?: string | null;
    subscriptionRenewsAt?: string | null;
    generationsThisMonth: number;
    generationsResetAt?: string | null;
    followersCount: number;
    followingCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    fullName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: IUser;
}

export interface MeResponse {
    user: IUser;
}
