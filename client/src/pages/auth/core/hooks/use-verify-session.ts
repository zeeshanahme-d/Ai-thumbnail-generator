import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifySession } from "../_requests";
import { authKeys } from "./query-keys";
import { useSession } from "../../../../store/useSessionStore";
import type { AuthResponse } from "../_models";

// Boot-time session restore: validates the stored access token and falls back
// to the refresh cookie, persisting whichever token comes back.
export function useVerifySession() {
    const queryClient = useQueryClient();
    const setSession = useSession((state) => state.setSession);
    const clearSession = useSession((state) => state.clearSession);
    const finishRestoring = useSession((state) => state.finishRestoring);

    return useMutation<AuthResponse>({
        mutationFn: verifySession,
        onSuccess: ({ accessToken, user }) => {
            setSession(user, accessToken);
            queryClient.setQueryData(authKeys.me(), user);
        },
        onError: () => {
            clearSession();
        },
        onSettled: () => {
            finishRestoring();
        },
    });
}
