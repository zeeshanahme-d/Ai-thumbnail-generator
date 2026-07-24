import mongoose from "mongoose";
import {
  AspectRatio,
  ColorScheme,
  ThumbnailModel,
  ThumbnailStyle,
} from "../constants/enums.js";

const thumbnailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
    },

    model: {
      type: String,
      enum: Object.values(ThumbnailModel),
      default: ThumbnailModel.Basic,
    },

    style: {
      type: String,
      enum: Object.values(ThumbnailStyle),
      required: true,
    },

    aspect_ratio: {
      type: String,
      enum: Object.values(AspectRatio),
      default: AspectRatio.Widescreen,
    },

    color_scheme: {
      type: String,
      enum: Object.values(ColorScheme),
      default: ColorScheme.Vibrant,
    },

    text_overlay: {
      type: Boolean,
      default: false,
    },

    image_url: {
      type: String,
      default: "",
    },

    // What the user typed, and the final prompt sent to the model.
    user_prompt: {
      type: String,
      default: "",
      trim: true,
    },

    prompt_used: {
      type: String,
      default: "",
      trim: true,
    },

    // Flipped to false once the image lands in image_url.
    isGenerating: {
      type: Boolean,
      default: true,
    },

    // Private until the user shares it to the community gallery.
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Community feed (newest published first) and a user's own gallery.
thumbnailSchema.index({ published: 1, createdAt: -1 });
thumbnailSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Thumbnail", thumbnailSchema);
