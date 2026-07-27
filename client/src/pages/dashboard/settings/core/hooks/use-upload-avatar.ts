import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../../../../auth/core/hooks/query-keys";
import { useSession } from "../../../../../store/useSessionStore";
import type { UploadAvatarResponse } from "../_models";
import { uploadAvatarRequest } from "../_requests";

export function useUploadAvatar() {
    const queryClient = useQueryClient();
    const setSession = useSession((state) => state.setSession);

    return useMutation<UploadAvatarResponse, Error, FormData>({
        mutationFn: uploadAvatarRequest,
        onSuccess: ({ user }) => {
            if (user) {
                setSession(user);
                queryClient.setQueryData(authKeys.me(), user);
            }
        },
    });
}
