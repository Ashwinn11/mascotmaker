import { NextRequest, NextResponse } from "next/server";

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "download";

  if (!url || url.startsWith("data:")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Ensure url is absolute for fetch
  const fetchUrl = url.startsWith("/") ? `${process.env.NEXT_PUBLIC_URL || ""}${url}` : url;

  const upstream = await fetch(fetchUrl);
  if (!upstream.ok) {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  const mode = req.nextUrl.searchParams.get("mode");

  const headers: Record<string, string> = {
    "Content-Type": contentType,
  };

  if (mode !== "view") {
    headers["Content-Disposition"] = `attachment; filename="${filename}"`;
  }

  return new NextResponse(upstream.body, { headers });
}
