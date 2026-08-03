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

import type { IUser } from "../../../types";
export type { IUser };

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
