import { NextResponse } from "next/server";
import { getGalleryItems, addToGallery } from "@/lib/db";

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
    const { name, description, imageUrl, gifUrl } = await req.json();
    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: "Name and imageUrl are required" },
        { status: 400 }
      );
    }

    const item = addToGallery({ name, description, imageUrl, gifUrl });
    return NextResponse.json({ item });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json(
      { error: "Failed to publish to gallery" },
      { status: 500 }
    );
  }
}
