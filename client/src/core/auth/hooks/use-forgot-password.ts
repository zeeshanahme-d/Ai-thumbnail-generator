import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../_requests";
import type { ApiSuccess, ForgotPasswordPayload } from "../_models";

export function useForgotPassword() {
    return useMutation<ApiSuccess<never>, unknown, ForgotPasswordPayload>({
        mutationFn: forgotPassword,
    });
}
