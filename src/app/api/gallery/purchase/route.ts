import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGalleryItemById, getUserCredits, isItemPurchased, recordGalleryPurchase, addTransaction } from "@/lib/db";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await req.json();
    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    const item = await getGalleryItemById(itemId);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Owner doesn't pay
    if (item.user_id === session.user.id) {
      return NextResponse.json({ 
        success: true, 
        message: "Owner free download",
        imageUrl: item.image_url,
        gifUrl: item.gif_url,
        stickerUrl: item.sticker_url
      });
    }

    const userId = session.user.id;

    // Check if ALREADY purchased (Permanent Unlock)
    const alreadyPurchased = await isItemPurchased(userId, itemId);
    if (alreadyPurchased) {
      return NextResponse.json({ 
        success: true, 
        message: "Permanent unlock active",
        imageUrl: item.image_url,
        gifUrl: item.gif_url,
        stickerUrl: item.sticker_url
      });
    }

    const cost = 1;
    
    // Check credits
    const currentCredits = await getUserCredits(userId);
    if (currentCredits < cost) {
      return NextResponse.json({ error: "Insufficient credits", required: cost, current: currentCredits }, { status: 402 });
    }

    // Atomic Deduct
    const newBalance = await deductCredits(userId, "download_showcase");
    
    // Log as permanent purchase
    await recordGalleryPurchase(userId, itemId);
    
    return NextResponse.json({ 
      success: true, 
      balance: newBalance,
      imageUrl: item.image_url,
      gifUrl: item.gif_url,
      stickerUrl: item.sticker_url
    });
  } catch (error) {
    console.error("Gallery Purchase Error:", error);
    return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 });
  }
}
