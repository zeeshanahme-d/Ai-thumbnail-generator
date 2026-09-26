import { useMutation } from "@tanstack/react-query";
import { logout } from "../_requests";
import { useSession } from "../../../store/useSessionStore";

export function useLogout() {
    const clearSession = useSession((state) => state.clearSession);

    return useMutation({
        mutationFn: logout,
        // Clear locally even if the request fails — the user asked to leave.
        onSettled: () => {
            clearSession();
        },
    });
}
