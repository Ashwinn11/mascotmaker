import { NextResponse } from "next/server";
import { generateImage, analyzeImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio, imageSize, thinkingLevel, useSearch, style, subjectType = "Character", studioMode = "Single" } = body;
    const options = { aspectRatio, imageSize, thinkingLevel, useSearch, style, subjectType, studioMode };

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
      // Matches nano-banana sticker reference prompt
      basePrompt = `Create a single sticker in the distinct ${characterStyle} style for: ${prompt}.
      Bold, thick black outlines around all figures and objects.
      Flat color palette: vibrant primary and secondary colors in unshaded blocks.
      Incorporate visible Ben-Day dots or halftone patterns for texture.
      Dramatic, expressive pose or expression.
      The outline shape must be irregular and interesting — NOT square or circular — closer to a die-cut pattern.
      Clean white border around the subject. Isolated on a plain white background.`;
    } else if (subjectType === "Character") {
      // Full-body mascot — do NOT crop. Key instruction from nano-banana: show everything.
      basePrompt = `Create a ${characterStyle} of: ${prompt}.
      IMPORTANT: Isolated on a plain white background with no shadows.
      Show the COMPLETE full body from head to feet — do NOT crop or cut off any part.
      The entire character must be visible including legs, feet, tail, and any bottom details.
      Expressive face, clean outlines, centered composition.`;
    } else if (subjectType === "Object") {
      basePrompt = `Create a ${characterStyle} product render of: ${prompt}.
      Isolated on a plain white background. Show the complete object from a clear 3/4 perspective.
      Clean, professional product shot. No shadows, no additional elements.`;
    } else if (subjectType === "Logo") {
      // Logo: style drives aesthetic, but composition is icon-like
      basePrompt = `Create a professional mascot logo icon in ${characterStyle} for: ${prompt}.
      Clean, bold shapes. The design should work at small sizes.
      Isolated on a plain white background. No text unless explicitly requested.`;
    } else {
      // Scene
      basePrompt = `Create a richly detailed ${characterStyle} scene: ${prompt}.
      High quality, cinematic composition. Every element should feel intentional and contribute to the mood.
      Beautiful lighting, atmospheric depth.`;
    }

    const result = await generateImage(basePrompt, options);
    const images = result.data;

    // Analyze the generated mascot for better consistency in refinements/animations
    // We analyze the first image to establish the character's base identity
    const analysisResult = await analyzeImage(images[0]);
    const analysis = analysisResult.data;

    // Deduct credits after success based on tokens
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
