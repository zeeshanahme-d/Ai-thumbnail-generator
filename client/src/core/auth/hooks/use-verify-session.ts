import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifySession } from "../_requests";
import { authKeys } from "./query-keys";
import { useSession } from "../../../store/useSessionStore";
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
        onSuccess: ({ user }) => {
            setSession(user);
            queryClient.setQueryData(authKeys.me(), user);
        },
        // Only a rejected session signs the user out. Being offline or a server error keeps it.
        onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 401) {
                clearSession();
            }
        },
        onSettled: () => {
            finishRestoring();
        },
    });
}
