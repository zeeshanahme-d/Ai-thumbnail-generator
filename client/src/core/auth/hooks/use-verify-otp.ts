import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../_requests";
import type { ApiSuccess, VerifyOtpPayload } from "../_models";

export function useVerifyOtp() {
    return useMutation<ApiSuccess<never>, unknown, VerifyOtpPayload>({
        mutationFn: verifyOtp,
    });
}
