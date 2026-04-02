import type { MetadataRoute } from "next";
import { ENGINES, INDUSTRIES, STYLES, COMPETITORS } from "@/lib/seo-data";

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
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];

  // --- Base Category Pages (/mascot-maker/[type]/[slug]) ---
  const useCaseRoutes: MetadataRoute.Sitemap = ENGINES.map((e) => ({
    url: `${baseUrl}/mascot-maker/use-case/${e.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const industryRoutes: MetadataRoute.Sitemap = INDUSTRIES.map((i) => ({
    url: `${baseUrl}/mascot-maker/industry/${i.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const styleRoutes: MetadataRoute.Sitemap = STYLES.map((s) => ({
    url: `${baseUrl}/mascot-maker/style/${s.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9, // Styles are highest ROI
  }));

  // --- Combination Pages ---
  const engineIndustryRoutes: MetadataRoute.Sitemap = ENGINES.flatMap((e) =>
    INDUSTRIES.map((i) => ({
      url: `${baseUrl}/mascot-maker/use-case/${e.slug}/${i.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const styleIndustryRoutes: MetadataRoute.Sitemap = STYLES.flatMap((s) =>
    INDUSTRIES.map((i) => ({
      url: `${baseUrl}/mascot-maker/style/${s.slug}/${i.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7, // Style + Industry is strong
    }))
  );

  // --- Comparison Pages ---
  const competitorRoutes: MetadataRoute.Sitemap = COMPETITORS.map((c) => ({
    url: `${baseUrl}/mascot-maker/compare/${c.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [
    ...staticRoutes,
    ...useCaseRoutes,
    ...industryRoutes,
    ...styleRoutes,
    ...engineIndustryRoutes,
    ...styleIndustryRoutes,
    ...competitorRoutes,
  ];
}
