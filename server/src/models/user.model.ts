import mongoose from "mongoose";
import {
  AuthProvider,
  SubscriptionStatus,
  UserPlan,
} from "../constants/enums.js";
import mediaSchema from "../schemas/media.schema.js";
import { FULL_NAME_MAX_LENGTH, FULL_NAME_MIN_LENGTH } from "../constants/constants.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: FULL_NAME_MIN_LENGTH,
      maxlength: FULL_NAME_MAX_LENGTH,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    avatar: mediaSchema,

    coverUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    website: {
      type: String,
      default: "",
      trim: true,
      url: true
    },

    // Auth
    password: {
      type: String,
      minlength: 8,
      select: false,
    },

    resetPasswordOtp: {
      type: String,
      select: false,
    },

    resetPasswordOtpExpiresAt: {
      type: Date,
      select: false,
    },

    // Guesses made against the current code; the code stops working at MAX_OTP_ATTEMPTS.
    resetPasswordOtpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    emailVerificationOtp: {
      type: String,
      select: false,
    },

    emailVerificationOtpExpiresAt: {
      type: Date,
      select: false,
    },

    emailVerificationOtpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    // Carried in every token. Incrementing it ends all sessions at once.
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },

    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.Email,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Plan & subscription
    plan: {
      type: String,
      enum: Object.values(UserPlan),
      default: UserPlan.Free,
    },

    // New accounts start at 0. Verifying the email grants CREDIT_COST.SIGNUP_BONUS,
    // so throwaway signups cannot farm free credits.
    totalcredits: {
      type: Number,
      default: 0,
    },

    creditsUsed: {
      type: Number,
      default: 0,
    },

    subscriptionId: {
      type: String,
      default: null,
    },

    subscriptionStatus: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: null,
    },

    subscriptionRenewsAt: {
      type: Date,
      default: null,
    },

    // Usage
    generationsThisMonth: {
      type: Number,
      default: 0,
    },

    creditsResetAt: {
      type: Date,
      default: null,
    },

    // Social
    followersCount: {
      type: Number,
      default: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Secrets never leave the server, even when a query selected them.
const PRIVATE_FIELDS = [
  "password",
  "resetPasswordOtp",
  "resetPasswordOtpExpiresAt",
  "resetPasswordOtpAttempts",
  "emailVerificationOtp",
  "emailVerificationOtpExpiresAt",
  "emailVerificationOtpAttempts",
  "tokenVersion",
];

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    for (const field of PRIVATE_FIELDS) delete ret[field];
    return ret;
  },
});

export default mongoose.model("User", userSchema);
