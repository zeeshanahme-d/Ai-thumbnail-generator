import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordPayload } from "../_models";
import { changePasswordRequest } from "../_requests";

const useChangePassword = () => {
    const { mutate: changePasswordMutate, isPending } = useMutation({
        mutationFn: (body: ChangePasswordPayload) => changePasswordRequest(body),
    });

    return { changePasswordMutate, isPending };
};

export default useChangePassword;
export { useChangePassword };
