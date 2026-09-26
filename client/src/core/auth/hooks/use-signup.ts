import { useMutation } from "@tanstack/react-query";
import { signup } from "../_requests";
import type { ApiSuccess, SignupPayload } from "../_models";

// Signup only creates the account — the user still logs in afterwards.
export function useSignup() {
    return useMutation<ApiSuccess<never>, unknown, SignupPayload>({
        mutationFn: signup,
    });
}
