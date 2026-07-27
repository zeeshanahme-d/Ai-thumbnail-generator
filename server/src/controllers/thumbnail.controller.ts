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
import { assert } from "node:console";
import hfai from "../config/hf.js";
import path from "path";
import fs from "fs";

const generateGminiThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?._id;

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    const thumbnail = await thumbnailModel.create({
      userId: userId,
      prompt_used: user_prompt,
      style,
      title,
      aspect_ratio,
      text_overlay,
      color_scheme,
      isGenerating: true,
    });
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
    prompt += ` The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it professional and imposisible to ignore.`;

    const aiResponse = await genai()?.models.generateContent({
      model,
      contents: [prompt],
      config: generateConfig,
    });

    const parts = aiResponse?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((part) => part.inlineData);
    const imageBuffer = Buffer.from(
      imagePart?.inlineData?.data as string,
      "base64",
    );
    console.log(aiResponse);

    return ApiResponse.success(
      res,
      201,
      "Image is successfuly generated.",
      aiResponse,
    );
  } catch (error) {
    console.log(error);
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
      // provider: "fal-ai",
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
    });

    const arrayBuffer = await image.arrayBuffer();
    console.log(arrayBuffer);

    const buffer = Buffer.from(arrayBuffer);

    console.log(buffer);

    const fileName = `${thumbnail._id}.png`;

    const outputPath = path.join(process.cwd(), "uploads", fileName);

    fs.writeFileSync(outputPath, buffer);

    // thumbnail.isGenerating = false;
    // thumbnail.generatedImage = `/uploads/${fileName}`;

    // await thumbnail.save();

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

export { generateGminiThumbnail, generateHFThumbnail };
