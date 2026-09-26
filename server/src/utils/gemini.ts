import { ApiError, FinishReason, type GenerateContentParameters, type GenerateContentResponse } from "@google/genai";
import genai from "../config/genai.js";
import { GenerationErrorCode } from "../constants/enums.js";
import { GEMINI_MAX_ATTEMPTS, GEMINI_RETRY_BASE_DELAY_MS, GEMINI_TIMEOUT_MS } from "../constants/constants.js";

type GeminiFailure = { ok: false; code: GenerationErrorCode };

export type ImageGenerationResult = { ok: true; imageBase64: string } | GeminiFailure;
export type TextGenerationResult = { ok: true; text: string } | GeminiFailure;

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

const isBlocked = (response: GenerateContentResponse) =>
  Boolean(response.promptFeedback?.blockReason) || SAFETY_FINISH_REASONS.has(response.candidates?.[0]?.finishReason);

function readImage(response: GenerateContentResponse): ImageGenerationResult {
  if (isBlocked(response)) return { ok: false, code: GenerationErrorCode.Blocked };

  const imageBase64 = response.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData?.data;
  return imageBase64 ? { ok: true, imageBase64 } : { ok: false, code: GenerationErrorCode.Failed };
}

function readText(response: GenerateContentResponse): TextGenerationResult {
  if (isBlocked(response)) return { ok: false, code: GenerationErrorCode.Blocked };

  const text = response.text?.trim();
  return text ? { ok: true, text } : { ok: false, code: GenerationErrorCode.Failed };
}

// Calls Gemini with a timeout per attempt and retries rate limits, overload and dropped
// connections with exponential backoff (1s, then 2s). Other API errors are logged and
// reported as a failure.
async function callGemini<T extends { ok: true }>(request: GenerateContentParameters,read: (response: GenerateContentResponse) => T | GeminiFailure,): Promise<T | GeminiFailure> {
  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await genai().models.generateContent({
        ...request,
        config: { ...request.config, httpOptions: { timeout: GEMINI_TIMEOUT_MS } },
      });
      return read(response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { ok: false, code: GenerationErrorCode.TimedOut };
      }
      if (error instanceof ApiError) {
        if (!RETRYABLE_STATUSES.includes(error.status)) {
          // Gemini's own message can expose setup details such as an invalid API key.
          console.error("Gemini request failed:", error);
          return { ok: false, code: GenerationErrorCode.Failed };
        }
      } else if (error instanceof TypeError && error.message === "fetch failed") {
        // Node's fetch throws this when the connection drops (ECONNRESET, DNS, TLS) before
        // Gemini sends any status, so it is retried like an overloaded server.
        console.warn(`Gemini connection failed (attempt ${attempt}/${GEMINI_MAX_ATTEMPTS}):`, error.cause ?? error);
      } else {
        throw error;
      }
      if (attempt < GEMINI_MAX_ATTEMPTS) {
        await wait(GEMINI_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
      }
    }
  }

  return { ok: false, code: GenerationErrorCode.Busy };
}

export const generateImage = (request: GenerateContentParameters) => callGemini(request, readImage);

export const generateText = (request: GenerateContentParameters) => callGemini(request, readText);
