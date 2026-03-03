import { NextResponse } from "next/server";
import { generateImage, analyzeImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio, imageSize, thinkingLevel, useSearch } = body;
    const options = { aspectRatio, imageSize, thinkingLevel, useSearch };

    // Auth + credit check
    const check = await requireCredits("generate", options);
    if (check instanceof Response) return check;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt must be under 2000 characters" }, { status: 400 });
    }

    const mascotPrompt = `Create a cute, expressive mascot character: ${prompt}. Cartoon style, vibrant colors. IMPORTANT: Isolated on a plain white background. Show the COMPLETE full body from head to feet/bottom — do NOT crop or cut off any part of the character. The entire character must be visible including legs, feet, and any bottom details.`;
    const result = await generateImage(mascotPrompt, options);
    const imageBase64 = result.data;

    // Analyze the generated mascot for better consistency in refinements/animations
    const analysisResult = await analyzeImage(imageBase64);
    const analysis = analysisResult.data;

    // Deduct credits after success based on tokens
    const creditsRemaining = await deductCredits(check.userId, "generate", options);

    return NextResponse.json({ imageBase64, analysis, creditsRemaining });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate mascot" },
      { status: 500 }
    );
  }
}
