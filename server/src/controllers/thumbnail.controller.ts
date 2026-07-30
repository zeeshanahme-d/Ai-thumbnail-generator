import { Request, Response } from "express";
import path from "path";
import fsPromises from "fs/promises";
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory, } from "@google/genai";
import genai from "../config/genai.js";
import { colorSchemeDescriptions, stylePrompts, } from "../constants/constants.js";
import thumbnailModel from "../models/thumbnail.model.js";
import likeDislikeModel from "../models/likeDislik.modal.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { UploadErrorCode } from "../constants/enums.js";
import uploadFileOnCloudniary, { removeLocalFile, deleteFileFromCloudinary } from "../utils/cloudniary.js";
import { getPaginationParams, formatPaginatedResponse } from "../utils/pagination.js";

const resolveUserId = (req: Request): string | undefined => {
  return req.user?.userId ?? (req.user as { _id?: string } | undefined)?._id;
};

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
  let thumbnailId: string | null = null;
  let referenceImagePath: string | null = null;
  let outputFilePath: string | null = null;

  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay, } = req.body;

    const referenceImage = req.file;
    let referenceImagePart: { inlineData: { mimeType: string; data: string } } | null = null;

    if (referenceImage) {
      referenceImagePath = referenceImage.path;
      const referenceImageBuffer = await fsPromises.readFile(referenceImage.path);
      referenceImagePart = {
        inlineData: {
          mimeType: referenceImage.mimetype,
          data: referenceImageBuffer.toString("base64"),
        },
      };
    }

    const thumbnail = await thumbnailModel.create({
      userId,
      user_prompt: user_prompt ?? "",
      prompt_used: user_prompt ?? "",
      style,
      title,
      aspect_ratio,
      text_overlay,
      color_scheme,
      isGenerating: true,
    });
    thumbnailId = thumbnail._id.toString();

    const model = "gemini-3.1-flash-lite-image";
    const generateConfig: GenerateContentConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 0.95,
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: aspect_ratio || "16:9",
        imageSize: "1k",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF,
        },
      ],
    };

    let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]} for: ${title}`;
    if (color_scheme) {
      prompt += ` Use a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} color scheme`;
    }
    if (user_prompt) {
      prompt += ` Additional details: ${user_prompt}`;
    }
    if (referenceImagePart) {
      prompt += ` Use the attached reference image as visual guidance for style and composition.`;
    }
    prompt += ` The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it professional and impossible to ignore.`;

    const contents = referenceImagePart ? [prompt, referenceImagePart] : [prompt];

    const aiResponse = await genai()?.models.generateContent({
      model,
      contents,
      config: generateConfig,
    });

    const parts = aiResponse?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((part) => part.inlineData);

    if (!imagePart?.inlineData?.data) {
      thumbnail.isGenerating = false;
      await thumbnail.save();
      return ApiResponse.error(
        res,
        502,
        "Image generation failed. Please try again.",
        "GENERATION_FAILED",
      );
    }

    const imageBuffer = Buffer.from(
      imagePart.inlineData.data as string,
      "base64",
    );
    const fileName = `thumbnail-output-${Date.now()}-${crypto.randomUUID()}.png`;
    const uploadDir = path.join("public/temp/uploads");
    outputFilePath = path.join(uploadDir, fileName);
    await fsPromises.writeFile(outputFilePath, imageBuffer);

    const finalResult = await uploadFileOnCloudniary(outputFilePath);
    if (!finalResult) {
      thumbnail.isGenerating = false;
      await thumbnail.save();
      return ApiResponse.error(
        res,
        502,
        "Image upload failed. Please try again.",
        UploadErrorCode.UploadFailed,
      );
    }

    thumbnail.thumbnail = {
      url: finalResult.secure_url,
      publicId: finalResult.public_id,
      originalName: finalResult.original_filename,
      directory: finalResult.asset_folder,
      format: finalResult.format,
      bytes: finalResult.bytes,
    };
    thumbnail.prompt_used = prompt;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    return ApiResponse.success(
      res,
      201,
      "Thumbnail generated successfully.",
      thumbnail,
    );
  } catch (error) {
    console.error(error);
    if (thumbnailId) {
      await thumbnailModel.findByIdAndUpdate(thumbnailId, {
        isGenerating: false,
      });
    }
    return ApiResponse.error(res, 500, "Something went wrong. Please try again later.");
  } finally {
    if (referenceImagePath) {
      await removeLocalFile(referenceImagePath);
    }
    if (outputFilePath) {
      await fsPromises.unlink(outputFilePath).catch(() => { });
    }
  }
};

/**
 * GET /thumbnails
 * Fetch active thumbnails owned by the currently authenticated user.
 */
const getMyThumbnails = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const { page, limit, skip } = getPaginationParams(req);

    const query = {
      userId,
      deletedAt: null,
    };

    const [rawThumbnails, total, likedSet] = await Promise.all([
      thumbnailModel
        .find(query)
        .sort({ createdAt: -1 })
        .populate("userId", "fullName avatar")
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
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

/**
 * GET /thumbnails/community
 * Fetch all published community thumbnails (available publicly or for logged-in user).
 */
const getCommunityThumbnails = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const { page, limit, skip } = getPaginationParams(req);

    const query = {
      published: true,
      deletedAt: null,
    };

    const [rawThumbnails, total, likedSet] = await Promise.all([
      thumbnailModel
        .find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .populate("userId", "fullName avatar")
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
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

/**
 * GET /thumbnails/recycle-bin
 * Fetch soft-deleted thumbnails owned by the currently authenticated user.
 */
const getRecycleBinThumbnails = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const { page, limit, skip } = getPaginationParams(req);

    const query = {
      userId,
      deletedAt: { $ne: null },
    };

    const [rawThumbnails, total] = await Promise.all([
      thumbnailModel
        .find(query)
        .sort({ deletedAt: -1 })
        .populate("userId", "fullName avatar")
        .lean()
        .skip(skip)
        .limit(limit),
      thumbnailModel.countDocuments(query),
    ]);

    const paginatedData = formatPaginatedResponse(rawThumbnails, total, page, limit);

    return ApiResponse.success(res, 200, "Recycle bin thumbnails fetched.", paginatedData);
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

/**
 * DELETE /thumbnails/:id
 * Soft delete a thumbnail by setting deletedAt to current timestamp.
 */
const softDeleteThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const { id } = req.params;

    const thumbnail = await thumbnailModel.findOneAndUpdate(
      {
        _id: id,
        userId,
        deletedAt: null,
      },
      {
        $set: { deletedAt: new Date() },
      },
      { new: true }
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
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

/**
 * PATCH /thumbnails/:id/restore
 * Restore a soft-deleted thumbnail.
 */
const restoreThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const { id } = req.params;

    const thumbnail = await thumbnailModel.findOneAndUpdate(
      {
        _id: id,
        userId,
        deletedAt: { $ne: null },
      },
      {
        $set: { deletedAt: null },
      },
      { new: true }
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
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

/**
 * DELETE /thumbnails/:id/permanent
 * Permanently delete a thumbnail asset from Cloudinary and database.
 */
const permanentDeleteThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const { id } = req.params;

    const thumbnail = await thumbnailModel.findOne({
      _id: id,
      userId,
      deletedAt: { $ne: null },
    });

    if (!thumbnail) {
      return ApiResponse.error(
        res,
        404,
        "Thumbnail not found in recycle bin.",
      );
    }

    if (thumbnail.thumbnail?.publicId) {
      await deleteFileFromCloudinary(thumbnail.thumbnail.publicId);
    }

    await thumbnailModel.findByIdAndDelete(id);

    return ApiResponse.success(
      res,
      200,
      "Thumbnail permanently deleted.",
    );
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

/**
 * POST /thumbnails/:id/like
 * Toggle like/unlike status for a thumbnail atomically.
 */
const likeDislikeThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const id = req.params.id as string;

    const existingLike = await likeDislikeModel.findOne({
      userId,
      thumbnailId: id,
    });

    if (existingLike) {
      await existingLike.deleteOne();
      await thumbnailModel.findByIdAndUpdate(id, {
        $inc: { likesCount: -1 },
      });
      return ApiResponse.success(
        res,
        200,
        "Thumbnail unliked successfully.",
        { isLiked: false }
      );
    }

    await likeDislikeModel.create({
      userId,
      thumbnailId: id,
    });

    await thumbnailModel.findByIdAndUpdate(id, {
      $inc: { likesCount: 1 },
    });

    return ApiResponse.success(
      res,
      200,
      "Thumbnail liked successfully.",
      { isLiked: true }
    );
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

/**
 * PATCH /thumbnails/:id/publish
 * Publish or unpublish a thumbnail to the community feed.
 */
const publishThumbnailToCommunity = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const { id } = req.params;
    const { published } = req.body;

    const thumbnail = await thumbnailModel.findOneAndUpdate(
      {
        _id: id,
        userId,
        deletedAt: null,
      },
      {
        $set: {
          published,
          publishedAt: published ? new Date() : null,
        },
      },
      {
        new: true,
      }
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
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

export {
  generateGminiThumbnail,
  getMyThumbnails,
  getCommunityThumbnails,
  getRecycleBinThumbnails,
  softDeleteThumbnail,
  restoreThumbnail,
  permanentDeleteThumbnail,
  likeDislikeThumbnail,
  publishThumbnailToCommunity,
};
