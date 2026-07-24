import api from "../../../lib/axios";
import type {
    ApiSuccess,
    AuthResponse,
    LoginPayload,
    MeResponse,
    SignupPayload,
} from "./_models";

export const AUTH_URL = {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    verify: "/auth/verify",
    logout: "/auth/logout",
    me: "/auth/me",
};

export async function login(payload: LoginPayload) {
    const { data } = await api.post<ApiSuccess<AuthResponse>>(
        AUTH_URL.login,
        payload,
    );
    return data.data as AuthResponse;
}

export async function signup(payload: SignupPayload) {
    const { data } = await api.post<ApiSuccess<never>>(AUTH_URL.signup, payload);
    return data;
}

export async function refreshToken() {
    const { data } = await api.post<ApiSuccess<AuthResponse>>(AUTH_URL.refresh);
    return data.data as AuthResponse;
}

// Validates the access token, falling back to the refresh cookie.
// Returns the (possibly new) access token plus the user.
export async function verifySession() {
    const { data } = await api.post<ApiSuccess<AuthResponse>>(AUTH_URL.verify);
    return data.data as AuthResponse;
}

export async function logout() {
    const { data } = await api.post<ApiSuccess<never>>(AUTH_URL.logout);
    return data;
}

export async function getMe() {
    const { data } = await api.get<ApiSuccess<MeResponse>>(AUTH_URL.me);
    return (data.data as MeResponse).user;
}
