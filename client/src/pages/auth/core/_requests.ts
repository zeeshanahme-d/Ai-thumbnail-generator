import api from "../../../lib/axios";
import type {
    ApiSuccess,
    AuthResponse,
    ForgotPasswordPayload,
    LoginPayload,
    MeResponse,
    ResendVerificationPayload,
    ResetPasswordPayload,
    SignupPayload,
    VerifyEmailPayload,
    VerifyOtpPayload,
} from "./_models";

export const AUTH_URL = {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    verify: "/auth/verify",
    logout: "/auth/logout",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    verifyOtp: "/auth/verify-otp",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
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

export async function forgotPassword(payload: ForgotPasswordPayload) {
    const { data } = await api.post<ApiSuccess<never>>(
        AUTH_URL.forgotPassword,
        payload,
    );
    return data;
}

export async function verifyOtp(payload: VerifyOtpPayload) {
    const { data } = await api.post<ApiSuccess<never>>(
        AUTH_URL.verifyOtp,
        payload,
    );
    return data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
    const { data } = await api.post<ApiSuccess<never>>(
        AUTH_URL.resetPassword,
        payload,
    );
    return data;
}

export async function verifyEmail(payload: VerifyEmailPayload) {
    const { data } = await api.post<ApiSuccess<never>>(
        AUTH_URL.verifyEmail,
        payload,
    );
    return data;
}

export async function resendVerification(payload: ResendVerificationPayload) {
    const { data } = await api.post<ApiSuccess<never>>(
        AUTH_URL.resendVerification,
        payload,
    );
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
