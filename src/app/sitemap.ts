import { MetadataRoute } from 'next';
import { COMPETITORS } from "@/lib/seo-data";

// sitemap.xml = static pages + blog + compare pages ONLY
// pSEO use-case/style/industry URLs → /sitemap-use-cases.xml
// /mascot/[id] community URLs      → /sitemap-mascots.xml
// Splitting by velocity: this file changes per deploy; shards change per data

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mascotmaker.io';

  // 1. Core static routes — highest priority, deepest trust signals
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

  // 2. Blog posts — update when new posts are added
  const blogSlugs = ['ai-mascot-vs-illustrator', 'character-consistency-ai', 'what-is-a-brand-mascot'];
  const blogRoutes = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Competitor comparison pages
  const compareRoutes = COMPETITORS.map(c => ({
    url: `${baseUrl}/mascot-maker/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...compareRoutes];
}
