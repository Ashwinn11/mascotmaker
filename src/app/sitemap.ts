import type { MetadataRoute } from "next";
import { ENGINES, INDUSTRIES, STYLES, LOCATIONS, COMPETITORS } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mascotmaker.io";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1, },
    { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9, },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8, },
  ];

  const categoricalRoutes = [...ENGINES, ...INDUSTRIES, ...STYLES].map((item) => {
    const url = `${baseUrl}/mascot-maker/${item.slug}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      languages: {
        'en-US': url,
        'en-GB': url,
        'x-default': url,
      }
    };
  });

  const locationRoutes = LOCATIONS.map((item) => {
    const locale = item.country === "USA" ? "en-US" : item.country === "UK" ? "en-GB" : "en";
    const url = `${baseUrl}/mascot-maker/near/${item.slug}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      languages: {
        [locale]: url,
        'x-default': url,
      }
    };
  });

  const competitorRoutes = COMPETITORS.map((item) => {
    const url = `${baseUrl}/mascot-maker/compare/${item.slug}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      languages: {
        'en-US': url,
        'x-default': url,
      }
    };
  });

  return [...staticRoutes, ...categoricalRoutes, ...locationRoutes, ...competitorRoutes];
}
