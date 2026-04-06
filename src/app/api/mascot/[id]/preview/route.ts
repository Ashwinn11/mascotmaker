import { NextResponse } from "next/server";
import { getGalleryItemById, isItemPurchased } from "@/lib/db";
import { auth } from "@/lib/auth";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);
    const item = await getGalleryItemById(itemId);

    if (!item) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const session = await auth();
    const userId = session?.user?.id;

    // Check if user is owner or has purchased (Strict comparison)
    const isOwner = userId && item.user_id && String(userId) === String(item.user_id);
    const purchased = userId ? await isItemPurchased(userId, itemId) : false;

    // DEEP DEBUG: Log IDs for comparison
    console.log(`[DEBUG] Preview API for [${itemId}] ${item.name}:`);
    console.log(`- Request UserId: ${userId}`);
    console.log(`- Item OwnerId:  ${item.user_id}`);
    console.log(`- isOwner Result: ${isOwner}`);
    console.log(`- purchased:     ${purchased}`);

    // If owned/purchased, serve the CLEAN image original
    if (isOwner || purchased) {
      console.log(`[DEBUG] ---> PASSED! Serving Clean Original for ${item.name}`);
      const cleanResponse = await fetch(item.image_url);
      if (!cleanResponse.ok) throw new Error("Failed to fetch clean image");
      const cleanBuffer = Buffer.from(await cleanResponse.arrayBuffer());
      const contentType = cleanResponse.headers.get("content-type") || "image/png";

      return new NextResponse(new Uint8Array(cleanBuffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store, max-age=0", // Disable cache for debug
        },
      });
    }

    // --- WATERMARK LOGIC ---
    
    // Fetch original image
    const response = await fetch(item.image_url);
    if (!response.ok) throw new Error("Failed to fetch source image");
    const buffer = Buffer.from(await response.arrayBuffer());

    // Load & Pre-process watermark (Set opacity)
    const iconPath = path.join(process.cwd(), "public", "app-icon.png");
    const iconBuffer = await fs.readFile(iconPath);
    
    // Scale watermark relative to image size
    const imageMetadata = await sharp(buffer).metadata();
    const watermarkSize = Math.floor((imageMetadata.width || 1024) * 0.25); // 25% of image width

    const processedWatermark = await sharp(iconBuffer)
      .resize(watermarkSize, watermarkSize, { fit: 'inside' })
      .composite([{
        input: Buffer.from([255, 255, 255, Math.floor(255 * 0.35)]), // White color with 35% alpha
        raw: {
          width: 1,
          height: 1,
          channels: 4
        },
        tile: true,
        blend: 'dest-in'
      }])
      .toBuffer();

    const resultBuffer = await sharp(buffer)
      .composite([{
        input: processedWatermark,
        gravity: 'center'
      }])
      .toFormat('png')
      .toBuffer();

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });

  } catch (error) {
    console.error("Preview Processing Error:", error);
    return new NextResponse("Processing failed", { status: 500 });
  }
}
