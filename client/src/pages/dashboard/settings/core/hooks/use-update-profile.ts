import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileRequest } from "../_requests";
import type { UpdateProfilePayload } from "../_models";
import { useSession } from "../../../../../store/useSessionStore";
import { authKeys } from "../../../../auth/core/hooks/query-keys";

const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const setSession = useSession((state) => state.setSession);

    const { mutate: updateProfileMutate, isPending } = useMutation({
        mutationFn: (body: UpdateProfilePayload) => updateProfileRequest(body),
        onSuccess: (res: any) => {
            const user = res?.data?.user || res?.user;
            if (user) {
                setSession(user);
                queryClient.setQueryData(authKeys.me(), user);
            }
        },
    });

    return { updateProfileMutate, isPending };
};

export default useUpdateProfile;
export { useUpdateProfile };
