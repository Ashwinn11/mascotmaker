import { INDUSTRIES, STYLES, ENGINES } from '@/lib/seo-data';

// /sitemap-use-cases.xml — all pSEO spokes (400+ URLs)
// Separated from sitemap.xml so Google can crawl static + blog pages
// without exhausting crawl budget on programmatic pages first.
// background-remover combos are excluded (noindex in page metadata)

const INDEXABLE_ENGINES = ENGINES.filter(e => e.slug !== 'background-remover');

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mascotmaker.io';

  const urls: { loc: string; priority: string }[] = [];

  // Engine base routes + engine×industry combos
  INDEXABLE_ENGINES.forEach(e => {
    urls.push({ loc: `${baseUrl}/mascot-maker/use-case/${e.slug}`, priority: '0.8' });
    INDUSTRIES.forEach(i => {
      urls.push({ loc: `${baseUrl}/mascot-maker/use-case/${e.slug}/${i.slug}`, priority: '0.7' });
    });
  });

  // Industry hub pages
  INDUSTRIES.forEach(i => {
    urls.push({ loc: `${baseUrl}/mascot-maker/industry/${i.slug}`, priority: '0.8' });
  });

  // Style hub pages + style×industry combos
  STYLES.forEach(s => {
    urls.push({ loc: `${baseUrl}/mascot-maker/style/${s.slug}`, priority: '0.8' });
    INDUSTRIES.forEach(i => {
      urls.push({ loc: `${baseUrl}/mascot-maker/style/${s.slug}/${i.slug}`, priority: '0.7' });
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // cache for 24h at CDN
    },
  });
}
