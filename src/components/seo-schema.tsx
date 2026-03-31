export function SEOSchema() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mascot Maker",
    "url": "https://mascotmaker.io",
    "logo": "https://mascotmaker.io/app-icon.png",
    "description": "AI-powered mascot and character generator. Create consistent 3D, 2D, and animated characters for brands, games, and content creators.",
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
    "description": "Create professional AI mascots and characters with identity consistency. 12+ art styles, 8-frame storyboards, and product ad compositing.",
    "featureList": [
      "AI Character Generation",
      "Identity Lock Technology",
      "8-Frame Storyboard Creator",
      "Product Ad Compositing",
      "GIF Animation Export",
      "4K Resolution Upscaling",
      "12+ Art Styles",
      "Commercial Usage Rights"
    ],
    "screenshot": "https://mascotmaker.io/og-image.png",
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
