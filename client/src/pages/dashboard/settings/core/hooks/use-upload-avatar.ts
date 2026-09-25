import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../../../../auth/core/hooks/query-keys";
import { useSession } from "../../../../../store/useSessionStore";
import { uploadAvatarRequest } from "../_requests";

const useUploadAvatar = () => {
    const queryClient = useQueryClient();
    const setSession = useSession((state) => state.setSession);

    const { mutate: uploadAvatarMutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => uploadAvatarRequest(formData),
        onSuccess: (res) => {
            const user = res.data?.user;
            if (user) {
                setSession(user);
                queryClient.setQueryData(authKeys.me(), user);
            }
        },
    });

    return { uploadAvatarMutate, isPending };
};

export default useUploadAvatar;
export { useUploadAvatar };
