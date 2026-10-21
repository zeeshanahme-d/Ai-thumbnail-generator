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

    // Credits bought in packs. They never expire and no refill touches them; generations
    // spend the monthly allowance above first.
    packCredits: {
      type: Number,
      default: 0,
      min: 0,
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

    // The last billing period Paddle took payment for. Each one refills the credits once.
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

    // Usage
    generationsThisMonth: {
      type: Number,
      default: 0,
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

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    for (const field of PRIVATE_FIELDS) delete ret[field];
    return ret;
  },
});

export default mongoose.model("User", userSchema);
