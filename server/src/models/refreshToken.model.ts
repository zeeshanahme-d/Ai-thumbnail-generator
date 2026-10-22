import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    // SHA-256 of the token (see hashToken); the token itself only lives in the cookie.
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },

    // Shared by every token rotated from the same login, so a reused token revokes them all.
    family: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Set when the token is exchanged for a new one. It is kept until it expires so a
    // replay can be detected.
    usedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// TTL index: MongoDB removes the document automatically once expiresAt passes.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("RefreshToken", refreshTokenSchema);
