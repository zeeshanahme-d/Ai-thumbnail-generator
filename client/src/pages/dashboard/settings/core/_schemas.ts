import { z } from "zod";
import { passwordSchema } from "../../../../lib/passwordValidation";

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .trim()
        // .min(2, "Full name must be at least 2 characters")
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

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: passwordSchema,
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

