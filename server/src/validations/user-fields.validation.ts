import { z } from "zod";
import {
  FULL_NAME_MAX_LENGTH,
  FULL_NAME_MIN_LENGTH,
  RESERVED_USERNAMES,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../constants/constants.js";

// Mirrors client/src/lib/userValidation.ts — keep both in sync.
export const fullNameSchema = z
  .string({ error: "Full name is required" })
  .trim()
  .min(FULL_NAME_MIN_LENGTH, `Full name must be at least ${FULL_NAME_MIN_LENGTH} characters`)
  .max(FULL_NAME_MAX_LENGTH, `Full name must be at most ${FULL_NAME_MAX_LENGTH} characters`);

export const usernameSchema = z
  .string({ error: "Username is required" })
  .trim()
  .toLowerCase()
  .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`)
  .max(USERNAME_MAX_LENGTH, `Username must be at most ${USERNAME_MAX_LENGTH} characters`)
  .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores")
  .refine((username) => !RESERVED_USERNAMES.has(username), "This username is reserved");
