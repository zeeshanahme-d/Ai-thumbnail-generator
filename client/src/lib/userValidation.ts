import { z } from "zod";

// Mirrors server/src/validations/user-fields.validation.ts — keep both in sync.
const FULL_NAME_MIN_LENGTH = 2;
const FULL_NAME_MAX_LENGTH = 50;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;

// Names that could pass for staff, the brand or an app route.
const RESERVED_USERNAMES = new Set([
    "admin",
    "administrator",
    "root",
    "system",
    "support",
    "help",
    "staff",
    "moderator",
    "mod",
    "official",
    "team",
    "security",
    "billing",
    "thumblify",
    "api",
    "settings",
    "dashboard",
    "login",
    "signup",
    "logout",
    "account",
    "profile",
    "community",
    "gallery",
    "generate",
    "preview",
    "thumbnail",
    "me",
    "null",
    "undefined",
]);

export const fullNameSchema = z
    .string()
    .trim()
    .min(FULL_NAME_MIN_LENGTH, `Full name must be at least ${FULL_NAME_MIN_LENGTH} characters`)
    .max(FULL_NAME_MAX_LENGTH, `Full name must be at most ${FULL_NAME_MAX_LENGTH} characters`);

export const usernameSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`)
    .max(USERNAME_MAX_LENGTH, `Username must be at most ${USERNAME_MAX_LENGTH} characters`)
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores")
    .refine((username) => !RESERVED_USERNAMES.has(username), "This username is reserved");
