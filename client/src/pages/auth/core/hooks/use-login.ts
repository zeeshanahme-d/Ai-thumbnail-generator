import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../_requests";
import { authKeys } from "./query-keys";
import { useSession } from "../../../../store/useSessionStore";
import type { AuthResponse, LoginPayload } from "../_models";

export function useLogin() {
    const queryClient = useQueryClient();
    const setSession = useSession((state) => state.setSession);

    return useMutation<AuthResponse, unknown, LoginPayload>({
        mutationFn: login,
        onSuccess: ({ user }) => {
            setSession(user);
            queryClient.setQueryData(authKeys.me(), user);
        },
    });
}
