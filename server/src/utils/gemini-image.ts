import { ApiError, FinishReason, type GenerateContentParameters, type GenerateContentResponse } from "@google/genai";
import genai from "../config/genai.js";
import { GenerationErrorCode } from "../constants/enums.js";
import { GEMINI_MAX_ATTEMPTS, GEMINI_RETRY_BASE_DELAY_MS, GEMINI_TIMEOUT_MS } from "../constants/constants.js";

export type ImageGenerationResult =
  | { ok: true; imageBase64: string }
  | { ok: false; code: GenerationErrorCode };

const RETRYABLE_STATUSES = [429, 503];

const SAFETY_FINISH_REASONS = new Set<FinishReason | undefined>([
  FinishReason.SAFETY,
  FinishReason.PROHIBITED_CONTENT,
  FinishReason.BLOCKLIST,
  FinishReason.SPII,
  FinishReason.IMAGE_SAFETY,
  FinishReason.IMAGE_PROHIBITED_CONTENT,
]);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readImage(response: GenerateContentResponse): ImageGenerationResult {
  const candidate = response.candidates?.[0];

  if (response.promptFeedback?.blockReason || SAFETY_FINISH_REASONS.has(candidate?.finishReason)) {
    return { ok: false, code: GenerationErrorCode.Blocked };
  }

  const imageBase64 = candidate?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData?.data;
  return imageBase64 ? { ok: true, imageBase64 } : { ok: false, code: GenerationErrorCode.Failed };
}

// Calls Gemini with a timeout per attempt and retries rate limits and overload with
// exponential backoff (1s, then 2s). Other API errors are logged and reported as a failure.
export async function generateImage(request: GenerateContentParameters): Promise<ImageGenerationResult> {
  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await genai().models.generateContent({
        ...request,
        config: { ...request.config, httpOptions: { timeout: GEMINI_TIMEOUT_MS } },
      });
      return readImage(response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { ok: false, code: GenerationErrorCode.TimedOut };
      }
      if (!(error instanceof ApiError)) {
        throw error;
      }
      if (!RETRYABLE_STATUSES.includes(error.status)) {
        // Gemini's own message can expose setup details such as an invalid API key.
        console.error("Gemini request failed:", error);
        return { ok: false, code: GenerationErrorCode.Failed };
      }
      if (attempt < GEMINI_MAX_ATTEMPTS) {
        await wait(GEMINI_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
      }
    }
  }

  return { ok: false, code: GenerationErrorCode.Busy };
}
