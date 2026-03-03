import { NextResponse } from "next/server";
import { generateImage } from "@/lib/gemini";
import { removeGreenBackground } from "@/lib/image";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    // Auth + credit check
    const check = await requireCredits("generate");
    if (check instanceof Response) return check;

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt must be under 2000 characters" }, { status: 400 });
    }

    const mascotPrompt = `Create a cute, expressive mascot character: ${prompt}. Cartoon style, transparent background, vibrant colors. IMPORTANT: Show the COMPLETE full body from head to feet/bottom — do NOT crop or cut off any part of the character. The entire character must be visible including legs, feet, and any bottom details. The background must be solid bright green (#00FF00) with no patterns, objects, or shadows.`;
    const result = await generateImage(mascotPrompt);
    const imageBase64 = await removeGreenBackground(result.data);

    // Deduct credits after success based on tokens
    const creditsRemaining = await deductCredits(check.userId, "generate");

    return NextResponse.json({ imageBase64, creditsRemaining });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate mascot" },
      { status: 500 }
    );
  }
}
