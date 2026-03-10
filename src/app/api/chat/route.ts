import { NextResponse } from "next/server";
import { editImage, analyzeImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      mascotBase64,
      analysis: previousAnalysis,
      aspectRatio,
      imageSize,
      removeBackground: shouldRemoveBackground = false,
    } = body;
    const options = { aspectRatio, imageSize };

    // Auth + credit check
    const check = await requireCredits("chat", options);
    if (check instanceof Response) return check;

    if (!message || typeof message !== "string" || !mascotBase64) {
      return NextResponse.json(
        { error: "Message and mascotBase64 are required" },
        { status: 400 }
      );
    }
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message must be under 2000 characters" },
        { status: 400 }
      );
    }

    // nano-banana best practice: when editing iteratively, always remind the model of
    // the character's key traits AND the original art style to prevent drift.
    const characterContext = previousAnalysis
      ? `This character is: ${previousAnalysis}. Preserve all these traits.`
      : "";

    const prompt = `Apply this change to the mascot: "${message}".
    ${characterContext}
    CRITICAL: Keep the same art style, color palette, and character identity — only apply the requested change.
    Isolated on a SOLID, uniform Dark Charcoal Grey (#404040) background with no shadows or texture. Show the COMPLETE full body from head to feet — do NOT crop any part of the character.`;
    const result = await editImage(prompt, mascotBase64, options);
    let imageBase64 = result.data;

    if (shouldRemoveBackground) {
      const { removeBackground } = await import("@/lib/background-removal");
      const buffer = Buffer.from(imageBase64, "base64");
      const transparentBuffer = await removeBackground(buffer);
      imageBase64 = transparentBuffer.toString("base64");
    }

    // Re-analyze the refined mascot for ongoing consistency
    const analysisResult = await analyzeImage(imageBase64);
    const analysis = analysisResult.data;

    const creditsRemaining = await deductCredits(check.userId, "chat", options);

    return NextResponse.json({ imageBase64, analysis, creditsRemaining });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to refine mascot" },
      { status: 500 }
    );
  }
}
