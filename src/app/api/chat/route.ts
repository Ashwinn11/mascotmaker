import { NextResponse } from "next/server";
import { editImage, analyzeImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, mascotBase64, analysis: previousAnalysis, aspectRatio, imageSize, thinkingLevel, useSearch } = body;
    const options = { aspectRatio, imageSize, thinkingLevel, useSearch };

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

    const analysisContext = previousAnalysis
      ? `The current mascot is: ${previousAnalysis}. `
      : "";

    const prompt = `Modify this mascot character: ${message}. ${analysisContext}Keep the same art style and character identity. IMPORTANT: Isolated on a plain white background. Show the COMPLETE full body from head to feet/bottom — do NOT crop or cut off any part of the character.`;
    const result = await editImage(prompt, mascotBase64, options);
    const imageBase64 = result.data;

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
