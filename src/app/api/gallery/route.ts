import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGalleryItems, addToGallery, deleteGalleryItem } from "@/lib/db";
import { saveImage, saveBuffer, deleteFile } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "public"; // default to showcase
    const query = searchParams.get("q") || undefined;
    
    const session = await auth();
    const userId = session?.user?.id;

    let items = [];
    if (scope === "mine") {
      if (!userId) {
        return NextResponse.json({ items: [] });
      }
      items = await getGalleryItems({ userId, query, showPublic: false });
    } else if (scope === "purchased") {
      if (!userId) {
        return NextResponse.json({ items: [] });
      }
      const { getPurchasedGalleryItems } = await import("@/lib/db");
      items = await getPurchasedGalleryItems(userId);
    } else {
      // Showcase mode: show everything published
      items = await getGalleryItems({ userId, query, showPublic: true });
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json(
      { error: "Failed to load gallery" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, imageBase64, animationBase64, spriteBase64, subjectType } = await req.json();
    if (!name || typeof name !== "string" || !imageBase64) {
      return NextResponse.json(
        { error: "Name and imageBase64 are required" },
        { status: 400 }
      );
    }
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name must be under 100 characters" },
        { status: 400 }
      );
    }
    if (description && typeof description === "string" && description.length > 500) {
      return NextResponse.json(
        { error: "Description must be under 500 characters" },
        { status: 400 }
      );
    }

    // Upload to R2 at publish time
    const imageUrl = await saveImage(imageBase64);
    let gifUrl: string | undefined;
    if (animationBase64) {
      const animBuffer = Buffer.from(animationBase64, "base64");
      gifUrl = await saveBuffer(animBuffer, "gif");
    }
    let stickerUrl: string | undefined;
    if (spriteBase64) {
      const stickerBuffer = Buffer.from(spriteBase64, "base64");
      stickerUrl = await saveBuffer(stickerBuffer, "png");
    }

    const item = await addToGallery({ 
      name, 
      description, 
      imageUrl, 
      gifUrl, 
      stickerUrl, 
      userId: session.user.id, 
      subjectType,
      published: 0 // Default to PRIVATE — creator manually publishes
    });
    return NextResponse.json({ item });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json(
      { error: "Failed to publish to gallery" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Valid id is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteGalleryItem(id, session.user.id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Item not found or not yours" },
        { status: 404 }
      );
    }

    // Clean up R2 objects
    try {
      await deleteFile(deleted.image_url);
      if (deleted.gif_url) {
        await deleteFile(deleted.gif_url);
      }
      if (deleted.sticker_url) {
        await deleteFile(deleted.sticker_url);
      }
    } catch (err) {
      console.error("Failed to delete R2 objects:", err);
      // Don't fail the request — DB row is already deleted
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Valid id is required" },
        { status: 400 }
      );
    }

    const { toggleGalleryPublished } = await import("@/lib/db");
    const updated = await toggleGalleryPublished(id, session.user.id);
    if (!updated) {
      return NextResponse.json(
        { error: "Item not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("Gallery PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
