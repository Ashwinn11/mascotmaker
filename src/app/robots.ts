import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mascotmaker.io';

  return {
    rules: {
      userAgent: '*',
      // 🛡️ ALLOW Discovery: Index all high-value conversion pages
      allow: [
        '/',
        '/gallery',
        '/mascot/',           // Every community design is indexable
        '/mascot-maker/',     // All 400+ pSEO spokes
        '/blog/',             // All blog content
        '/create',            // The editor hub
        '/background-remover', // The cutout studio
        '/explore',           // Discovery hub
        '/terms',             // Legal trust signal
        '/privacy',           // Privacy trust signal
        '/about',             // Story/Mission
        '/learn',             // Glossary Academy Hub
      ],
      // 🚪 DISALLOW Privacy: Lock the doors on everything else
      disallow: [
        '/api/',        // No crawling our internal logic/payment hooks
        '/profile',     // No indexing private user dashboards
        '/auth/',       // No crawling login/callback loops
        '/_next/',      // No crawling Next.js internal files
        '/*.json',      // No crawling config files
      ],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-mascots.xml`,
      `${baseUrl}/sitemap-use-cases.xml`,
    ],
  };
}
