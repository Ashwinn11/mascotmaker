import { NextResponse } from "next/server";
import { analyzeImage, stylizeImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const prompt = (formData.get("prompt") as string) || "";
    const aspectRatio = (formData.get("aspectRatio") as string) || "1:1";
    const imageSize = (formData.get("imageSize") as "512px" | "1K" | "2K" | "4K") || "1K";
    const thinkingLevel = (formData.get("thinkingLevel") as "Minimal" | "High") || "Minimal";
    const useSearch = formData.get("useSearch") === "true";
    const options = { aspectRatio, imageSize, thinkingLevel, useSearch };

    // Auth + credit check
    const check = await requireCredits("stylize", options);
    if (check instanceof Response) return check;

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only PNG, JPG, WebP, and GIF images are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    // Analyze the image first for better consistency
    const analysisResult = await analyzeImage(base64);
    const analysis = analysisResult.data;

    const stylizeResult = await stylizeImage(prompt, base64, analysis, options);
    const imageBase64 = stylizeResult.data;

    const creditsRemaining = await deductCredits(check.userId, "stylize", options);

    return NextResponse.json({ imageBase64, analysis, creditsRemaining });
  } catch (error) {
    console.error("Stylize error:", error);
    return NextResponse.json(
      { error: "Failed to stylize image" },
      { status: 500 }
    );
  }
}
