import type { MetadataRoute } from "next";
import { ENGINES, INDUSTRIES, STYLES, LOCATIONS, COMPETITORS } from "@/lib/seo-data";

const baseUrl = "https://mascotmaker.io";
const lastModified = new Date('2026-03-31');

// This function tells Next.js to generate multiple sitemaps
export async function generateSitemaps() {
  return [
    { id: 0 }, // Main & Static
    { id: 1 }, // Engines, Industries, Styles (Base)
    { id: 2 }, // Combinations (Engine + Industry)
    { id: 3 }, // Combinations (Style + Industry)
    { id: 4 }, // Locations
    { id: 5 }, // Comparisons
    { id: 6 }, // Blog
  ];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  switch (id) {
    case 0: // Main & Static
      return [
        { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1 },
        { url: `${baseUrl}/create`, lastModified, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/gallery`, lastModified, changeFrequency: "daily", priority: 0.8 },
        { url: `${baseUrl}/explore`, lastModified, changeFrequency: "weekly", priority: 0.7 },
        { url: `${baseUrl}/background-remover`, lastModified, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.2 },
      ];

    case 1: // Base level (1 part: /mascot-maker/[slug])
      [...ENGINES, ...INDUSTRIES, ...STYLES].forEach((i) => {
        routes.push({
          url: `${baseUrl}/mascot-maker/${i.slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
      break;

    case 2: // Combinations: Engine + Industry
      ENGINES.forEach((e) => {
        INDUSTRIES.forEach((i) => {
          routes.push({
            url: `${baseUrl}/mascot-maker/${e.slug}/${i.slug}`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.6,
          });
        });
      });
      break;

    case 3: // Combinations: Style + Industry
      STYLES.forEach((s) => {
        INDUSTRIES.forEach((i) => {
          routes.push({
            url: `${baseUrl}/mascot-maker/${s.slug}/${i.slug}`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.6,
          });
        });
      });
      break;

    case 4: // Locations
      LOCATIONS.forEach((l) => {
        const locale = l.country === "USA" ? "en-US" : l.country === "UK" ? "en-GB" : "en";
        routes.push({
          url: `${baseUrl}/mascot-maker/near/${l.slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
      break;

    case 5: // Comparisons
      COMPETITORS.forEach((c) => {
        routes.push({
          url: `${baseUrl}/mascot-maker/compare/${c.slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      });
      break;

    case 6: // Blog
      routes.push({ url: `${baseUrl}/blog`, lastModified, changeFrequency: "weekly", priority: 0.8 });
      ["what-is-a-brand-mascot", "ai-mascot-vs-illustrator", "character-consistency-ai"].forEach(slug => {
        routes.push({
          url: `${baseUrl}/blog/${slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
      break;
  }

  return routes;
}
