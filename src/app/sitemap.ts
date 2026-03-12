import type { MetadataRoute } from "next";
import { ENGINES, INDUSTRIES, STYLES, LOCATIONS, COMPETITORS } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mascotmaker.io";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1, },
    { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9, },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8, },
  ];

  const paths: { url: string; priority: number }[] = [];

  // Base level (1 part)
  const allItems = [...ENGINES, ...INDUSTRIES, ...STYLES];
  allItems.forEach((i) => {
    paths.push({ url: `${baseUrl}/mascot-maker/${i.slug}`, priority: 0.7 });
  });

  // 2-part combinations: Engine + Industry
  ENGINES.forEach((e) => {
    INDUSTRIES.forEach((i) => {
      paths.push({ url: `${baseUrl}/mascot-maker/${e.slug}/${i.slug}`, priority: 0.6 });
    });
  });

  // 2-part combinations: Style + Industry
  STYLES.forEach((s) => {
    INDUSTRIES.forEach((i) => {
      paths.push({ url: `${baseUrl}/mascot-maker/${s.slug}/${i.slug}`, priority: 0.6 });
    });
  });

  const categoricalRoutes = paths.map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
    languages: {
      'en-US': url,
      'en-GB': url,
      'x-default': url,
    }
  }));

  const locationRoutes = LOCATIONS.map((item) => {
    const locale = item.country === "USA" ? "en-US" : item.country === "UK" ? "en-GB" : "en";
    const url = `${baseUrl}/mascot-maker/near/${item.slug}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
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
