import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGalleryItems, addToGallery, deleteGalleryItem } from "@/lib/db";

export async function GET() {
  try {
    const items = getGalleryItems();
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

    const { name, description, imageUrl, gifUrl } = await req.json();
    if (!name || typeof name !== "string" || !imageUrl) {
      return NextResponse.json(
        { error: "Name and imageUrl are required" },
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

    const item = addToGallery({ name, description, imageUrl, gifUrl, userId: session.user.id });
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

    const deleted = deleteGalleryItem(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
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
