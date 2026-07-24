import { InferenceClient } from "@huggingface/inference";

let client: InferenceClient | null = null;

const hfai = () => {
  if (!client) {
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
    client = new InferenceClient(apiKey);
  }
  return client;
};

export default hfai;
