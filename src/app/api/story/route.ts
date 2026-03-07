import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { requireCredits, deductCredits } from "@/lib/credits";
import { analyzeImage } from "@/lib/gemini";

let _ai: GoogleGenAI | null = null;
function getAI() {
    if (!_ai) _ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
    return _ai;
}

async function generateStory(storyPrompt: string, aspectRatio: string, imageSize: string, imageBase64?: string): Promise<string[]> {
    const parts: any[] = [{ text: storyPrompt }];
    if (imageBase64) {
        parts.push({ inlineData: { mimeType: "image/png", data: imageBase64 } });
    }

    const response = await getAI().models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: [{ role: "user", parts }],
        config: {
            responseModalities: ["TEXT", "IMAGE"],
            imageConfig: { aspectRatio, imageSize },
            maxOutputTokens: 8192,
        } as any,
    });

    return (response.candidates?.[0]?.content?.parts ?? [])
        .filter((p: any) => p.inlineData?.data)
        .map((p: any) => p.inlineData.data as string);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, style, aspectRatio = "1:1", imageSize = "1K", mascotBase64, analysis: existingAnalysis } = body;

        const options = { aspectRatio, imageSize, studioMode: "Story", subjectType: "Character" };

        const check = await requireCredits("generate", options);
        if (check instanceof Response) return check;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const characterStyle = style || "cute mascot character in a cartoon/chibi style, vibrant colors";

        // If an image is provided but no analysis, analyze it first — needed for text-only fallback
        let analysis = existingAnalysis;
        if (mascotBase64 && !analysis) {
            try {
                const result = await analyzeImage(mascotBase64);
                analysis = result.data;
            } catch { /* analysis is optional */ }
        }

        // Strong multi-output instruction — appended to every prompt
        const multiOutputInstruction = `
OUTPUT FORMAT: You MUST output exactly 8 SEPARATE, INDIVIDUAL images — one per story scene.
Do NOT combine them into a single grid or storyboard. Each scene is its own distinct image output.`;

        let storyPrompt: string;
        if (mascotBase64 && analysis) {
            storyPrompt = `Create a beautifully entertaining 8 part story in ${characterStyle}.
The protagonist is: ${analysis}. Use the attached reference image to keep the character consistent.
Story scenario: "${prompt}"
IMPORTANT: Strict character consistency across all 8 scenes. No words or text on images — story through imagery only.
${multiOutputInstruction}`;
        } else if (mascotBase64) {
            storyPrompt = `Create a beautifully entertaining 8 part story in ${characterStyle}.
The protagonist is the character shown in the attached reference image.
Story scenario: "${prompt}"
IMPORTANT: Strict character consistency. No words or text on images.
${multiOutputInstruction}`;
        } else {
            storyPrompt = `Create a beautifully entertaining 8 part story in ${characterStyle}: "${prompt}".
The story should be thrilling throughout with emotional highs and lows.
IMPORTANT: Strict character consistency. No words or text on images.
${multiOutputInstruction}`;
        }

        // First attempt — pass image if provided
        let images = await generateStory(storyPrompt, aspectRatio, imageSize, mascotBase64);

        // If we passed an image but got only 1 composite back (model went into edit mode),
        // retry text-only using the character analysis — keeps model in multi-generation mode
        if (mascotBase64 && images.length === 1 && analysis) {
            console.log("Story: composite returned with image context — retrying text-only with analysis");
            const fallbackPrompt = `Create a beautifully entertaining 8 part story in ${characterStyle}.
The protagonist is: ${analysis}. Keep this character visually consistent across all 8 scenes.
Story scenario: "${prompt}"
IMPORTANT: No words or text on images.
${multiOutputInstruction}`;
            const retryImages = await generateStory(fallbackPrompt, aspectRatio, imageSize);
            if (retryImages.length > 1) images = retryImages;
        }

        if (images.length === 0) {
            return NextResponse.json({ error: "No story frames were generated" }, { status: 500 });
        }

        const creditsRemaining = await deductCredits(check.userId, "generate", options);

        return NextResponse.json({ images, creditsRemaining });
    } catch (error) {
        console.error("Story error:", error);
        return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
    }
}
