import { useQuery } from "@tanstack/react-query";
import { getMe } from "../_requests";
import { authKeys } from "./query-keys";
import { useSession } from "../../../../store/useSessionStore";
import type { IUser } from "../_models";

// Current user behind the access token. Skipped when there is no session.
export function useMe(enabled = true) {
    const user = useSession((state) => state.user);

    return useQuery<IUser>({
        queryKey: authKeys.me(),
        queryFn: getMe,
        enabled: enabled && !!user,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}
