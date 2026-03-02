import { NextResponse } from "next/server";
import { analyzeImage, stylizeImage } from "@/lib/gemini";
import { saveImage } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const prompt = (formData.get("prompt") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const analysis = await analyzeImage(base64);
    const resultBase64 = await stylizeImage(prompt, base64, analysis);
    const imageUrl = saveImage(resultBase64);

    return NextResponse.json({ imageUrl, analysis });
  } catch (error) {
    console.error("Stylize error:", error);
    return NextResponse.json(
      { error: "Failed to stylize image" },
      { status: 500 }
    );
  }
}
