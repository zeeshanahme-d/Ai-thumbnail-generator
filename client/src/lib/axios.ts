import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { useSession } from "../store/useSessionStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Queue requests that 401 while a refresh is already in flight.

const refreshAccessToken = async () => {
    const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
    );
    const { user } = data.data;
    useSession.getState().setSession(user);
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };
        const code = error.response?.data?.error;
        const isExpired = error.response?.status === 401 && (code === "TOKEN_EXPIRED" || code === "TOKEN_MISSING");
        if (!isExpired || original?._retry) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            await refreshAccessToken();
            return api(original);
        } catch (refreshError) {
            useSession.getState().clearSession();
            return Promise.reject(refreshError);
        }
    },
);

// Pulls the server's `message` out of an axios error for display in the UI.
export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong.",
): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return data?.message ?? error.message ?? fallback;
    }
    return fallback;
}

export default api;
