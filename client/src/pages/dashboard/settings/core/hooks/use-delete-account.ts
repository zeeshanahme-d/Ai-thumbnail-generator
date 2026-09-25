import { useMutation } from "@tanstack/react-query";
import { deleteAccountRequest } from "../_requests";

const useDeleteAccount = () => {
    const { mutate: deleteAccountMutate, isPending } = useMutation({
        mutationFn: () => deleteAccountRequest(),
    });

    return { deleteAccountMutate, isPending };
};

export default useDeleteAccount;
export { useDeleteAccount };
