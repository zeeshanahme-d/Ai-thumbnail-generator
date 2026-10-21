import { z } from "zod";
import { passwordSchema } from "../../../../lib/passwordValidation";
import { fullNameSchema, usernameSchema } from "../../../../lib/userValidation";

export const updateProfileSchema = z.object({
    fullName: fullNameSchema,
    username: usernameSchema,
    bio: z
        .string()
        .trim()
        .max(200, "Bio must be at most 200 characters"),
    // Mirrors the server: http and https links only.
    website: z
        .string()
        .trim()
        .refine(
            (val) => val === "" || z.string().url({ protocol: /^https?$/ }).safeParse(val).success,
            "Enter a link that starts with http:// or https://",
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

