import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { requireCredits, deductCredits } from "@/lib/credits";

let _ai: GoogleGenAI | null = null;
function getAI() {
    if (!_ai) _ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
    return _ai;
}

export async function POST(req: Request) {
    try {
        const { image1Base64, image2Base64, prompt, aspectRatio = "1:1", imageSize = "1K" } = await req.json();

        const options = { studioMode: "Composite" };
        const check = await requireCredits("generate", options);
        if (check instanceof Response) return check;

        if (!image1Base64 || !image2Base64 || !prompt) {
            return NextResponse.json({ error: "Two images and a prompt are required" }, { status: 400 });
        }

        const response = await getAI().models.generateContent({
            model: "gemini-3.1-flash-image-preview",
            contents: [
                {
                    role: "user",
                    parts: [
                        // nano-banana multi-image best practice: context-rich composite prompt.
                        // Reference pattern: "Create a picture of that figurine riding that cat in a fantasy world."
                        // Key: tell the model what to do with each image, preserve primary subject's style.
                        { text: `Using the two provided images: ${prompt}. Focus on the subjects in the images and intelligently ignore their backgrounds. Preserve the visual style and character of the primary subject (Image 1). Produce a single, coherent, high-quality composite image.` },
                        { inlineData: { mimeType: "image/png", data: image1Base64 } },
                        { inlineData: { mimeType: "image/png", data: image2Base64 } },
                    ],
                },
            ],
            config: {
                responseModalities: ["TEXT", "IMAGE"],
                imageConfig: { aspectRatio, imageSize },
                maxOutputTokens: 4096,
            } as any,
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.data);
        if (!imagePart?.inlineData?.data) {
            return NextResponse.json({ error: "No composite image generated" }, { status: 500 });
        }

        const creditsRemaining = await deductCredits(check.userId, "generate", options);

        return NextResponse.json({ imageBase64: imagePart.inlineData.data, creditsRemaining });
    } catch (error) {
        console.error("Mix error:", error);
        return NextResponse.json({ error: "Failed to composite images" }, { status: 500 });
    }
}
