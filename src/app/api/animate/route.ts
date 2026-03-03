import { NextResponse } from "next/server";
import { generateSpriteSheet } from "@/lib/gemini";
import { spriteSheetToWebp } from "@/lib/sprite-to-webp";
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

    const spriteBuffer = Buffer.from(result.data, "base64");
    const animationBuffer = await spriteSheetToWebp(spriteBuffer);
    const animationBase64 = animationBuffer.toString("base64");

    const creditsRemaining = await deductCredits(check.userId, "animate");

    return NextResponse.json({
      spriteBase64: result.data,
      animationBase64,
      creditsRemaining,
    });
  } catch (error) {
    console.error("Animate error:", error);
    return NextResponse.json(
      { error: "Failed to generate animation" },
      { status: 500 }
    );
  }
}
