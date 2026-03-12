import { NextResponse } from "next/server";
import { generateImage, analyzeImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";
import { buildPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      aspectRatio,
      imageSize,
      style,
      subjectType = "Character",
      studioMode = "Single",
      removeBackground: shouldRemoveBackground = false,
    } = body;
    const options = { aspectRatio, imageSize, style, subjectType, studioMode };

    // Auth + credit check
    const check = await requireCredits("generate", options);
    if (check instanceof Response) return check;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt must be under 2000 characters" }, { status: 400 });
    }

    const basePrompt = buildPrompt(subjectType, style, prompt, false);
    const result = await generateImage(basePrompt, options);
    let images = result.data;

    // Analyze original for identity
    const analysisResult = await analyzeImage(images[0]);
    const analysis = analysisResult.data;

    // AI Background Removal
    if (shouldRemoveBackground) {
      const { removeBackground } = await import("@/lib/background-removal");
      images = await Promise.all(
        images.map(async (img) => {
          const buffer = Buffer.from(img, "base64");
          const transparentBuffer = await removeBackground(buffer);
          return transparentBuffer.toString("base64");
        })
      );
    }

    const creditsRemaining = await deductCredits(check.userId, "generate", options);

    return NextResponse.json({
      imageBase64: images[0],
      images,
      analysis,
      creditsRemaining
    });
  } catch (error: any) {
    console.error("Generate error:", error);
    if (error.message?.includes("SAFETY_BLOCK")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to generate mascot" },
      { status: 500 }
    );
  }
}
