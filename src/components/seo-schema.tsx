"use client";

export function SEOSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mascot Maker Studio",
    "url": "https://mascotmaker.io",
    "logo": "https://mascotmaker.io/app-icon.png",
    "description": "The world's most powerful AI design hub for characters, stickers, and professional mascot assets.",
    "sameAs": [
      "https://twitter.com/mascotmaker",
      "https://discord.gg/mascotmaker"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mascot Maker",
    "url": "https://mascotmaker.io",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mascotmaker.io/gallery?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  );
}
