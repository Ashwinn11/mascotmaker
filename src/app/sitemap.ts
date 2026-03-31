import type { MetadataRoute } from "next";
import { ENGINES, INDUSTRIES, STYLES, LOCATIONS, COMPETITORS } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mascotmaker.io";
  const lastModified = new Date("2026-03-31");

  // --- Static Pages ---
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/background-remover`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/create`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/explore`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];

  // --- Base Category Pages (/mascot-maker/[slug]) ---
  const baseRoutes: MetadataRoute.Sitemap = [
    ...ENGINES,
    ...INDUSTRIES,
    ...STYLES,
  ].map((item) => ({
    url: `${baseUrl}/mascot-maker/${item.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // --- Combination Pages: Engine + Industry ---
  const engineIndustryRoutes: MetadataRoute.Sitemap = ENGINES.flatMap((e) =>
    INDUSTRIES.map((i) => ({
      url: `${baseUrl}/mascot-maker/${e.slug}/${i.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  // --- Combination Pages: Style + Industry ---
  const styleIndustryRoutes: MetadataRoute.Sitemap = STYLES.flatMap((s) =>
    INDUSTRIES.map((i) => ({
      url: `${baseUrl}/mascot-maker/${s.slug}/${i.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  // --- Location Pages ---
  const locationRoutes: MetadataRoute.Sitemap = LOCATIONS.map((l) => ({
    url: `${baseUrl}/mascot-maker/near/${l.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // --- Comparison Pages ---
  const competitorRoutes: MetadataRoute.Sitemap = COMPETITORS.map((c) => ({
    url: `${baseUrl}/mascot-maker/compare/${c.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...baseRoutes,
    ...engineIndustryRoutes,
    ...styleIndustryRoutes,
    ...locationRoutes,
    ...competitorRoutes,
  ];
}
