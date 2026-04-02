export function SEOSchema() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mascot Maker",
    "url": "https://mascotmaker.io",
    "logo": "https://mascotmaker.io/app-icon.png",
    "description": "AI-powered mascot, logo, and sticker generator. Create consistent 3D, 2D, and vector characters for brands, apps, and content creators.",
    "foundingDate": "2025",
    "sameAs": [
      "https://www.crunchbase.com/organization/mascot-maker"
    ]
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mascot Maker",
    "url": "https://mascotmaker.io",
    "applicationCategory": "DesignApplication",
    "applicationSubCategory": "AI Image Generator",
    "operatingSystem": "Web",
    "browserRequirements": "Requires a modern web browser",
    "description": "Create professional AI mascots, logos, and sticker packs with identity consistency. 8 pro art styles and instant background remover.",
    "featureList": [
      "AI Mascot Generation",
      "Identity Lock Technology",
      "AI Sticker Pack Creator",
      "AI Logo Generator",
      "Instant Background Removal",
      "4K Resolution Upscaling",
      "8 Professional Art Styles",
      "Commercial Usage Rights"
    ],
    "screenshot": "https://mascotmaker.io/app-icon.png",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "description": "Free tier available with premium upgrades"
    }
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  );
}
