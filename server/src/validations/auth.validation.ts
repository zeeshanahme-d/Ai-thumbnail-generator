import { z } from "zod";
import { passwordSchema } from "./password.validation.js";
import { fullNameSchema, usernameSchema } from "./user-fields.validation.js";

const signupSchema = z.object({
  fullName: fullNameSchema,

  email: z.email("Invalid email address").trim().toLowerCase(),

  password: passwordSchema,
});

const updateProfileSchema = z.object({
  fullName: fullNameSchema,
  username: usernameSchema.optional().or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(200, "Bio must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  // http and https only: javascript: and data: links would run in the visitor's browser.
  website: z
    .string()
    .trim()
    .url({ protocol: /^https?$/, message: "Enter a link that starts with http:// or https://" })
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

