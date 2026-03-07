import type { MetadataRoute } from "next";
import { ENGINES, INDUSTRIES, STYLES, LOCATIONS } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mascotmaker.io";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1, },
    { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9, },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8, },
  ];

  const engineRoutes = ENGINES.map((item) => ({
    url: `${baseUrl}/mascot-maker/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const industryRoutes = INDUSTRIES.map((item) => ({
    url: `${baseUrl}/mascot-maker/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const styleRoutes = STYLES.map((item) => ({
    url: `${baseUrl}/mascot-maker/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const locationRoutes = LOCATIONS.map((item) => ({
    url: `${baseUrl}/mascot-maker/near/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...engineRoutes, ...industryRoutes, ...styleRoutes, ...locationRoutes];
}
