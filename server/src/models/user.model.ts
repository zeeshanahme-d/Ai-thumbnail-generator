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

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    // Validated as an http(s) link by updateProfileSchema.
    website: {
      type: String,
      default: "",
      trim: true,
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

    // The only spendable credits. 0 until the email is verified, so throwaway signups get nothing.
    freeCredits: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger,
    },

    usedCredits: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger,
    },

    // Shown, never spent.
    subscriptionCredits: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger,
    },

    packCredits: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger,
    },

    // Paddle transactions already turned into pack credits, so a webhook retry adds nothing.
    creditPackTransactionIds: {
      type: [String],
      select: false,
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

    // Null while a cancellation is scheduled: the plan then ends at subscriptionPeriodEnd.
    subscriptionRenewsAt: {
      type: Date,
      default: null,
    },

    paddleCustomerId: {
      type: String,
      default: null,
    },

    // The last billing period Paddle took payment for. Each one sets subscriptionCredits once.
    subscriptionPeriodStart: {
      type: Date,
      default: null,
    },

    subscriptionPeriodEnd: {
      type: Date,
      default: null,
    },

    // Paddle's updated_at of the last synced subscription event, so an older retry never overwrites a newer state.
    subscriptionUpdatedAt: {
      type: Date,
      default: null,
    },

    // Next refill of the free credits. Set when the email is verified, then moved on by each refill.
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

// The scheduled job looks up accounts whose free credits are due for a refill.
userSchema.index({ creditsResetAt: 1 });

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
  "creditPackTransactionIds",
];

const CREDIT_FIELDS = ["freeCredits", "subscriptionCredits", "packCredits"];

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    for (const field of PRIVATE_FIELDS) delete ret[field];
    // Calculated, never stored, so a hand edit can't leave it wrong.
    if ("freeCredits" in ret) {
      ret.totalCredits = CREDIT_FIELDS.reduce((sum, field) => sum + Math.max(0, Number(ret[field]) || 0), 0);
    }
    return ret;
  },
});

export default mongoose.model("User", userSchema);
