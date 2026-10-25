import { Request, Response } from "express";
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory, } from "@google/genai";
import { generateImage, generateText } from "../utils/gemini.js";
import {
  CREDIT_COST,
  GEMINI_IMAGE_MODEL,
  GEMINI_TEXT_MODEL,
  GENERATION_FAILURES,
  PROMPT_IMPROVER_INSTRUCTION,
  PROMPT_MAX_LENGTH,
  THUMBNAIL_FORMATS,
  THUMBNAIL_SORT_OPTIONS,
} from "../constants/constants.js";
import thumbnailModel from "../models/thumbnail.model.js";
import likeDislikeModel from "../models/likeDislik.modal.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  AuthErrorCode,
  ColorScheme,
  GenerationErrorCode,
  ThumbnailCategory,
  ThumbnailFormat,
  ThumbnailStyle,
  UploadErrorCode,
} from "../constants/enums.js";
import { buildThumbnailPrompt } from "../utils/thumbnail-prompt.js";
import { getRemainingCredits, refundCredits, reserveCredits, resetDueCredits } from "../utils/credits.js";
import uploadFileOnCloudniary, { deleteFileFromCloudinary } from "../utils/cloudniary.js";
import { deleteThumbnailsForever } from "../utils/delete-thumbnails.js";
import { formatPaginatedResponse } from "../utils/pagination.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";
import { escapeRegex } from "../utils/helpers.js";
import { buildSharePage, getShareImageUrl, getThumbnailPageUrl } from "../utils/share-page.js";
import logger from "../utils/logger.js";

// Left out of public responses: how the creator paid for a generation and which model made it.
const PUBLIC_THUMBNAIL_PROJECTION = "-model";

const getUserLikedThumbnailIds = async (userId: string): Promise<Set<string>> => {
  const likes = await likeDislikeModel
    .find({ userId })
    .select("thumbnailId")
    .lean();

  return new Set(likes.map((item) => item.thumbnailId.toString()));
};


/**
 * POST /thumbnails
 * Generate a new thumbnail using Gemini AI model.
 */
const generateGminiThumbnail = async (req: Request, res: Response) => {
  const userId = req.user!.userId as string;
  let thumbnailId: string | null = null;
  let creditsReserved = false;
  let uploadedPublicId: string | null = null;
  let succeeded = false;

  try {
    const { title, prompt: user_prompt, style, format, category, color_scheme, text_overlay } = req.validated!.body;
    const aspect_ratio = THUMBNAIL_FORMATS[format as ThumbnailFormat].aspectRatio;

    if (!title || typeof title !== "string" || !title.trim()) {
      return ApiResponse.error(res, 400, "Please provide a thumbnail title.");
    }

    // A refill that fell due since the last scheduled run applies before the balance is checked.
    await resetDueCredits(userId);

    // Take the credits before calling Gemini. The finally block refunds them if anything fails.
    const reservation = await reserveCredits(userId, CREDIT_COST.GENERATE_COST);
    creditsReserved = reservation !== null;

    if (!reservation) {
      const user = await userModel.findById(userId);
      if (!user) {
        return ApiResponse.error(res, 404, "User account not found.");
      }

      // Free credits and their monthly refill need a verified email, including for
      // accounts created before verification existed.
      if (!user.isVerified) {
        return ApiResponse.error(res, 403, `Verify your email to get your ${CREDIT_COST.SIGNUP_BONUS} free credits.`, AuthErrorCode.EmailNotVerified);
      }

      const available = getRemainingCredits(user);
      return ApiResponse.error(res, 402, `You don't have enough credits to generate this thumbnail. Required: ${CREDIT_COST.GENERATE_COST} credits, Available: ${available} credits.`, "INSUFFICIENT_CREDITS");
    }

    const referenceImage = req.file;
    let referenceImagePart: { inlineData: { mimeType: string; data: string } } | null = null;

    if (referenceImage) {
      referenceImagePart = {
        inlineData: {
          mimeType: referenceImage.mimetype,
          data: referenceImage.buffer.toString("base64"),
        },
      };
    }

    const thumbnail = await thumbnailModel.create({
      userId,
      user_prompt: user_prompt ?? "",
      prompt_used: user_prompt ?? "",
      style: style || "Bold & Graphic",
      title: title.trim(),
      aspect_ratio,
      format,
      category,
      text_overlay: Boolean(text_overlay),
      color_scheme: color_scheme || "Vibrant",
      isGenerating: true,
    });
    thumbnailId = thumbnail._id.toString();

    const model = GEMINI_IMAGE_MODEL;
    const generateConfig: GenerateContentConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 0.95,
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: aspect_ratio,
        imageSize: "1k",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    };

    const prompt = buildThumbnailPrompt({
      title,
      prompt: user_prompt,
      style: style as ThumbnailStyle,
      colorScheme: color_scheme as ColorScheme,
      format: format as ThumbnailFormat,
      category: category as ThumbnailCategory,
      textOverlay: Boolean(text_overlay),
      hasReferenceImage: Boolean(referenceImagePart),
    });

    // The image first and the instructions last, as Google recommends for prompts with images.
    const contents = referenceImagePart ? [referenceImagePart, prompt] : [prompt];

    const result = await generateImage({
      model,
      contents,
      config: generateConfig,
    });

    if (!result.ok) {
      logger.warn("Thumbnail generation failed", { userId, code: result.code });
      const failure = GENERATION_FAILURES[result.code];
      return ApiResponse.error(res, failure.status, failure.message, result.code);
    }

    const finalResult = await uploadFileOnCloudniary(Buffer.from(result.imageBase64, "base64"));
    if (!finalResult) {
      return ApiResponse.error(res, 502, "Failed to upload generated image. Please try again.", UploadErrorCode.UploadFailed,);
    }
    uploadedPublicId = finalResult.public_id;

    thumbnail.thumbnail = {
      url: finalResult.secure_url,
      publicId: finalResult.public_id,
      originalName: finalResult.original_filename,
      directory: finalResult.asset_folder,
      format: finalResult.format,
      bytes: finalResult.bytes,
    };
    thumbnail.isGenerating = false;
    await thumbnail.save();

    succeeded = true;
    return ApiResponse.success(res, 201, "Thumbnail generated successfully.", { thumbnail, credits: reservation });

  } finally {
    if (creditsReserved && !succeeded) {
      // Only the side that deletes the record refunds it. If this delete fails, the
      // stuck-generation job removes the record later and refunds then.
      const removed = thumbnailId
        ? await thumbnailModel.deleteOne({ _id: thumbnailId }).then((r) => r.deletedCount === 1, () => false)
        : true;

      if (removed) {
        await refundCredits(userId, CREDIT_COST.GENERATE_COST).catch((error) => {
          logger.error("Failed to refund generation credits", { userId, credits: CREDIT_COST.GENERATE_COST, error });
        });
        // Uploaded before the save failed: with its record gone, nothing points at the image.
        if (uploadedPublicId) {
          await deleteFileFromCloudinary(uploadedPublicId);
        }
      }
    }
  }
};

/**
 * GET /thumbnails
 * Fetch active thumbnails owned by the currently authenticated user.
 */
const getMyThumbnails = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  if (!userId) {
    return ApiResponse.error(res, 401, "Unauthorized.");
  }

  const { page, limit, search, style, sort } = req.validated!.query;
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {
    userId,
    deletedAt: null,
  };

  if (style && typeof style === "string") {
    query.style = style;
  }
  if (search && typeof search === "string") {
    query.title = mongoose.trusted({
      $regex: escapeRegex(search.trim()),
      $options: "i",
    });
  }

  const sortQuery = THUMBNAIL_SORT_OPTIONS[String(sort)] ?? THUMBNAIL_SORT_OPTIONS.newest;

  const [rawThumbnails, total, likedSet] = await Promise.all([
    thumbnailModel
      .find(query)
      .sort(sortQuery)
      .populate("userId", "fullName username avatar.url")
      .lean()
      .skip(skip)
      .limit(limit),
    thumbnailModel.countDocuments(query),
    getUserLikedThumbnailIds(userId),
  ]);

  const thumbnails = rawThumbnails.map((thumbnail) => ({
    ...thumbnail,
    isLiked: likedSet.has(thumbnail._id.toString()),
  }));

  const paginatedData = formatPaginatedResponse(thumbnails, total, page, limit);

  return ApiResponse.success(res, 200, "User thumbnails fetched.", paginatedData);
};

/**
 * GET /thumbnails/community
 * Fetch all published community thumbnails (available publicly or for logged-in user).
 */
const getCommunityThumbnails = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { page, limit, search, style, sort, userId: filterUserId } = req.validated!.query;
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {
    published: true,
    deletedAt: null,
  };

  if (filterUserId && typeof filterUserId === "string") {
    query.userId = filterUserId;
  }
  if (style && typeof style === "string") {
    query.style = style;
  }
  // Substring match so the search box works while typing; a text index only matches whole words.
  // ponytail: scans every published title; move to Atlas Search autocomplete if the community grows large.
  if (search && typeof search === "string") {
    query.title = mongoose.trusted({
      $regex: escapeRegex(search.trim()),
      $options: "i",
    });
  }

  const sortQuery = THUMBNAIL_SORT_OPTIONS[String(sort)] ?? THUMBNAIL_SORT_OPTIONS.newest;

  const [rawThumbnails, total, likedSet] = await Promise.all([
    thumbnailModel
      .find(query)
      .select(PUBLIC_THUMBNAIL_PROJECTION)
      .sort(sortQuery)
      .populate("userId", "fullName username avatar.url")
      .lean()
      .skip(skip)
      .limit(limit),
    thumbnailModel.countDocuments(query),
    userId ? getUserLikedThumbnailIds(userId) : Promise.resolve(new Set<string>()),
  ]);

  const thumbnails = rawThumbnails.map((thumbnail) => ({
    ...thumbnail,
    isLiked: likedSet.has(thumbnail._id.toString()),
  }));

  const paginatedData = formatPaginatedResponse(thumbnails, total, page, limit);

  return ApiResponse.success(res, 200, "Community thumbnails fetched.", paginatedData);
};

/**
 * GET /thumbnails/:id
 * One thumbnail for its detail page: published ones for anyone, and any of their own for the owner.
 */
const getThumbnailById = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const visibleTo = [{ published: true, deletedAt: null }, ...(userId ? [{ userId }] : [])];

  const thumbnail = await thumbnailModel
    .findOne({ _id: req.params.id, $or: visibleTo })
    .select(PUBLIC_THUMBNAIL_PROJECTION)
    .populate("userId", "fullName username avatar.url")
    .lean();

  if (!thumbnail) {
    return ApiResponse.error(res, 404, "Thumbnail not found.");
  }

  const isLiked = userId ? Boolean(await likeDislikeModel.exists({ userId, thumbnailId: thumbnail._id })) : false;

  return ApiResponse.success(res, 200, "Thumbnail fetched.", { ...thumbnail, isLiked });
};

/**
 * GET /thumbnails/:id/share
 * The link people share: an HTML page with the thumbnail's Open Graph tags for link previews,
 * which sends visitors on to the app. Unpublished thumbnails go straight to the app.
 */
const getThumbnailSharePage = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return ApiResponse.error(res, 400, "Invalid thumbnail id.");
  }

  const pageUrl = getThumbnailPageUrl(String(id));
  const thumbnail = await thumbnailModel
    .findOne({ _id: id, published: true, deletedAt: null })
    .populate<{ userId: { fullName?: string } | null }>("userId", "fullName")
    .lean();

  if (!thumbnail?.thumbnail?.url) {
    return res.redirect(pageUrl);
  }

  const author = thumbnail.userId?.fullName ?? "an Eyecatch AI creator";
  return res.type("html").send(buildSharePage({
    title: thumbnail.title,
    description: `${thumbnail.style} thumbnail by ${author}, made with Eyecatch AI's AI thumbnail generator.`,
    imageUrl: getShareImageUrl(thumbnail.thumbnail.url),
    pageUrl,
  }));
};

/**
 * GET /thumbnails/recycle-bin
 * Fetch soft-deleted thumbnails owned by the currently authenticated user.
 */
const getRecycleBinThumbnails = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { page, limit, search, style, sort } = req.validated!.query;
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {
    userId,
    deletedAt: mongoose.trusted({ $ne: null }),
  };

  if (style && typeof style === "string") {
    query.style = style;
  }
  if (search && typeof search === "string") {
    query.title = mongoose.trusted({
      $regex: escapeRegex(search.trim()),
      $options: "i",
    });
  }

  const sortQuery = THUMBNAIL_SORT_OPTIONS[String(sort)] ?? THUMBNAIL_SORT_OPTIONS.newest;

  const [rawThumbnails, total] = await Promise.all([
    thumbnailModel
      .find(query)
      .sort(sortQuery)
      .populate("userId", "fullName username avatar.url")
      .lean()
      .skip(skip)
      .limit(limit),
    thumbnailModel.countDocuments(query),
  ]);

  const paginatedData = formatPaginatedResponse(rawThumbnails, total, page, limit);

  return ApiResponse.success(res, 200, "Recycle bin thumbnails fetched.", paginatedData);
};


/**
 * DELETE /thumbnails/:id
 * Soft delete a thumbnail by setting deletedAt to current timestamp.
 * It is also unpublished, so restoring it never puts it back in the community feed on its own.
 */
const softDeleteThumbnail = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return ApiResponse.error(res, 400, "Invalid thumbnail id.");
  }

  const thumbnail = await thumbnailModel.findOneAndUpdate(
    {
      _id: id,
      userId,
      deletedAt: null,
    },
    {
      $set: { deletedAt: new Date(), published: false },
    },
    { returnDocument: "after" }
  );

  if (!thumbnail) {
    return ApiResponse.error(res, 404, "Thumbnail not found.");
  }

  return ApiResponse.success(
    res,
    200,
    "Thumbnail moved to recycle bin.",
    thumbnail,
  );
};

/**
 * PATCH /thumbnails/:id/restore
 * Restore a soft-deleted thumbnail.
 */
const restoreThumbnail = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return ApiResponse.error(res, 400, "Invalid thumbnail id.");
  }

  const thumbnail = await thumbnailModel.findOneAndUpdate(
    {
      _id: id,
      userId,
      deletedAt: mongoose.trusted({ $ne: null }),
    },
    {
      $set: { deletedAt: null },
    },
    { returnDocument: "after" }
  );

  if (!thumbnail) {
    return ApiResponse.error(res, 404, "Thumbnail not found in recycle bin.");
  }

  return ApiResponse.success(
    res,
    200,
    "Thumbnail restored successfully.",
    thumbnail,
  );
};

/**
 * DELETE /thumbnails/:id/permanent
 * Permanently delete a thumbnail asset from Cloudinary and database.
 */
const permanentDeleteThumbnail = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return ApiResponse.error(res, 400, "Invalid thumbnail id.");
  }

  const deletedCount = await deleteThumbnailsForever({
    _id: id,
    userId,
    deletedAt: mongoose.trusted({ $ne: null }),
  });

  if (!deletedCount) {
    return ApiResponse.error(
      res,
      404,
      "Thumbnail not found in recycle bin.",
    );
  }

  return ApiResponse.success(
    res,
    200,
    "Thumbnail permanently deleted.",
  );
};

/**
 * DELETE /thumbnails/recycle-bin
 * Permanently delete everything in the user's recycle bin.
 */
const emptyRecycleBin = async (req: Request, res: Response) => {
  const deletedCount = await deleteThumbnailsForever({
    userId: req.user!.userId,
    deletedAt: mongoose.trusted({ $ne: null }),
  });

  return ApiResponse.success(res, 200, "Recycle bin emptied.", { deletedCount });
};

/**
 * PATCH /thumbnails/recycle-bin/restore
 * Restore everything in the user's recycle bin. Restored thumbnails stay unpublished.
 */
const restoreAllThumbnails = async (req: Request, res: Response) => {
  const { modifiedCount } = await thumbnailModel.updateMany(
    { userId: req.user!.userId, deletedAt: mongoose.trusted({ $ne: null }) },
    { $set: { deletedAt: null } },
  );

  return ApiResponse.success(res, 200, "Thumbnails restored.", { restoredCount: modifiedCount });
};

/**
 * POST /thumbnails/improve-prompt
 * Rewrite the user's idea into a more detailed image prompt. Free, but rate limited.
 */
const improvePrompt = async (req: Request, res: Response) => {
  const { prompt } = req.validated!.body;

  const result = await generateText({
    model: GEMINI_TEXT_MODEL,
    contents: prompt,
    config: { systemInstruction: PROMPT_IMPROVER_INSTRUCTION, temperature: 0.8 },
  });

  if (!result.ok) {
    const failure = GENERATION_FAILURES[result.code];
    const message = result.code === GenerationErrorCode.Blocked
      ? failure.message
      : "Couldn't improve your prompt right now. Please try again in a moment.";
    return ApiResponse.error(res, failure.status, message, result.code);
  }

  return ApiResponse.success(res, 200, "Prompt improved.", {
    prompt: result.text.slice(0, PROMPT_MAX_LENGTH),
  });
};

/**
 * POST /thumbnails/:id/like
 * Toggle like/unlike status for a thumbnail atomically.
 */
const likeDislikeThumbnail = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return ApiResponse.error(res, 400, "Invalid thumbnail id.");
  }

  const thumbnailId = new mongoose.Types.ObjectId(id as string);

  const isLikeable = await thumbnailModel.exists({
    _id: thumbnailId,
    published: true,
    deletedAt: null,
  });

  if (!isLikeable) {
    return ApiResponse.error(res, 404, "Thumbnail not found.");
  }

  const existingLike = await likeDislikeModel.exists({ userId, thumbnailId });

  // Only the request that actually removes or adds the like record changes the count, so
  // parallel clicks can't move it twice.
  if (existingLike) {
    const { deletedCount } = await likeDislikeModel.deleteOne({ _id: existingLike._id });
    if (deletedCount === 1) {
      await thumbnailModel.updateOne(
        { _id: thumbnailId, likesCount: mongoose.trusted({ $gt: 0 }) },
        { $inc: { likesCount: -1 } },
      );
    }

    return ApiResponse.success(res, 200, "Thumbnail unliked successfully.", {
      isLiked: false,
    });
  }

  // An upsert on the unique { userId, thumbnailId } index turns a parallel like into a match
  // instead of a duplicate-key error.
  const { upsertedCount } = await likeDislikeModel.updateOne(
    { userId, thumbnailId },
    { $setOnInsert: { userId, thumbnailId } },
    { upsert: true },
  );
  if (upsertedCount === 1) {
    await thumbnailModel.updateOne({ _id: thumbnailId }, { $inc: { likesCount: 1 } });
  }

  return ApiResponse.success(res, 200, "Thumbnail liked successfully.", {
    isLiked: true,
  });
};

/**
 * PATCH /thumbnails/:id/publish
 * Publish or unpublish a thumbnail to the community feed.
 */
const publishThumbnailToCommunity = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return ApiResponse.error(res, 400, "Invalid thumbnail id.");
  }
  const { published } = req.validated!.body;

  const thumbnail = await thumbnailModel.findOneAndUpdate(
    {
      _id: id,
      userId,
      deletedAt: null,
      // Only a finished image can go public; unpublishing is always allowed.
      ...(published && {
        isGenerating: mongoose.trusted({ $ne: true }),
        "thumbnail.url": mongoose.trusted({ $nin: [null, ""] }),
      }),
    },
    // publishedAt keeps the first publish date through unpublishing, so republishing an old
    // thumbnail can't restart its age in the trending score.
    [{ $set: { published, publishedAt: published ? { $ifNull: ["$publishedAt", "$$NOW"] } : "$publishedAt" } }],
    { returnDocument: "after", updatePipeline: true },
  );

  if (!thumbnail) {
    return ApiResponse.error(res, 404, "Thumbnail not found.");
  }

  return ApiResponse.success(
    res,
    200,
    published
      ? "Thumbnail published successfully."
      : "Thumbnail unpublished successfully.",
    thumbnail
  );
};


export {
  generateGminiThumbnail,
  getMyThumbnails,
  getCommunityThumbnails,
  getThumbnailById,
  getThumbnailSharePage,
  getRecycleBinThumbnails,
  softDeleteThumbnail,
  restoreThumbnail,
  permanentDeleteThumbnail,
  emptyRecycleBin,
  restoreAllThumbnails,
  improvePrompt,
  likeDislikeThumbnail,
  publishThumbnailToCommunity,
};
