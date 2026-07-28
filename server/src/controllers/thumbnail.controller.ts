import { Request, Response } from "express";
import { verifyAccessToken } from "../helper/token-helpers.js";
import thumbnailModel from "../models/thumbnail.model.js";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import {
  colorSchemeDescriptions,
  stylePrompts,
} from "../constants/constants.js";
import genai from "../config/genai.js";
import { ApiResponse } from "../utils/apiResponse.js";
import hfai from "../config/hf.js";
import path from "path";
import fsPromises from "fs/promises";
import uploadFileOnCloudniary, { removeLocalFile } from "../utils/cloudniary.js";
import { UploadErrorCode } from "../constants/enums.js";

const resolveUserId = (req: Request) =>
  req.user?.userId ?? (req.user as { _id?: string } | undefined)?._id;

// Additional imports needed at the top of the file (add if not already present):
// import { promises as fsPromises } from "fs";
// import crypto from "node:crypto";

const generateGminiThumbnail = async (req: Request, res: Response) => {
  let thumbnailId: string | null = null;
  let referenceImagePath: string | null = null;
  let outputFilePath: string | null = null;

  try {
    const userId = resolveUserId(req);

    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    // req.body is already validated/shaped by the Zod middleware,
    // req.file (if present) already validated by multer (type + size).
    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    // ---- Reference image: only touch it if the user actually uploaded one ----
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

    // Only include the image part in `contents` when one was actually uploaded
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
    // Log full detail server-side only — never send the raw error/stack to the client
    console.error(error);

    if (thumbnailId) {
      await thumbnailModel.findByIdAndUpdate(thumbnailId, {
        isGenerating: false,
      });
    }

    return ApiResponse.error(res, 500, "Something went wrong. Please try again later.");
  } finally {
    // Always clean up temp files, success or failure, to avoid unbounded disk usage
    if (referenceImagePath) {
      await removeLocalFile(referenceImagePath);
    }
    if (outputFilePath) {
      await fsPromises.unlink(outputFilePath).catch(() => { });
    }
  }
};

const getMyThumbnails = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);

    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const deletedOnly = req.query.deleted === "true";

    const thumbnails = await thumbnailModel
      .find({
        userId,
        deletedAt: deletedOnly ? { $ne: null } : null,
      })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName avatar")
      .lean();

    return ApiResponse.success(res, 200, "Thumbnails fetched.", {
      thumbnails,
      total: thumbnails.length,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong from catch block.", error);
  }
};

const softDeleteThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);

    if (!userId) {
      return ApiResponse.error(res, 401, "Unauthorized.");
    }

    const { id } = req.params;

    const thumbnail = await thumbnailModel.findOne({
      _id: id,
      userId,
      deletedAt: null,
    });

    if (!thumbnail) {
      return ApiResponse.error(res, 404, "Thumbnail not found.");
    }

    thumbnail.deletedAt = new Date();
    await thumbnail.save();

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

const generateHFThumbnail = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    const { userId } = verifyAccessToken(accessToken as string) as {
      userId?: string;
    };

    const {
      title,
      prompt: userPrompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    const thumbnail = await thumbnailModel.create({
      userId,
      prompt_used: userPrompt,
      style,
      title,
      aspect_ratio,
      text_overlay,
      color_scheme,
      isGenerating: true,
    });

    let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]} thumbnail for "${title}".`;

    if (color_scheme) {
      prompt += ` Use ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} colors.`;
    }

    if (userPrompt) {
      prompt += ` ${userPrompt}`;
    }

    prompt += `
Professional YouTube thumbnail.
Ultra detailed.
High CTR.
4k quality.
Sharp focus.
No watermark.
No logo.
No border.
`;

    const image = await hfai().textToImage({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
    });

    const arrayBuffer = await (image as unknown as Blob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${thumbnail._id}.png`;
    const outputPath = path.join(process.cwd(), "uploads", fileName);

    fs.writeFileSync(outputPath, buffer);

    return ApiResponse.success(
      res,
      200,
      "Thumbnail generated successfully.",
      image,
    );
  } catch (error) {
    console.error(error);

    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

export {
  generateGminiThumbnail,
  generateHFThumbnail,
  getMyThumbnails,
  softDeleteThumbnail,
};
