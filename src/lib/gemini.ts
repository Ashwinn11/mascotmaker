import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import fs from "fs";
import path from "path";
import { buildPrompt } from "@/lib/prompts";

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
  if (response.candidates?.[0]?.finishReason === "SAFETY") {
    throw new Error("SAFETY_BLOCK: This prompt was blocked by AI safety filters. Please try a different description.");
  }
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
  if (images.length === 0) {
    if (response.candidates?.[0]?.finishReason === "SAFETY") {
      throw new Error("SAFETY_BLOCK: The AI refused to generate this image due to safety guidelines.");
    }
    throw new Error("No image generated");
  }

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
  const fullPrompt = buildPrompt(options.subjectType || "Character", options.style || "", prompt, true, analysis);
  return editImage(fullPrompt, imageBase64, options);
}

export async function generateSpriteSheet(
  mascotImageBase64: string,
  action: string,
  description?: string,
  subjectType: string = "Character"
): Promise<GeminiResult<string>> {
  const gridImagePath = path.join(process.cwd(), "public", "grid_3x3_1024_grey.png");
  const gridImageBase64 = fs.readFileSync(gridImagePath).toString("base64");

  const characterContext = description
    ? `The subject is: ${description}. `
    : "";
  
  const isSticker = subjectType === "Sticker";
  const stickerStyle = isSticker 
    ? "Clean, wide white die-cut border around the subject in EVERY frame. Bold black outlines. " 
    : "";

  const prompt = `REFERENCE IMAGES: (1) Target subject, (2) Dark Charcoal Grey template (#404040).

PROMPT: Using the EXACT subject from (1), create a 9-frame 3x3 asset sheet on the SOLID, uniform Dark Charcoal Grey (#404040) background shown in (2). 

CRITICAL INSTRUCTIONS:
- PRESERVE IDENTITY: Reference (1) is the EXCLUSIVE and ONLY source for the design. Every pixel of the subject's design, face, and clothing must match (1).
- ACTION/EXPRESSION: Create 9 distinct frames showing the subject with ${action}. Each frame should be a unique variation.
- STYLE MATCH: Use the identical art style and color palette as (1). ${stickerStyle}
- ROWS/COLS: Exactly 3 rows and 3 columns. Each frame must show the full subject.
- BACKGROUND: Background MUST remain the continuous Dark Charcoal Grey from (2) with NO grid lines, borders, shadows, or texture between frames.
${characterContext} Subject is ${action}.`;

  const response = await getAI().models.generateContent({
    model: MODEL_ID,
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
      imageConfig: { aspectRatio: "1:1", imageSize: "2K" },
      temperature: 0.1, // Minimize creativity to maintain character identity
    },
  });

  const base64 = extractImageBase64(response);
  if (!base64) throw new Error("No sprite sheet generated");

  return {
    data: base64,
    tokens: response.usageMetadata?.totalTokenCount || 0
  };
}
