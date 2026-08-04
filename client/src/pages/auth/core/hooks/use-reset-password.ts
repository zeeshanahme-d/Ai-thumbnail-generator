import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../_requests";
import type { ApiSuccess, ResetPasswordPayload } from "../_models";

export function useResetPassword() {
    return useMutation<ApiSuccess<never>, unknown, ResetPasswordPayload>({
        mutationFn: resetPassword,
    });
}
