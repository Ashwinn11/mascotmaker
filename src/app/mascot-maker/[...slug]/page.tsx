import type { Metadata } from "next";
import { INDUSTRIES, STYLES, ENGINES, getSEOContent } from "@/lib/seo-data";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Check, ArrowRight, Zap, DollarSign, Clock, Shield, TrendingUp, Users } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { DynamicHubLinks } from "@/components/dynamic-hub-links";

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

export const revalidate = 3600;   // ISR: refresh cached pages every hour
export const dynamicParams = true; // allow on-demand generation for new paths

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const type = slug[0]; // "use-case", "industry", or "style"
    const part1 = slug[1];
    const part2 = slug[2];

    const engine1 = type === "use-case" ? ENGINES.find((e) => e.slug === part1) : null;
    const industry1 = type === "industry" ? INDUSTRIES.find((i) => i.slug === part1) : null;
    const style1 = type === "style" ? STYLES.find((s) => s.slug === part1) : null;

    const industry2 = part2 ? INDUSTRIES.find((i) => i.slug === part2) : null;
    const style2 = part2 ? STYLES.find((s) => s.slug === part2) : null;

    const primaryItem = engine1 || style1 || industry1;
    const secondaryItem = industry2 || style2;

    if (!primaryItem) return {};

    let title = "";
    let description = "";

    if (primaryItem && secondaryItem) {
        title = type === "style"
            ? `${primaryItem.title} AI Style for ${secondaryItem.title} Logos & Mascots`
            : `${primaryItem.title} for ${secondaryItem.title} Brands — AI Generator`;
        description = type === "style"
            ? `Apply the ${primaryItem.title} aesthetic to your ${secondaryItem.title} brand. Generate consistent AI characters, logos, and stickers with studio-quality textures.`
            : `Create professional ${primaryItem.title} assets for ${secondaryItem.title} with Mascot Maker. Consistent, studio-quality AI character design in seconds.`;
    } else if (engine1) {
        title = `${primaryItem.title} | Free AI Generator Studio`;
        description = `Professional ${primaryItem.title} with Identity Lock consistency. ${primaryItem.description} Try Mascot Maker — studio-quality results in 30 seconds.`;
    } else if (style1) {
        title = `${primaryItem.title} AI Art Style — Mascot & Logo Generator`;
        description = `Generate professional assets in ${primaryItem.title} style. ${primaryItem.description} Identity Lock preserves your character's look across every prompt.`;
    } else if (industry1) {
        title = `AI Mascot & Logo Maker for ${primaryItem.title} Brands`;
        description = `${primaryItem.description} Create consistent, professional brand characters for your ${primaryItem.title} business with zero design experience.`;
    }

    const canonicalPath = [type, primaryItem.slug, secondaryItem?.slug].filter(Boolean).join('/');

    // Priority 3: noindex background-remover combos — zero unique content, no gallery assets
    const isNoindex = type === "use-case" && part1 === "background-remover" && !!part2;

    return {
        title,
        description,
        ...(isNoindex ? { robots: { index: false, follow: true } } : {}),
        alternates: {
            canonical: `https://mascotmaker.io/mascot-maker/${canonicalPath}`,
        },
        openGraph: {
            title,
            description,
            type: "website",
            images: [`https://mascotmaker.io/app-icon.png`],
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: [`https://mascotmaker.io/app-icon.png`],
        }
    };
}

export async function generateStaticParams() {
    const paths: { slug: string[] }[] = [];

    // Use Case Clusters (Engines)
    ENGINES.forEach((e) => {
        paths.push({ slug: ["use-case", e.slug] });
        // Engine + Industry combos
        INDUSTRIES.forEach((i) => {
            paths.push({ slug: ["use-case", e.slug, i.slug] });
        });
    });

    // Industry Clusters
    INDUSTRIES.forEach((i) => {
        paths.push({ slug: ["industry", i.slug] });
    });

    // Style Clusters
    STYLES.forEach((s) => {
        paths.push({ slug: ["style", s.slug] });
        // Style + Industry combos
        INDUSTRIES.forEach((i) => {
            paths.push({ slug: ["style", s.slug, i.slug] });
        });
    });

    return paths;
}

export default async function GenericCategoricalPage({ params }: PageProps) {
    const { slug } = await params;

    const type = slug[0]; // "use-case", "industry", or "style"
    const part1 = slug[1];
    const part2 = slug[2];

    const engine1 = type === "use-case" ? ENGINES.find((e) => e.slug === part1) : null;
    const industry1 = type === "industry" ? INDUSTRIES.find((i) => i.slug === part1) : null;
    const style1 = type === "style" ? STYLES.find((s) => s.slug === part1) : null;

    const industry2 = part2 ? INDUSTRIES.find((i) => i.slug === part2) : null;
    const style2 = part2 ? STYLES.find((s) => s.slug === part2) : null;

    const primaryItem = engine1 || style1 || industry1;
    const secondaryItem = industry2 || style2;

    if (!primaryItem) {
        notFound();
    }

    // --- Hard Redirect for Structural Consolidation (Fixes GSC Duplicate issues) ---
    // We prefer: /use-case/engine/industry OR /style/style/industry
    // We want to avoid: /industry/industry/style OR /industry/industry/engine
    let officialType = type;
    let officialPart1 = part1;
    let officialPart2 = part2;

    if (type === "industry" && part2) {
        // If it's Industry/Style combo, flip it to Style-first
        if (style2) {
            officialType = "style";
            officialPart1 = part2;
            officialPart2 = part1;
        } 
        // If it's Industry/Engine combo, flip it to Use-case-first
        else if (engine1 || (part2 && ENGINES.find(e => e.slug === part2))) {
             // wait, if type is industry, engine1 is null. We need to find engine2.
             const engine2 = ENGINES.find(e => e.slug === part2);
             if (engine2) {
                officialType = "use-case";
                officialPart1 = part2;
                officialPart2 = part1;
             }
        }
    }

    const officialPathParts = ["mascot-maker", officialType, officialPart1];
    if (officialPart2) officialPathParts.push(officialPart2);
    
    const officialPath = `/${officialPathParts.join('/')}`;
    const currentPath = `/mascot-maker/${slug.join('/')}`;

    if (currentPath !== officialPath) {
        redirect(officialPath);
    }

    const combinedTitle = secondaryItem ? `${primaryItem?.title} for ${secondaryItem?.title}` : primaryItem?.title;
    const isStyle = !!style1;
    const isIndustry = !!industry1 && !engine1;
    // Priority 2: pass real descriptions so getSEOContent builds a unique definition per page
    const content = getSEOContent(combinedTitle || "Mascot Maker", primaryItem?.description, secondaryItem?.description);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `Mascot Maker — ${combinedTitle}`,
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "description": primaryItem?.description || "Mascot Maker Studio AI Application",
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": content.customFAQ.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": content.customFAQ.a
                }
            },
            {
                "@type": "Question",
                "name": type === "style" ? `How do I apply the ${primaryItem?.title} style to my mascot?` : `How do I create a ${combinedTitle?.toLowerCase()} with AI?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": type === "style"
                        ? `Select the ${primaryItem?.title} style from our studio, enter your character description, and Identity Lock will generate a consistent character in that exact aesthetic in seconds.`
                        : `Sign up for a free Mascot Maker account, describe your ${combinedTitle?.toLowerCase()} in plain English, and the AI generates a studio-quality result in under 30 seconds. No design skills or software required.`
                }
            },
            {
                "@type": "Question",
                "name": `Is the ${primaryItem?.title} generator really free?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes. New accounts start with 5 free credits. Each generation uses 1 credit. Additional credit packs are available for purchase, but the core tool is free to try with no credit card required.`
                }
            },
            {
                "@type": "Question",
                "name": `Can I use the generated ${primaryItem?.title?.toLowerCase()} commercially?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Absolutely. All assets generated through Mascot Maker come with full commercial use rights. You can use them in ads, products, social media, pitch decks, and client work.`
                }
            }
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to build a ${combinedTitle} with Mascot Maker AI`,
        "description": `Step-by-step guide to generating studio-grade ${combinedTitle} assets using Identity Lock™ consistency.`,
        "step": [
            {
                "@type": "HowToStep",
                "text": `Describe your ${combinedTitle?.toLowerCase()} in plain English. Include personality traits and colors.`
            },
            {
                "@type": "HowToStep",
                "text": `Select the ${primaryItem?.title} engine from our studio menu.`
            },
            {
                "@type": "HowToStep",
                "text": `Hit Generate. The AI will produce a studio-quality asset in 30 seconds.`
            },
            {
                "@type": "HowToStep",
                "text": `Use Identity Lock™ to preserve your character's DNA across different poses.`
            }
        ]
    };

    const comparisonRows = [
        { feature: "Generation speed", mascotMaker: "~30 seconds", freelancer: "3–7 days", diy: "Hours of manual prompting" },
        { feature: "Cost per asset", mascotMaker: "$0.00 (Free credits)", freelancer: "$150–$500", diy: "Opportunity cost" },
        { feature: "Character consistency", mascotMaker: "Identity Lock™ (PINNED)", freelancer: "Manual drawing", diy: "Near impossible randomly" },
        { feature: "Visual resolution", mascotMaker: "4K Studio Upscale", freelancer: "Variable", diy: "Low-res previews" },
        { feature: "Commercial usage", mascotMaker: "Full Rights Included", freelancer: "✓ Included", diy: "Terms often hidden" },
        { feature: "Design experience", mascotMaker: "Zero (AI powered)", freelancer: "None", diy: "High (Prompt Skill)" },
    ];

    return (
        <div className="bg-[#0c0a09] min-h-screen text-white selection:bg-candy-pink/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

            {/* ─── Hero ─── */}
            <section className="relative flex items-center overflow-hidden bg-[#141210] border-b border-white/[0.04] pt-24 pb-16">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-candy-pink/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-7 space-y-6">
                            <Breadcrumb items={[
                                { label: "Home", href: "/" },
                                { label: "Mascot Maker", href: "/explore" },
                                { label: type === "style" ? "Styles" : type === "industry" ? "Industries" : "Use Cases", href: "/explore" },
                                ...(secondaryItem ? [{ label: primaryItem?.title || "", href: `/mascot-maker/${type}/${slug[1]}` }] : []),
                                { label: secondaryItem?.title || primaryItem?.title || "" }
                            ]} />

                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 glass-dark shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-candy-pink opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-candy-pink"></span>
                                </span>
                                <span className="text-[10px] font-black tracking-widest uppercase text-white/50 leading-none">Identity Lock™ — Free to try</span>
                            </div>

                            <h1 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tighter text-white uppercase drop-shadow-sm">
                                {type === "style" ? (
                                    <>
                                        {primaryItem?.title} <br />
                                        <span className="text-candy-pink italic">AI Style.</span>
                                    </>
                                ) : type === "industry" ? (
                                    <>
                                        {combinedTitle} <br />
                                        <span className="text-candy-pink italic">Branding.</span>
                                    </>
                                ) : (
                                    <>
                                        {combinedTitle} <br />
                                        <span className="text-candy-pink italic">Generator.</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-white/50 max-w-xl leading-relaxed">
                                {primaryItem?.description} {secondaryItem ? `Precision-tuned for ${secondaryItem.title} brands.` : ""} Generate consistent, studio-grade characters in under 30 seconds — no design skills required.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link href="/create" className="group inline-flex items-center gap-3 px-8 py-4 bg-candy-pink text-white rounded-2xl font-black text-lg shadow-glow-coral hover:brightness-110 active:scale-95 transition-all duration-300">
                                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                    START FOR FREE
                                </Link>
                                <Link href="/gallery" className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 bg-[#1c1916] text-white rounded-2xl font-black text-lg hover:border-candy-pink hover:text-candy-pink active:scale-95 transition-all duration-300 shadow-lg">
                                    SEARCH HUB <ArrowRight size={18} />
                                </Link>
                            </div>

                            {/* Trust bar */}
                            <div className="flex flex-wrap gap-6 pt-4">
                                {[
                                    { icon: Zap, text: "5 free credits" },
                                    { icon: Shield, text: "Commercial rights included" },
                                    { icon: Users, text: "No design skills needed" },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#5cd85c]/80">
                                        <Icon size={14} className="text-[#5cd85c]" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative mt-12 lg:mt-0">
                            <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#1c1916] p-3 glass-dark">
                                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                                    <Image
                                        src={(primaryItem as any)?.image || "/demo/hero-dragon-barista.png"}
                                        alt={`${combinedTitle} example generated by Mascot Maker AI`}
                                        fill
                                        priority={true}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute top-[40%] left-6 z-30 hidden md:block">
                                    <div className="px-4 py-3 bg-[#141210]/95 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl">
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-candy-pink mb-0.5 leading-none">Identity Lock™</p>
                                        <p className="text-[10px] font-bold text-white/50 leading-none">Zero AI drift</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Why This Combination Works ─── */}
            <section className="py-20 bg-[#0c0a09]">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-4xl md:text-5xl uppercase mb-4 text-white drop-shadow-sm">
                            Why {combinedTitle} <span className="text-candy-pink">Works</span>
                        </h2>
                        <p className="text-white/50 text-lg font-medium max-w-2xl mb-12 leading-relaxed">
                            {isStyle
                                ? `The ${primaryItem?.title} aesthetic isn't just a visual choice — it's a brand signal. Here's why it's the right call${secondaryItem ? ` for ${secondaryItem.title}` : ""}.`
                                : `Mascots aren't decoration. They're brand equity. Here's what a well-executed ${combinedTitle?.toLowerCase()} delivers for your business.`
                            }
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            {[
                                {
                                    icon: TrendingUp,
                                    title: "Higher Brand Recall",
                                    body: `Brands with mascots see up to 3x better audience recall than text-only identities. A ${primaryItem?.title?.toLowerCase()} character gives your ${secondaryItem?.title || "brand"} a face people remember.`,
                                    color: "text-candy-pink"
                                },
                                {
                                    icon: Users,
                                    title: "Emotional Connection",
                                    body: `Characters create parasocial relationships. Your ${combinedTitle?.toLowerCase()} becomes the friendly face of your product, dramatically lowering buyer hesitation and churn.`,
                                    color: "text-candy-blue"
                                },
                                {
                                    icon: Zap,
                                    title: "Consistent Across Every Touchpoint",
                                    body: `From LinkedIn banners to product packaging to Discord avatars — a ${primaryItem?.title} character ensures your personality stays locked.`,
                                    color: "text-[#5cd85c]"
                                },
                            ].map(({ icon: Icon, title, body, color }) => (
                                <div key={title} className="p-6 rounded-2xl border border-white/5 bg-[#141210] hover:border-candy-pink/20 transition-all shadow-lg group">
                                    <Icon size={24} className={`${color} mb-4 group-hover:scale-110 transition-transform`} />
                                    <h3 className="font-black text-lg mb-2 text-white">{title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{body}</p>
                                </div>
                            ))}
                        </div>

                        {/* Founder's Take / Expert Insight */}
                        <div className="bg-candy-pink/5 border border-candy-pink/20 rounded-[2rem] p-8 md:p-12 mb-16 relative overflow-hidden glass-dark shadow-xl">
                            <div className="absolute top-0 right-0 p-8 text-candy-pink opacity-20 rotate-12 mix-blend-screen">
                                <Sparkles size={120} />
                            </div>
                            <div className="relative z-10 max-w-2xl">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-candy-pink mb-4">Founder&apos;s Take</p>
                                <h3 className="font-display text-3xl md:text-4xl uppercase mb-6 leading-none tracking-tight text-white drop-shadow-sm">Consistency is your <span className="italic text-candy-pink">real</span> moat.</h3>
                                <div className="space-y-4 text-white/70 font-medium leading-relaxed">
                                    <p>
                                        When we started Mascot Maker, the biggest design bottleneck wasn&apos;t generating an image—it was generating the <span className="text-white font-bold italic underline decoration-candy-pink underline-offset-4">same</span> character twice.
                                    </p>
                                    <p>
                                        For {combinedTitle?.toLowerCase()} users, this is do-or-die. If your mascot looks different on your homepage than it does in your dashboard, you haven&apos;t built a character—you&apos;ve built a distraction.
                                        That&apos;s why we focused everything on <span className="text-white font-bold text-candy-pink">Identity Lock™</span>. It&apos;s not just AI; it&apos;s brand insurance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Programmatic Visual Gallery */}
                        {((primaryItem as any)?.fallbackGallery?.length > 0) && (
                            <div className="mb-16">
                                <h3 className="font-display text-2xl uppercase tracking-tight mb-6 text-white">
                                    {type === "style" ? "Visual Aesthetic Examples" : "Asset Applications"}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {((primaryItem as any).fallbackGallery || []).map((imgUrl: string, idx: number) => (
                                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300">
                                            <Image src={imgUrl} alt={`Example ${idx + 1} for ${primaryItem.title}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deep Content */}
                        <div className="prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-white prose-p:text-white/60 prose-p:leading-relaxed prose-p:font-medium">
                            {type === "industry" ? (
                                <>
                                    <h2 className="text-3xl mb-4">Why {primaryItem?.title} Brands Need a Mascot</h2>
                                    <p>{content.definition}</p>
                                    <p>{content.benefit1}</p>
                                    <p>{content.benefit2}</p>
                                    <h2 className="text-3xl mb-4 mt-10">Building Brand Equity in {primaryItem?.title}</h2>
                                    <p>
                                        In the competitive {primaryItem?.title?.toLowerCase()} space, characters create instant recognition. Mascot Maker allows you to generate {secondaryItem ? secondaryItem.title : "high-quality"} design assets without the custom-illustrator bottleneck.
                                    </p>
                                    {((primaryItem as any).useCases?.length > 0) && (
                                        <>
                                            <h3 className="text-2xl mt-8 mb-4 text-white">Strategic Applications for {primaryItem?.title}</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 not-prose">
                                                {((primaryItem as any).useCases || []).map((uc: string, idx: number) => (
                                                    <li key={idx} className="flex gap-4 items-center p-5 bg-[#141210] border border-white/5 rounded-2xl shadow-sm hover:border-white/10 transition-colors">
                                                        <div className="w-8 h-8 rounded-full bg-candy-pink/20 text-candy-pink flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(255,77,28,0.3)]">
                                                            <Check size={16} className="stroke-[3]" />
                                                        </div>
                                                        <span className="font-bold text-sm tracking-tight text-white/90">{uc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </>
                            ) : type === "style" ? (
                                <>
                                    <h2 className="text-3xl mb-4">What is the {primaryItem?.title} AI Style?</h2>
                                    <p>{content.definition}</p>
                                    <p>{content.benefit1}</p>
                                    <p>{content.benefit2}</p>
                                    <h2 className="text-3xl mb-4 mt-10">Applying {primaryItem?.title} to Your Character</h2>
                                    <p>
                                        Traditional {primaryItem?.title?.toLowerCase()} creation required hiring a specialized 3D artist or illustrator. Mascot Maker collapses that process into a single prompt, ensuring perfect texture and material accuracy.
                                    </p>
                                    {((primaryItem as any).aesthetics?.length > 0) && (
                                        <>
                                            <h3 className="text-2xl mt-8 mb-4 text-white">Core Traits of {primaryItem?.title}</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                                {((primaryItem as any).aesthetics || []).map((aes: string, idx: number) => (
                                                    <li key={idx} className="flex gap-4 items-center p-5 bg-[#141210] border border-white/5 rounded-2xl shadow-sm hover:border-white/10 transition-colors">
                                                        <div className="w-8 h-8 rounded-full bg-[#5cd85c]/20 text-[#5cd85c] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(92,216,92,0.3)]">
                                                            <Sparkles size={16} className="stroke-[3]" />
                                                        </div>
                                                        <span className="font-bold text-sm tracking-tight text-white/90">{aes}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl mb-4">Why use an AI {primaryItem?.title} Generator?</h2>
                                    <p>{content.definition}</p>
                                    <p>{content.benefit1}</p>
                                    <p>{content.benefit2}</p>
                                    <h2 className="text-3xl mb-4 mt-10">How to Create a {combinedTitle} with AI</h2>
                                    <p>
                                        Traditional {combinedTitle?.toLowerCase()} creation required spending weeks in back-and-forth revisions. Mascot Maker collapses that process into a single prompt.
                                    </p>
                                    {((primaryItem as any).useCases?.length > 0) && (
                                        <>
                                            <h3 className="text-2xl mt-8 mb-4 text-white">Common Generator Applications</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                                {((primaryItem as any).useCases || []).map((uc: string, idx: number) => (
                                                    <li key={idx} className="flex gap-4 items-center p-5 bg-[#141210] border border-white/5 rounded-2xl shadow-sm hover:border-white/10 transition-colors">
                                                        <div className="w-8 h-8 rounded-full bg-candy-yellow/20 text-candy-yellow flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(255,235,59,0.3)]">
                                                            <TrendingUp size={16} className="stroke-[3]" />
                                                        </div>
                                                        <span className="font-bold text-sm tracking-tight text-white/90">{uc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </>
                            )}
                            <div className="pt-8 mb-8 relative">
                                <ol className="space-y-4 not-prose relative z-10">
                                    {[
                                        `Describe your ${combinedTitle?.toLowerCase()} in plain English. Include personality traits, colors, and any reference style you like.`,
                                        `Select your preferred style — Mascot Maker is fully optimized for the kind of output you want.`,
                                        `Click generate. The AI produces a studio-quality asset in under 30 seconds.`,
                                        `Use Identity Lock™ to generate the same character in different poses, expressions, and scenes without drift.`,
                                        `Download with full commercial rights. Use everywhere.`
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-5 items-center p-5 rounded-[1.5rem] bg-[#141210] border border-white/10 shadow-lg">
                                            <span className="shrink-0 w-8 h-8 rounded-full bg-candy-pink text-white text-sm font-black flex items-center justify-center shadow-glow-coral">{i + 1}</span>
                                            <p className="text-base font-medium text-white/80">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                                {/* Connecting line for steps */}
                                <div className="absolute left-[34px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-candy-pink to-candy-pink/0 opacity-50 hidden sm:block"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Best Practices ─── */}
            <section className="py-20 bg-[#141210] border-t border-white/[0.04] relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-candy-pink/20 to-transparent"></div>
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <h2 className="font-display text-4xl uppercase mb-3 text-white drop-shadow-sm">Expert Tips for {primaryItem?.title}</h2>
                    <p className="text-white/50 font-medium mb-10 text-lg">Proven techniques to get the best results from the {combinedTitle?.toLowerCase()} generator.</p>
                    <div className="grid md:grid-cols-2 gap-5">
                        {content.tips.map((tip: string, i: number) => (
                            <div key={i} className="flex items-start gap-4 p-6 rounded-[1.5rem] bg-[#1c1916] border border-white/5 hover:border-white/10 transition-colors shadow-lg">
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-candy-blue/10 flex items-center justify-center border border-candy-blue/20">
                                    <Sparkles size={18} className="text-candy-blue" />
                                </div>
                                <p className="text-sm font-medium text-white/70 leading-relaxed mt-1">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Comparison Table ─── */}
            <section className="py-24 bg-[#0c0a09] border-t border-white/[0.04]">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="font-display text-4xl uppercase mb-4 text-center text-white drop-shadow-sm">
                        Mascot Maker vs <span className="text-[#5cd85c] italic">The Alternatives</span>
                    </h2>
                    <p className="text-white/50 font-medium mb-12 text-center text-lg">
                        Why use a dedicated tool instead of a design agency, Midjourney, or Canva?
                    </p>
                    <div className="rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl glass-dark">
                        <div className="grid grid-cols-4 bg-[#1c1916] border-b border-white/10 text-[10px] font-black uppercase tracking-widest">
                            <div className="p-5 col-span-1 text-white/50 hidden md:block">Feature</div>
                            <div className="p-5 text-candy-pink sm:col-span-1 col-span-2 text-center md:text-left drop-shadow-[0_0_5px_rgba(255,77,28,0.5)]">Mascot Maker</div>
                            <div className="p-5 text-white/40text-center md:text-left">Freelancer</div>
                            <div className="p-5 text-white/40 text-center md:text-left">DIY AI</div>
                        </div>
                        {comparisonRows.map((row, i) => (
                            <div key={i} className={`grid grid-cols-4 text-sm border-t border-white/5 ${i % 2 === 0 ? "bg-[#141210]" : "bg-[#0c0a09]"}`}>
                                <div className="p-5 font-bold text-white/80 col-span-1 md:block hidden">{row.feature}</div>
                                <div className="p-5 font-bold text-candy-pink bg-candy-pink/5 sm:col-span-1 col-span-2 text-center md:text-left">{row.mascotMaker}</div>
                                <div className="p-5 text-white/50 font-medium text-center md:text-left">{row.freelancer}</div>
                                <div className="p-5 text-white/50 font-medium text-center md:text-left">{row.diy}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Stats Bar ─── */}
            <section className="py-12 bg-[#1c1916] border-y border-white/[0.04]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {content.stats.map((stat: string, i: number) => (
                            <div key={i} className="space-y-1">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{stat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="py-24 bg-[#0c0a09]">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="font-display text-4xl md:text-5xl uppercase mb-12 text-center text-white drop-shadow-sm">Frequently Asked Questions</h2>
                    <div className="space-y-5">
                        {[
                            {
                                q: content.customFAQ.q,
                                a: content.customFAQ.a
                            },
                            {
                                q: `How do I create a ${combinedTitle?.toLowerCase()} with AI?`,
                                a: `Sign up for a free Mascot Maker account, describe your character in plain English, and the AI generates a studio-quality ${combinedTitle?.toLowerCase()} in under 30 seconds. No design skills or software required.`
                            },
                            {
                                q: `Is the ${primaryItem?.title} generator really free?`,
                                a: `Yes. New accounts start with 5 free credits. Each generation uses 1 credit. Additional credit packs are available, but the core tool is completely free to try — no credit card required.`
                            },
                            {
                                q: `Can I use generated assets commercially?`,
                                a: `Absolutely. All assets generated through Mascot Maker come with full commercial use rights. Use them in ads, products, social media, pitch decks, and client work.`
                            },
                            {
                                q: `How is Mascot Maker different from Midjourney for ${primaryItem?.title?.toLowerCase()} creation?`,
                                a: `The key difference is Identity Lock™ — Mascot Maker preserves your character's exact features across every generation. Midjourney produces a different-looking character every time you prompt it, making it impractical for brand consistency.`
                            },
                        ].map(({ q, a }, i) => (
                            <div key={i} className="p-8 rounded-[2rem] border border-white/10 bg-[#141210] glass-dark shadow-lg">
                                <h3 className="font-black text-lg mb-3 text-white/90">{q}</h3>
                                <p className="text-base text-white/60 font-medium leading-relaxed">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Internal Linking Hub ─── */}
            <div className="border-t border-white/[0.04]">
                <DynamicHubLinks type={type} primarySlug={part1} />
            </div>

            {/* ─── Final CTA ─── */}
            <section className="py-32 bg-[#141210] relative overflow-hidden border-t border-white/[0.04]">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-candy-pink/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5cd85c]/80">Free · No card required · Commercial rights included</p>
                    <h2 className="font-display text-5xl md:text-7xl text-white leading-tight tracking-tight uppercase drop-shadow-sm">
                        Your {primaryItem?.title}<br />
                        <span className="text-candy-pink italic">Starts here.</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-3 px-12 py-6 bg-candy-pink text-white rounded-2xl font-black text-xl tracking-wide shadow-glow-coral hover:brightness-110 active:scale-95 transition-all duration-300 group"
                    >
                        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                        CREATE FOR FREE
                    </Link>
                </div>
            </section>
        </div>
    );
}
