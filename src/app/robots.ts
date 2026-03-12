import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/create", "/gallery", "/profile", "/create/", "/gallery/", "/profile/", "/*?*modal="],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/create", "/gallery", "/profile", "/create/", "/gallery/", "/profile/", "/*?*modal="],
      }
    ],
    sitemap: "https://mascotmaker.io/sitemap.xml",
  };
}
