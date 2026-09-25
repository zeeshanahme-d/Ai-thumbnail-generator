import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, verifyEmail } from "../_requests";
import { authKeys } from "./query-keys";
import { useSession } from "../../../../store/useSessionStore";
import type { ApiSuccess, VerifyEmailPayload } from "../_models";

export function useVerifyEmail() {
    const queryClient = useQueryClient();
    const isAuthenticated = useSession((state) => state.isAuthenticated);
    const setSession = useSession((state) => state.setSession);

    return useMutation<ApiSuccess<never>, unknown, VerifyEmailPayload>({
        mutationFn: verifyEmail,
        onSuccess: async () => {
            if (!isAuthenticated) return;
            // Pull the new credits and verified status into the session right away.
            try {
                const user = await getMe();
                setSession(user);
                queryClient.setQueryData(authKeys.me(), user);
            } catch {
                // Verification already succeeded; the next session check picks up the change.
            }
        },
    });
}
