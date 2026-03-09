import { NextResponse } from "next/server";
import { generateImage, analyzeImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";

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

    const characterStyle = style || "cute mascot character in a cartoon/chibi style, vibrant colors";
    let basePrompt = "";

    if (subjectType === "Sticker") {
      basePrompt = `Create a single sticker in the distinct ${characterStyle} style for: ${prompt}.
      Bold, thick black outlines. Flat color palette.
      Clean white border around the subject. Isolated on a plain white background.`;
    } else if (subjectType === "Character") {
      basePrompt = `Create a ${characterStyle} of: ${prompt}.
      IMPORTANT: Isolated on a plain white background with no shadows.
      Show the COMPLETE full body from head to feet — do NOT crop or cut off any part.
      Expressive face, clean outlines.`;
    } else if (subjectType === "Logo") {
      basePrompt = `Create a professional mascot logo icon in ${characterStyle} for: ${prompt}.
      Isolated on a plain white background.`;
    } else {
      basePrompt = `Create a richly detailed ${characterStyle} scene: ${prompt}.
      Cinematic composition, beautiful lighting.`;
    }

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
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate mascot" },
      { status: 500 }
    );
  }
}
