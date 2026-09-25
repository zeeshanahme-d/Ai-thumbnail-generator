import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../_requests";
import { useSyncSessionUser } from "./use-sync-session-user";
import { useSession } from "../../../../store/useSessionStore";
import type { ApiSuccess, VerifyEmailPayload } from "../_models";

export function useVerifyEmail() {
    const isAuthenticated = useSession((state) => state.isAuthenticated);
    const syncSessionUser = useSyncSessionUser();

    return useMutation<ApiSuccess<never>, unknown, VerifyEmailPayload>({
        mutationFn: verifyEmail,
        onSuccess: async () => {
            if (!isAuthenticated) return;
            // Pull the new credits and verified status into the session right away.
            try {
                await syncSessionUser();
            } catch {
                // Verification already succeeded; the next session check picks up the change.
            }
        },
    });
}
