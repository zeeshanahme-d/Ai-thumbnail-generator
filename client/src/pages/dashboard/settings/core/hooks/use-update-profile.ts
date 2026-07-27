import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../../../../auth/core/hooks/query-keys";
import { useSession } from "../../../../../store/useSessionStore";
import type { UpdateProfilePayload, UpdateProfileResponse } from "../_models";
import { updateProfileRequest } from "../_requests";

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const setSession = useSession((state) => state.setSession);

    return useMutation<UpdateProfileResponse, Error, UpdateProfilePayload>({
        mutationFn: updateProfileRequest,
        onSuccess: ({ user }) => {
            if (user) {
                setSession(user);
                queryClient.setQueryData(authKeys.me(), user);
            }
        },
    });
}
