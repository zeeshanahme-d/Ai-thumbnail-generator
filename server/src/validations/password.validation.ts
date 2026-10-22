import { z } from "zod";
import { PASSWORD_MAX_BYTES, PASSWORD_MIN_LENGTH } from "../constants/constants.js";

// Mirrors client/src/lib/passwordValidation.ts — keep both in sync.
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
