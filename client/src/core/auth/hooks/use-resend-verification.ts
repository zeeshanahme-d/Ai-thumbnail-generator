import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "../_requests";
import type { ApiSuccess, ResendVerificationPayload } from "../_models";

export function useResendVerification() {
    return useMutation<ApiSuccess<never>, unknown, ResendVerificationPayload>({
        mutationFn: resendVerification,
    });
}
