import mongoose from "mongoose";
import {
  AuthProvider,
  SubscriptionStatus,
  UserPlan,
} from "../constants/enums.js";
import mediaSchema from "../schemas/media.schema.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 50,
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

    emailVerificationOtp: {
      type: String,
      select: false,
    },

    emailVerificationOtpExpiresAt: {
      type: Date,
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

    totalcredits: {
      type: Number,
      default: 20,
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

export default mongoose.model("User", userSchema);
