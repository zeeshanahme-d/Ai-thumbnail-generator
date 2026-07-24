import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshToken } from "../_requests";
import { authKeys } from "./query-keys";
import { useSession } from "../../../../store/useSessionStore";
import type { AuthResponse } from "../_models";

// Exchanges the httpOnly refresh cookie for a new access token.
export function useRefreshToken() {
    const queryClient = useQueryClient();
    const setSession = useSession((state) => state.setSession);
    const clearSession = useSession((state) => state.clearSession);

    return useMutation<AuthResponse>({
        mutationFn: refreshToken,
        onSuccess: ({ accessToken, user }) => {
            setSession(user, accessToken);
            queryClient.setQueryData(authKeys.me(), user);
        },
        onError: () => {
            clearSession();
        },
    });
}
