import { useMutation } from "@tanstack/react-query";
import { deleteAccountRequest } from "../_requests";
import type { DeleteAccountPayload } from "../_models";

const useDeleteAccount = () => {
    const { mutate: deleteAccountMutate, isPending } = useMutation({
        mutationFn: (body: DeleteAccountPayload) => deleteAccountRequest(body),
    });

    return { deleteAccountMutate, isPending };
};

export default useDeleteAccount;
export { useDeleteAccount };
