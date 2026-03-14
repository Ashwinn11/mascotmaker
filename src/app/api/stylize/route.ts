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
    const imageSize = (formData.get("imageSize") as "1K" | "2K" | "4K") || "1K";
    const style = (formData.get("style") as string) || "";
    const subjectType = (formData.get("subjectType") as "Character" | "Sticker" | "Logo") || "Character";
    const removeBackgroundFlag = formData.get("removeBackground") === "true";
    const options = { aspectRatio, imageSize, style, subjectType };

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
    let outBase64 = stylizeResult.data;

    if (removeBackgroundFlag) {
      const { removeBackground } = await import("@/lib/background-removal");
      const outBuffer = Buffer.from(outBase64, "base64");
      const transparentBuffer = await removeBackground(outBuffer);
      outBase64 = transparentBuffer.toString("base64");
    }

    const creditsRemaining = await deductCredits(check.userId, "stylize", options);

    return NextResponse.json({ imageBase64: outBase64, analysis, creditsRemaining });
  } catch (error) {
    console.error("Stylize error:", error);
    return NextResponse.json(
      { error: "Failed to stylize image" },
      { status: 500 }
    );
  }
}
