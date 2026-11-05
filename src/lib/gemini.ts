import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const FALLBACK_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

export async function generateWithFallback(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured in your environment variables.");
  }

  let lastError: any = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      if (text) {
        return text;
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} failed, trying next fallback:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "All Gemini models are currently unavailable. Please try again shortly.");
}
