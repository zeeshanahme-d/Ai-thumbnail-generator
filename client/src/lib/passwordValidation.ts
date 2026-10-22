import { z } from "zod";

// Mirrors server/src/validations/password.validation.ts — keep both in sync.
export const PASSWORD_MIN_LENGTH = 8;

// bcrypt ignores everything past 72 bytes, so longer passwords are rejected.
export const PASSWORD_MAX_BYTES = 72;

export const passwordSchema = z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
    .regex(/[a-z]/, "Password must include a lowercase letter.")
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/\d/, "Password must include a number.")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character.")
    .refine(
        (value) => new TextEncoder().encode(value).length <= PASSWORD_MAX_BYTES,
        `Password must be at most ${PASSWORD_MAX_BYTES} bytes.`,
    );
