import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMe } from "../_requests";
import { authKeys } from "./query-keys";
import { useSession } from "../../../../store/useSessionStore";

// Re-reads the signed-in user, e.g. after credits or verification change on the server.
export function useSyncSessionUser() {
    const queryClient = useQueryClient();
    const setSession = useSession((state) => state.setSession);

    return useCallback(async () => {
        const user = await getMe();
        setSession(user);
        queryClient.setQueryData(authKeys.me(), user);
    }, [queryClient, setSession]);
}
