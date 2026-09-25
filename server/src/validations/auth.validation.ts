import { z } from "zod";
import { passwordSchema } from "./password.validation.js";

const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(4, "Full name must be at least 4 characters")
    .max(50),

  email: z.email("Invalid email address").trim().toLowerCase(),

  password: passwordSchema,
});

const updateProfileSchema = z.object({
  fullName: z
    .string({ error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters"),
  username: z
    .string({ error: "Username is required" })
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores",
    )
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(200, "Bio must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
});

const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
});

const verifyOtpSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
})

const resetPasswordSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
  newPassword: passwordSchema,
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

// Verification codes use the same shapes as the reset flow.
const verifyEmailSchema = verifyOtpSchema;
const resendVerificationSchema = forgotPasswordSchema;

export {
  verifyEmailSchema,
  resendVerificationSchema,
  signupSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  changePasswordSchema,
  deleteAccountSchema,
};

