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
    fullPrompt = `Transform this image into a ${characterStyle}. ${analysisContext} ${prompt}. Keep the subject recognizable. IMPORTANT: Isolated on a SOLID, uniform Dark Charcoal Grey (#404040) background with no shadows or texture. Show the COMPLETE full body from head to feet/bottom — do NOT crop or cut off any part of the character.`;
  } else if (options.subjectType === "Sticker") {
    fullPrompt = `Transform this image into a single high-quality die-cut sticker: ${prompt}. ${analysisContext} ${characterStyle}. Bold, thick black outlines. Clean, wide white border around the entire subject. Vibrant colors. Isolated on a SOLID, uniform Dark Charcoal Grey (#404040) background. NO shadows, NO gradients on the background.`;
  } else {
    // Logo
    fullPrompt = `Transform this image into a professional branding logo in a ${characterStyle} style: ${prompt}. ${analysisContext} Clean vector lines, flat design, simplistic geometric shapes. Professional brand identity style. Isolated on a SOLID background. NO mascot characters or complex cartoons unless specifically requested — focus on symbolic representation.`;
  }

  return editImage(fullPrompt, imageBase64, options);
}

export async function generateSpriteSheet(
  mascotImageBase64: string,
  action: string,
  description?: string
): Promise<GeminiResult<string>> {
  const gridImagePath = path.join(process.cwd(), "public", "grid_3x3_1024_grey.png");
  const gridImageBase64 = fs.readFileSync(gridImagePath).toString("base64");

  const characterContext = description
    ? `This character is: ${description}. `
    : "";
  const prompt = `REFERENCE IMAGES: (1) Target character, (2) Dark Charcoal Grey template (#404040).

PROMPT: Using the EXACT character from (1), create a 9-frame 3x3 sprite sheet on the SOLID, uniform Dark Charcoal Grey (#404040) background shown in (2). 

CRITICAL INSTRUCTIONS:
- PRESERVE IDENTITY: Reference (1) is the EXCLUSIVE and ONLY source for the character design. Every pixel of the character's design, face, and clothing must match (1).
- ACTION ONLY: Only change the pose/action for ${action}. Do NOT add any new traits, accessories, or features.
- STYLE MATCH: Use the identical art style and color palette as (1).
- ROWS/COLS: Exactly 3 rows and 3 columns. Each frame must show the full body from head to feet.
- BACKGROUND: Background MUST remain the continuous Dark Charcoal Grey from (2) with NO grid lines, borders, shadows, or texture between frames.
${characterContext} Character is ${action}, sequence animation.`;

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
      imageConfig: { aspectRatio: "1:1" },
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
