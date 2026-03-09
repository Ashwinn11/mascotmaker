import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import fs from "fs";
import path from "path";

const MODEL_ID = "gemini-3.1-flash-image-preview";
let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
  }
  return _ai;
}

function extractImageBase64(response: GenerateContentResponse): string | null {
  const images = extractImagesBase64(response);
  return images.length > 0 ? images[0] : null;
}

function extractImagesBase64(response: GenerateContentResponse): string[] {
  if (!response.candidates?.[0]?.content?.parts) return [];
  return response.candidates[0].content.parts
    .filter(part => part.inlineData?.data)
    .map(part => part.inlineData!.data!);
}

export interface GeminiResult<T> {
  data: T;
  tokens: number;
}

export interface ImageOptions {
  aspectRatio?: string;
  imageSize?: "1K";
  style?: string;
  subjectType?: "Character" | "Sticker" | "Logo";
}

export async function generateImage(prompt: string, options: ImageOptions = {}): Promise<GeminiResult<string[]>> {
  const response = await getAI().models.generateContent({
    model: MODEL_ID,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: options.aspectRatio || "1:1",
        imageSize: options.imageSize || "1K",
      },
      maxOutputTokens: 8192,
    } as any,
  });

  const images = extractImagesBase64(response);
  if (images.length === 0) throw new Error("No image generated");

  return {
    data: images,
    tokens: response.usageMetadata?.totalTokenCount || 0,
  };
}

export async function editImage(
  prompt: string,
  imageBase64: string,
  options: ImageOptions = {}
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
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: options.aspectRatio || "1:1",
        imageSize: options.imageSize || "1K",
      },
      maxOutputTokens: 8192,
    } as any,
  });

  const base64 = extractImageBase64(response);
  if (!base64) throw new Error("No image generated");

  return {
    data: base64,
    tokens: response.usageMetadata?.totalTokenCount || 0,
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
  analysis?: string,
  options: ImageOptions = {}
): Promise<GeminiResult<string>> {
  const analysisContext = analysis
    ? `The image contains: ${analysis}. Use these details to preserve the subject's identity.`
    : "";
  const characterStyle = options.style || "cute mascot character in a cartoon/chibi style, vibrant colors";
  let fullPrompt = "";

  if (options.subjectType === "Character") {
    fullPrompt = `Transform this image into a ${characterStyle}. ${analysisContext} ${prompt}. Keep the subject recognizable. IMPORTANT: Isolated on a plain white background. Show the COMPLETE full body from head to feet/bottom — do NOT crop or cut off any part of the character.`;
  } else if (options.subjectType === "Sticker") {
    fullPrompt = `Transform this image into a single sticker in the distinct ${characterStyle} style: ${prompt}. ${analysisContext} Bold, thick black outlines. Flat color palette. Clean white border around the subject. Isolated on a plain white background.`;
  } else {
    // Logo or default
    fullPrompt = `Transform this image into a ${characterStyle} logo: ${prompt}. ${analysisContext} Minimalist vector style, clean lines, isolated on a plain white background.`;
  }

  return editImage(fullPrompt, imageBase64, options);
}

export async function generateSpriteSheet(
  mascotImageBase64: string,
  action: string,
  description?: string
): Promise<GeminiResult<string>> {
  const gridImagePath = path.join(process.cwd(), "public", "grid_3x3_1024_white.png");
  const gridImageBase64 = fs.readFileSync(gridImagePath).toString("base64");

  const characterContext = description
    ? `This character is: ${description}. `
    : "";
  const prompt = `${characterContext}Sprite sheet of this character ${action}, sequence, frame by frame animation, exactly 3 rows and 3 columns on a pure, continuous plain white background. IMPORTANT: Do NOT draw any separator lines, boxes, borders, or grid patterns between the frames. The background must be completely blank. Each frame must show the full body from head to feet.`;

  const response = await getAI().models.generateContent({
    model: MODEL_ID,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/png", data: mascotImageBase64 } },
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
