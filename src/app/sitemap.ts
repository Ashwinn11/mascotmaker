import { MetadataRoute } from 'next';
import { sql } from "@/lib/db";
import { INDUSTRIES, STYLES, ENGINES, COMPETITORS } from "@/lib/seo-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mascotmaker.io';

  // 1. Core Static Routes
  const staticRoutes = [
    '',
    '/gallery',
    '/blog',
    '/create',
    '/about',
    '/explore',
    '/background-remover',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // 2. Blog Posts (Dynamic from DB or Content)
  // These slugs match your build log exactly
  const blogSlugs = ['ai-mascot-vs-illustrator', 'character-consistency-ai', 'what-is-a-brand-mascot'];
  const blogRoutes = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Showcase Previews (SEO Goldmine)
  let mascotRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedMascots = (await sql`
      SELECT id, created_at FROM gallery WHERE published = 1 LIMIT 500
    `) as Array<{ id: number; created_at: string | Date }>;

    mascotRoutes = publishedMascots.map((item) => ({
      url: `${baseUrl}/mascot/${item.id}`,
      lastModified: new Date(item.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap DB error:", error);
  }

  // 4. Mascot-Maker SEO Use Cases (The Growth Reactor - 400+ Paths)
  const useCaseRoutes: MetadataRoute.Sitemap = [];

  // 4a. Base Engine Routes
  ENGINES.forEach(e => {
    useCaseRoutes.push({ url: `${baseUrl}/mascot-maker/use-case/${e.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
    INDUSTRIES.forEach(i => {
      useCaseRoutes.push({ url: `${baseUrl}/mascot-maker/use-case/${e.slug}/${i.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 });
    });
    STYLES.forEach(s => {
      useCaseRoutes.push({ url: `${baseUrl}/mascot-maker/use-case/${e.slug}/${s.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 });
    });
  });

  // 4b. Industry & Style Combinations
  INDUSTRIES.forEach(i => {
    useCaseRoutes.push({ url: `${baseUrl}/mascot-maker/industry/${i.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
    STYLES.forEach(s => {
      useCaseRoutes.push({ url: `${baseUrl}/mascot-maker/industry/${i.slug}/${s.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 });
    });
  });

  // 4c. Simple Style Individual Routes
  STYLES.forEach(s => {
    useCaseRoutes.push({ url: `${baseUrl}/mascot-maker/style/${s.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
  });

  // 5. Competitor Comparisons
  const compareRoutes = COMPETITORS.map(c => ({
    url: `${baseUrl}/mascot-maker/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...mascotRoutes, ...useCaseRoutes, ...compareRoutes];
}
