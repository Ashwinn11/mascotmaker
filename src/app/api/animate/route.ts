import { NextResponse } from "next/server";
import { generateSpriteSheet } from "@/lib/gemini";
import { removeGreenBackground } from "@/lib/image";
import { spriteSheetToGif } from "@/lib/sprite-to-gif";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    // Auth + credit check
    const check = await requireCredits("animate");
    if (check instanceof Response) return check;

    const { mascotBase64, action, description } = await req.json();
    if (!mascotBase64 || !action || typeof action !== "string") {
      return NextResponse.json(
        { error: "mascotBase64 and action are required" },
        { status: 400 }
      );
    }
    if (action.length > 500) {
      return NextResponse.json(
        { error: "Action must be under 500 characters" },
        { status: 400 }
      );
    }

    const result = await generateSpriteSheet(mascotBase64, action, description);

    // Remove green background from sprite sheet before GIF conversion
    const spriteBase64 = await removeGreenBackground(result.data);
    const spriteBuffer = Buffer.from(spriteBase64, "base64");
    const gifBuffer = await spriteSheetToGif(spriteBuffer);
    const gifBase64 = gifBuffer.toString("base64");

    const creditsRemaining = await deductCredits(check.userId, "animate");

    return NextResponse.json({ spriteBase64, gifBase64, creditsRemaining });
  } catch (error) {
    console.error("Animate error:", error);
    return NextResponse.json(
      { error: "Failed to generate animation" },
      { status: 500 }
    );
  }
}
