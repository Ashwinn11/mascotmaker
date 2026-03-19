import { NextResponse } from "next/server";
import { editImage, analyzeImage } from "@/lib/gemini";
import { requireCredits, deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      mascotBase64,
      analysis: previousAnalysis,
      aspectRatio,
      imageSize,
      subjectType = "Character",
      removeBackground: shouldRemoveBackground = false,
    } = body;
    const options = { aspectRatio, imageSize, subjectType };

    // Auth + credit check
    const check = await requireCredits("chat", options);
    if (check instanceof Response) return check;

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

    // nano-banana best practice: when editing iteratively, always remind the model of
    // the character's key traits AND the original art style to prevent drift.
    const subjectContext = previousAnalysis
      ? `The subject is: ${previousAnalysis}. Preserve all these traits.`
      : "";

    const textProhibition = "CRITICAL: NO text, NO letters, NO words, NO typography, NO watermarks, NO signatures unless explicitly requested in the prompt.";
    const antiBleed = "CRITICAL: The subject MUST NOT contain any shades of Dark Charcoal Grey or similar dark grays.";
    
    let bgRequirement = "";
    if (subjectType === "Logo") {
      bgRequirement = "\n    Maintain the ORIGINAL background style and composition exactly as it is, unless the user explicitly requested to change the background.";
    } else if (subjectType === "Sticker") {
      bgRequirement = `\n    BACKGROUND: Isolated on a SOLID, uniform Dark Charcoal Grey (#404040) background. Maintain the 9-frame sticker sheet layout. Keep the wide white die-cut borders around every subject. ${antiBleed}`;
    } else {
      bgRequirement = shouldRemoveBackground 
        ? `\n    BACKGROUND: Isolated on a SOLID, uniform Dark Charcoal Grey (#404040) background with no shadows or texture. ${antiBleed} Show the COMPLETE full body from head to feet — do NOT crop any part of the character.`
        : `\n    BACKGROUND: Isolated on a Solid Pure White (#FFFFFF) background. Show the COMPLETE full body from head to feet — do NOT crop any part of the character.`;
    }

    const shapeRequirement = subjectType === "Logo"
      ? "\n    LOGO RULES: Maintain a 2D vector graphic, flat design. NO photorealism, NO scenes, NO backgrounds. Focus entirely on symbolic representation."
      : subjectType === "Sticker"
      ? "\n    STICKER RULES: Maintain the 9-frame sticker sheet layout. Keep the wide white die-cut borders around every subject. NO mascot characters unless explicitly asked."
      : "\n    CHARACTER RULES: Show the COMPLETE full body from head to feet — do NOT crop any part of the character.";

    const prompt = `Apply this change to the ${subjectType}: "${message}".
    ${subjectContext}
    CRITICAL: Keep the same art style, color palette, and ${subjectType} identity — only apply the requested change.
    ${bgRequirement}
    ${shapeRequirement}
    ${textProhibition}`;
    const result = await editImage(prompt, mascotBase64, options);
    let imageBase64 = result.data;

    if (shouldRemoveBackground) {
      const { removeBackground } = await import("@/lib/background-removal");
      const buffer = Buffer.from(imageBase64, "base64");
      const transparentBuffer = await removeBackground(buffer);
      imageBase64 = transparentBuffer.toString("base64");
    }

    // Re-analyze the refined mascot for ongoing consistency
    const analysisResult = await analyzeImage(imageBase64);
    const analysis = analysisResult.data;

    const creditsRemaining = await deductCredits(check.userId, "chat", options);

    return NextResponse.json({ imageBase64, analysis, creditsRemaining });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to refine mascot" },
      { status: 500 }
    );
  }
}
