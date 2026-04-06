export interface LearnTerm {
    title: string;
    slug: string;
    category: "Concepts" | "Technical" | "Marketing";
    excerpt: string;
    fullContent: string[];
    relatedSlugs: string[];
    image?: string;
}

export const LEARN_TERMS: LearnTerm[] = [
    {
        title: "Identity Lock™ Technology",
        slug: "identity-lock-technology",
        category: "Technical",
        image: "/demo/character-consistency.webp",
        excerpt: "How to maintain consistent character features across multiple AI generations without character 'drift'.",
        fullContent: [
            "Identity Lock is our proprietary engine that 'pins' the core DNA of a character—including facial proportions, material textures, and color palettes—across different poses.",
            "In traditional AI generation, creating the same character twice is nearly impossible. Our engine uses a combination of facial seed locking and reference-aware diffusion to ensure your mascot stays yours.",
            "For brands, this means you can generate a 'Happy' pose and a 'Surprised' pose that actually look like the same individual, which is critical for storytelling and UI consistency."
        ],
        relatedSlugs: ["character-consistency", "ai-drift"]
    },
    {
        title: "Character Consistency",
        slug: "character-consistency",
        category: "Concepts",
        image: "/demo/character-consistency.webp",
        excerpt: "The art of keeping your brand's AI mascot recognizable and uniform across different marketing channels.",
        fullContent: [
            "Character consistency is the foundation of brand trust. If your mascot looks different on your homepage than it does in your help documentation, users lose that emotional connection.",
            "Achieving consistency in AI requires more than just a good prompt; it requires a tool that understands spatial relationships and facial geometry.",
            "By maintaining a consistent character 'base', companies can reduce their design costs by 80% while increasing brand recall significantly."
        ],
        relatedSlugs: ["identity-lock-technology", "brand-mascot"]
    },
    {
        title: "AI Mascot Design",
        slug: "ai-mascot-design",
        category: "Concepts",
        image: "/demo/hero-dragon-barista.png",
        excerpt: "A guide to using generative AI to create professional brand characters that don't look generic.",
        fullContent: [
            "AI Mascot Design has moved beyond simple 'cartoon robot' prompts. Modern brands use specialized engines to create unique, high-fidelity characters.",
            "When designing an AI mascot, focus on silhouette first. A recognizable shape is more important than fine detail when the mascot is viewed at small sizes on mobile screens.",
            "Our studio provides 8 distinct professional art styles—from 3D Pixar to Minimalist Vector — to ensure your mascot aligns with your existing brand aesthetic."
        ],
        relatedSlugs: ["vector-logos", "brand-mascot"]
    },
    {
        title: "Vector Logos (AI Generated)",
        slug: "vector-logos",
        category: "Technical",
        image: "/demo/style-minimal.png",
        excerpt: "Understanding how AI-generated logos are converted into scalable vector graphics (SVG) for print and professional use.",
        fullContent: [
            "While AI generates raster pixels (PNG/JPG), professional branding requires vector paths. Our engine is tuned for 'Flat Vector' aesthetics which produce clean, simple shapes.",
            "Clean shapes are easier for tracing tools like Adobe Illustrator or Figma to convert into infinite-scale SVG files.",
            "Always prioritize high contrast and simple geometries when generating logos if you intend to use them for signage, embroidery, or large-scale physical printing."
        ],
        relatedSlugs: ["minimalist-style", "merchandise-design"]
    },
    {
        title: "SaaS Onboarding Mascots",
        slug: "saas-onboarding-mascots",
        category: "Marketing",
        image: "/demo/cat-stickers.webp",
        excerpt: "Using friendly characters to reduce friction and increase completion rates during user onboarding flows.",
        fullContent: [
            "Onboarding is the most high-friction moment in a SaaS user's journey. A friendly, consistent mascot acts as a guide, providing emotional reassurance and celebrating small wins.",
            "Mascots used in empty states (e.g. 'Your dashboard is empty—let's fix that!') significantly increase user activation rates compared to static text.",
            "By using our 3D Pixar or Claymation styles, you can create a character that feels high-end and production-ready, elevating the perceived value of your software."
        ],
        relatedSlugs: ["engagement-marketing", "character-consistency"]
    },
    {
        title: "Sticker Pack Marketing",
        slug: "sticker-pack-marketing",
        category: "Marketing",
        image: "/demo/cat-stickers.webp",
        excerpt: "How to use branded sticker sets for Discord, Telegram, and Slack to build community viral growth.",
        fullContent: [
            "Sticker packs are the 'underrated' viral growth engine. When users share your branded character in Discord or Slack to express emotion, they are performing free community marketing.",
            "Professional sticker packs require a unified 'Reaction Sheet' (Happy, Sad, Surprised, Thinking) that maintains the character's core identity across every reaction.",
            "Our Sticker Pack Studio automates the generation of these cohesive sets, providing 12+ reactions from a single character in seconds."
        ],
        relatedSlugs: ["discord-assets", "brand-loyalty"]
    },
    {
        title: "AI Drift",
        slug: "ai-drift",
        category: "Technical",
        image: "/demo/before-after.webp",
        excerpt: "The phenomenon where generative AI changes facial features between generations. Here is how to fix it.",
        fullContent: [
            "AI Drift refers to the minute (or major) changes in a character's face, clothing, or color palette when you use the same prompt twice. It is the enemy of professional design.",
            "To solve drift, you must use reference-based generation. By providing the AI with a 'seed' or a 'source image' of your mascot, you minimize the variance in the output.",
            "Mascot Maker's Identity Lock is specifically tuned to overcome drift in high-fidelity 3D and 2D models, ensuring your character stays the same throughout your campaign."
        ],
        relatedSlugs: ["identity-lock-technology", "character-consistency"]
    },
    {
        title: "Brand Mascot Strategy",
        slug: "brand-mascot",
        category: "Marketing",
        image: "/demo/hero-dragon-barista.png",
        excerpt: "Why successful brands from Duolingo to Mailchimp use mascots to build emotional stickiness.",
        fullContent: [
            "A mascot is more than a drawing; it is a brand's avatar in the digital world. It gives users something to relate to emotionally beyond a product's features.",
            "Mascots humanize cold tech brands and make abstract software concepts easier to understand for the average user.",
            "Strategic mascots often have 'lore'—a personality, a backstory, and a specific voice—that helps them resonate with a specific target audience, like the Duolingo owl's persistent personality."
        ],
        relatedSlugs: ["saas-onboarding-mascots", "character-consistency"]
    }
];
