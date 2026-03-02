import { NextResponse } from "next/server";
import { generateSpriteSheet } from "@/lib/gemini";
import { saveImage, saveBuffer, loadImageAsBase64 } from "@/lib/storage";
import { spriteSheetToGif } from "@/lib/sprite-to-gif";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    // Auth + credit check
    const check = await requireCredits("animate");
    if (check instanceof Response) return check;

    const { mascotImageUrl, action, description } = await req.json();
    if (!mascotImageUrl || !action || typeof action !== "string") {
      return NextResponse.json(
        { error: "mascotImageUrl and action are required" },
        { status: 400 }
      );
    }
    if (action.length > 500) {
      return NextResponse.json(
        { error: "Action must be under 500 characters" },
        { status: 400 }
      );
    }

    const mascotBase64 = await loadImageAsBase64(mascotImageUrl);
    const result = await generateSpriteSheet(mascotBase64, action, description);

    const spriteUrl = await saveImage(result.data);
    const spriteBuffer = Buffer.from(result.data, "base64");
    const gifBuffer = await spriteSheetToGif(spriteBuffer);
    const gifUrl = await saveBuffer(gifBuffer, "gif");

    const creditsRemaining = deductCredits(check.userId, "animate", result.tokens);

    return NextResponse.json({ spriteUrl, gifUrl, creditsRemaining });
  } catch (error) {
    console.error("Animate error:", error);
    return NextResponse.json(
      { error: "Failed to generate animation" },
      { status: 500 }
    );
  }
}
