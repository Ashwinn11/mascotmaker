import { NextResponse } from "next/server";
import { generateSpriteSheet } from "@/lib/gemini";
import { saveImage, saveBuffer, loadImageAsBase64 } from "@/lib/storage";
import { spriteSheetToGif } from "@/lib/sprite-to-gif";

export async function POST(req: Request) {
  try {
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

    const mascotBase64 = loadImageAsBase64(mascotImageUrl);
    const spriteBase64 = await generateSpriteSheet(mascotBase64, action, description);

    const spriteUrl = saveImage(spriteBase64);
    const spriteBuffer = Buffer.from(spriteBase64, "base64");
    const gifBuffer = await spriteSheetToGif(spriteBuffer);
    const gifUrl = saveBuffer(gifBuffer, "gif");

    return NextResponse.json({ spriteUrl, gifUrl });
  } catch (error) {
    console.error("Animate error:", error);
    return NextResponse.json(
      { error: "Failed to generate animation" },
      { status: 500 }
    );
  }
}
