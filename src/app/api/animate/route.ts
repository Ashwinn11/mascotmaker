import { NextResponse } from "next/server";
import { generateSpriteSheet } from "@/lib/gemini";
import { spriteSheetToGif } from "@/lib/sprite-to-gif";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    // Auth + credit check
    const check = await requireCredits("animate");
    if (check instanceof Response) return check;

    const { mascotBase64, action, description, removeBackground: shouldRemoveBackground = false, subjectType = "Character" } = await req.json();
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

    const result = await generateSpriteSheet(mascotBase64, action, description, subjectType, shouldRemoveBackground);
    const spriteDataData = result.data;
    const spriteBuffer = Buffer.from(spriteDataData, "base64");

    // We pass shouldRemoveBackground to spriteSheetToGif which handles it per-frame
    // and returns both a cleaned sprite sheet and a GIF
    const { spriteBuffer: transparentSpriteBuffer, animationBuffer } = await spriteSheetToGif(
      spriteBuffer,
      200,
      shouldRemoveBackground
    );

    const animationBase64 = animationBuffer.toString("base64");
    const transparentSpriteBase64 = transparentSpriteBuffer.toString("base64");

    const creditsRemaining = await deductCredits(check.userId, "animate");

    return NextResponse.json({
      spriteBase64: transparentSpriteBase64,
      animationBase64,
      creditsRemaining,
    });
  } catch (error: any) {
    console.error("Animate error:", error);
    if (error.message?.includes("SAFETY_BLOCK")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to generate animation" },
      { status: 500 }
    );
  }
}
