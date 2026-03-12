import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SKIP_PREFIXES = ["/_next", "/favicon", "/icon", "/apple-touch-icon", "/manifest", "/opengraph-image", "/twitter-image", "/robots", "/sitemap", "/api"];

export async function proxy(request: NextRequest) {
    const { pathname, host } = request.nextUrl;
    const protocol = request.headers.get("x-forwarded-proto") || "http";

    // Enforce non-www and https (production only — skip on localhost)
    const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    if (!isLocalhost && (host.startsWith("www.") || protocol === "http")) {
        const url = request.nextUrl.clone();
        url.host = host.replace(/^www\./, "");
        url.protocol = "https";
        return NextResponse.redirect(url, 301);
    }

    // Skip static assets
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
