import { NextResponse } from "next/server";
import { generateImage } from "@/lib/gemini";
import { saveImage } from "@/lib/storage";
import { removeWhiteBackground } from "@/lib/image";
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

    const mascotPrompt = `Create a cute, expressive mascot character: ${prompt}. Cartoon style, transparent background, full body, vibrant colors. The background must be plain white with no patterns, objects, or shadows.`;
    const result = await generateImage(mascotPrompt);
    const base64 = await removeWhiteBackground(result.data);
    const imageUrl = await saveImage(base64);

    // Deduct credits after success based on tokens
    const creditsRemaining = deductCredits(check.userId, "generate");

    return NextResponse.json({ imageUrl, creditsRemaining });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate mascot" },
      { status: 500 }
    );
  }
}
