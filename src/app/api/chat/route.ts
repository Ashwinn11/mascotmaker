import { NextResponse } from "next/server";
import { editImage } from "@/lib/gemini";
import { saveImage, loadImageAsBase64 } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const { message, mascotImageUrl } = await req.json();
    if (!message || !mascotImageUrl) {
      return NextResponse.json(
        { error: "Message and mascotImageUrl are required" },
        { status: 400 }
      );
    }

    const imageBase64 = loadImageAsBase64(mascotImageUrl);
    const prompt = `Modify this mascot character: ${message}. Keep the same art style and character identity. Clean white background.`;
    const resultBase64 = await editImage(prompt, imageBase64);
    const imageUrl = saveImage(resultBase64);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to refine mascot" },
      { status: 500 }
    );
  }
}
