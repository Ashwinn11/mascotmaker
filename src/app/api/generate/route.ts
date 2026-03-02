import { NextResponse } from "next/server";
import { generateImage } from "@/lib/gemini";
import { saveImage } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const mascotPrompt = `Create a cute, expressive mascot character: ${prompt}. Cartoon style, clean white background, full body, vibrant colors.`;
    const base64 = await generateImage(mascotPrompt);
    const imageUrl = saveImage(base64);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate mascot" },
      { status: 500 }
    );
  }
}
