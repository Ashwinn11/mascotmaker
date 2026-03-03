import { NextResponse } from "next/server";
import { editImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    // Auth + credit check
    const check = await requireCredits("chat");
    if (check instanceof Response) return check;

    const { message, mascotBase64 } = await req.json();
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

    const prompt = `Modify this mascot character: ${message}. Keep the same art style and character identity. IMPORTANT: Show the COMPLETE full body from head to feet/bottom — do NOT crop or cut off any part of the character.`;
    const result = await editImage(prompt, mascotBase64);
    const imageBase64 = result.data;

    const creditsRemaining = await deductCredits(check.userId, "chat");

    return NextResponse.json({ imageBase64, creditsRemaining });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to refine mascot" },
      { status: 500 }
    );
  }
}
