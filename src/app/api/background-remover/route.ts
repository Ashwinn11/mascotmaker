import { NextResponse } from "next/server";
import { requireCredits, deductCredits } from "@/lib/credits";
import { removeBackground } from "@/lib/background-removal";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Step 1: Check if user has at least 1 credit
    const check = await requireCredits("remove_bg");
    if (check instanceof Response) return check;

    // Step 2: Remove background (via Cloud Run)
    const buffer = Buffer.from(image, "base64");
    const resultBuffer = await removeBackground(buffer);
    const resultBase64 = resultBuffer.toString("base64");

    // Step 3: Deduct 1 credit
    const currentBalance = await deductCredits(check.userId, "remove_bg");

    return NextResponse.json({
      image: resultBase64,
      creditsRemaining: currentBalance,
    });
  } catch (error: any) {
    console.error("Background Removal Error:", error);
    return NextResponse.json(
      { error: "Failed to remove background" },
      { status: 500 }
    );
  }
}
