import { NextResponse } from "next/server";
import { editImage } from "@/lib/gemini";
import { saveImage, loadImageAsBase64 } from "@/lib/storage";
import { removeWhiteBackground } from "@/lib/image";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    // Auth + credit check
    const check = await requireCredits("chat");
    if (check instanceof Response) return check;

    const { message, mascotImageUrl } = await req.json();
    if (!message || typeof message !== "string" || !mascotImageUrl) {
      return NextResponse.json(
        { error: "Message and mascotImageUrl are required" },
        { status: 400 }
      );
    }
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message must be under 2000 characters" },
        { status: 400 }
      );
    }

    const imageBase64 = await loadImageAsBase64(mascotImageUrl);
    const prompt = `Modify this mascot character: ${message}. Keep the same art style and character identity. The background must be plain white with no patterns, objects, or shadows.`;
    const result = await editImage(prompt, imageBase64);
    const resultBase64 = await removeWhiteBackground(result.data);
    const imageUrl = await saveImage(resultBase64);

    const creditsRemaining = deductCredits(check.userId, "chat");

    return NextResponse.json({ imageUrl, creditsRemaining });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to refine mascot" },
      { status: 500 }
    );
  }
}
