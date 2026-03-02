import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import fs from "fs";
import path from "path";

const MODEL_ID = "gemini-3.1-flash-image-preview";
const SPRITE_MODEL_ID = "gemini-3.1-flash-image-preview";

let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
  }
  return _ai;
}

function extractImageBase64(response: GenerateContentResponse): string | null {
  if (!response.candidates?.[0]?.content?.parts) return null;
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData?.data) {
      return part.inlineData.data;
    }
  }
  return null;
}

export interface GeminiResult<T> {
  data: T;
  tokens: number;
}

export async function generateImage(prompt: string): Promise<GeminiResult<string>> {
  const response = await getAI().models.generateContent({
    model: MODEL_ID,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "1:1" },
    },
  });

  const base64 = extractImageBase64(response);
  if (!base64) throw new Error("No image generated");

  return {
    data: base64,
    tokens: response.usageMetadata?.totalTokenCount || 0
  };
}

export async function editImage(
  prompt: string,
  imageBase64: string
): Promise<GeminiResult<string>> {
  const response = await getAI().models.generateContent({
    model: MODEL_ID,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/png", data: imageBase64 } },
        ],
      },
    ],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "1:1" },
    },
  });

  const base64 = extractImageBase64(response);
  if (!base64) throw new Error("No image generated");

  return {
    data: base64,
    tokens: response.usageMetadata?.totalTokenCount || 0
  };
}

export async function analyzeImage(imageBase64: string): Promise<GeminiResult<string>> {
  const response = await getAI().models.generateContent({
    model: MODEL_ID,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Describe this image in detail in 2-3 sentences. Focus on: what the subject is, its key visual features (colors, shape, distinguishing traits), and its pose or expression. Be specific — this description will be used to recreate the subject as a mascot character.",
          },
          { inlineData: { mimeType: "image/png", data: imageBase64 } },
        ],
      },
    ],
    config: {
      responseModalities: ["TEXT"],
    },
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Failed to analyze image");

  return {
    data: text.trim(),
    tokens: response.usageMetadata?.totalTokenCount || 0
  };
}

export async function stylizeImage(
  prompt: string,
  imageBase64: string,
  analysis?: string
): Promise<GeminiResult<string>> {
  const analysisContext = analysis
    ? `The image contains: ${analysis}. Use these details to preserve the subject's identity.`
    : "";
  const fullPrompt = `Transform this image into a cute mascot character in a cartoon/chibi style. ${analysisContext} ${prompt}. Keep the character recognizable but make it adorable and suitable as a mascot. The background must be plain white with no patterns, objects, or shadows.`;
  return editImage(fullPrompt, imageBase64);
}

export async function generateSpriteSheet(
  mascotImageBase64: string,
  action: string,
  description?: string
): Promise<GeminiResult<string>> {
  const gridImagePath = path.join(process.cwd(), "public", "grid_3x3_1024.png");
  const gridImageBase64 = fs.readFileSync(gridImagePath).toString("base64");

  const characterContext = description
    ? `This character is: ${description}. `
    : "";
  const prompt = `${characterContext}Sprite sheet of this character ${action}, 3x3 grid, plain white background with no patterns or objects, sequence, frame by frame animation, square aspect ratio. Follow the structure of the attached reference image exactly.`;

  const response = await getAI().models.generateContent({
    model: SPRITE_MODEL_ID,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/png", data: mascotImageBase64 } },
          { inlineData: { mimeType: "image/png", data: gridImageBase64 } },
        ],
      },
    ],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "1:1" },
    },
  });

  const base64 = extractImageBase64(response);
  if (!base64) throw new Error("No sprite sheet generated");

  return {
    data: base64,
    tokens: response.usageMetadata?.totalTokenCount || 0
  };
}
