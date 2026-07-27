import { z } from "zod";

// Mirrors server/src/validations/auth.validation.ts → updateProfileSchema
export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must be at most 50 characters"),
    username: z
        .string()
        .trim()
        .toLowerCase()
        .max(30, "Username must be at most 30 characters")
        .refine(
            (val) => val === "" || (val.length >= 3 && /^[a-z0-9_]+$/.test(val)),
            "Username must be at least 3 characters and contain only lowercase letters, numbers, and underscores",
        ),
    bio: z
        .string()
        .trim()
        .max(200, "Bio must be at most 200 characters"),
    website: z
        .string()
        .trim()
        .refine(
            (val) => val === "" || z.string().url().safeParse(val).success,
            "Enter a valid URL",
        ),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
