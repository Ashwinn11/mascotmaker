import { sql } from "@/lib/db";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mascotmaker.io';
  
  let urls: string[] = [];
  try {
    const publishedMascots = (await sql`
      SELECT id, created_at FROM gallery WHERE published = 1 LIMIT 500
    `) as Array<{ id: number; created_at: string | Date }>;

    urls = publishedMascots.map((item) => `${baseUrl}/mascot/${item.id}`);
  } catch (error) {
    console.error("Sitemap DB error:", error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
