
import type { Metadata } from "next";
import { INDUSTRIES, STYLES, ENGINES, getSEOContent } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Check, ArrowRight, Zap, DollarSign, Clock, Shield, TrendingUp, Users } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { DynamicHubLinks } from "@/components/dynamic-hub-links";

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

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

    const canonicalPath = slug.join('/');

    return {
        title,
        description,
        alternates: {
            canonical: `https://mascotmaker.io/mascot-maker/${canonicalPath}`,
        },
        openGraph: {
            title,
            description,
            type: "website",
            images: [`/app-icon.png`],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`/app-icon.png`],
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

    const combinedTitle = secondaryItem ? `${primaryItem?.title} for ${secondaryItem?.title}` : primaryItem?.title;
    const isStyle = !!style1;
    const isIndustry = !!industry1 && !engine1;
    const content = getSEOContent(combinedTitle || "Mascot Maker");

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
                    "text": `Yes. New accounts start with 25 free credits. Each generation uses 1 credit. Additional credit packs are available for purchase, but the core tool is free to try with no credit card required.`
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

    const comparisonRows = [
        { feature: "Generation speed", mascotMaker: "~30 seconds", agency: "3–6 weeks", diy: "Hours of prompting" },
        { feature: "Cost", mascotMaker: "Free (25 credits)", agency: "$2,000–$10,000", diy: "Time-intensive" },
        { feature: "Character consistency", mascotMaker: "Identity Lock™", agency: "Depends on artist", diy: "Very poor" },
        { feature: "Commercial rights", mascotMaker: "✓ Included", agency: "✓ (paid)", diy: "✗ Varies" },
        { feature: "Multiple poses/styles", mascotMaker: "Unlimited", agency: "Extra cost", diy: "Manual reprompting" },
        { feature: "Design skills needed", mascotMaker: "None", agency: "None", diy: "High" },
    ];

    return (
        <div className="bg-cream min-h-screen selection:bg-candy-pink/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            {/* ─── Hero ─── */}
            <section className="relative flex items-center overflow-hidden bg-mesh-candy bg-grain pt-24 pb-16">
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

                            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-foreground/5 bg-cream/50 backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-candy-pink opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-candy-pink"></span>
                                </span>
                                <span className="text-[9px] font-black tracking-widest uppercase text-foreground/40 leading-none">Identity Lock™ — Free to try</span>
                            </div>

                            <h1 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tighter text-foreground uppercase">
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
                            <p className="text-lg md:text-xl font-medium text-foreground/60 max-w-xl leading-relaxed">
                                {primaryItem?.description} {secondaryItem ? `Precision-tuned for ${secondaryItem.title} brands.` : ""} Generate consistent, studio-grade characters in under 30 seconds — no design skills required.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link href="/create" className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-cream rounded-2xl font-black text-lg shadow-premium hover:bg-candy-pink transition-all duration-300 hover:scale-[1.02]">
                                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                    START FOR FREE
                                </Link>
                                <Link href="/gallery" className="inline-flex items-center gap-3 px-8 py-4 border border-foreground/10 text-foreground rounded-2xl font-black text-lg hover:border-candy-pink hover:text-candy-pink transition-all duration-300">
                                    SEE EXAMPLES <ArrowRight size={18} />
                                </Link>
                            </div>

                            {/* Trust bar */}
                            <div className="flex flex-wrap gap-6 pt-2">
                                {[
                                    { icon: Zap, text: "25 free credits" },
                                    { icon: Shield, text: "Commercial rights included" },
                                    { icon: Users, text: "No design skills needed" },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-2 text-sm font-bold text-foreground/50">
                                        <Icon size={14} className="text-candy-pink" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative mt-12 lg:mt-0">
                            <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-2xl bg-white p-3">
                                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                                    <Image
                                        src={(primaryItem as any)?.image || "/demo/hero-dragon-barista.png"}
                                        alt={`${combinedTitle} example generated by Mascot Maker AI`}
                                        fill
                                        priority={true}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute top-1/2 -left-6 z-30 hidden md:block">
                                    <div className="px-4 py-3 bg-foreground text-cream rounded-xl shadow-premium">
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-candy-pink mb-0.5 leading-none">Identity Lock™</p>
                                        <p className="text-[10px] font-bold text-cream/50 leading-none">Zero AI drift</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Why This Combination Works ─── */}
            <section className="py-20 bg-white border-t border-foreground/5">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-4xl md:text-5xl uppercase mb-4">
                            Why {combinedTitle} <span className="text-candy-pink">Works</span>
                        </h2>
                        <p className="text-foreground/50 text-lg font-medium max-w-2xl mb-12 leading-relaxed">
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
                                    body: `From LinkedIn banners to product packaging to Discord avatars — the same character, same personality, same brand. Identity Lock™ guarantees it.`,
                                    color: "text-candy-orange"
                                },
                            ].map(({ icon: Icon, title, body, color }) => (
                                <div key={title} className="p-6 rounded-2xl border-2 border-foreground/5 bg-cream hover:border-candy-pink/20 transition-all">
                                    <Icon size={24} className={`${color} mb-4`} />
                                    <h3 className="font-black text-lg mb-2">{title}</h3>
                                    <p className="text-sm text-foreground/60 leading-relaxed">{body}</p>
                                </div>
                            ))}
                        </div>

                        {/* Programmatic Visual Gallery */}
                        {((primaryItem as any)?.fallbackGallery?.length > 0) && (
                            <div className="mb-16">
                                <h3 className="font-display text-2xl uppercase tracking-tight mb-6">
                                    {type === "style" ? "Visual Aesthetic Examples" : "Asset Applications"}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {((primaryItem as any).fallbackGallery || []).map((imgUrl: string, idx: number) => (
                                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-foreground/5 shadow-sm hover:scale-105 transition-transform duration-300">
                                            <Image src={imgUrl} alt={`Example ${idx+1} for ${primaryItem.title}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deep Content */}
                        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-p:text-foreground/60 prose-p:leading-relaxed">
                            {type === "industry" ? (
                                <>
                                    <h2 className="text-3xl mb-4">Why {primaryItem?.title} Brands Need a Mascot</h2>
                                    <p>{content.definition}</p>
                                    <p>{content.benefit1}</p>
                                    <p>{content.benefit2}</p>
                                    <h2 className="text-3xl mb-4 mt-10">Building Brand Equity in {primaryItem?.title}</h2>
                                    <p>
                                        In the competitive {primaryItem?.title?.toLowerCase()} space, characters create instant recognition. Mascot Maker allows you to generate {secondaryItem ? secondaryItem.title : "high-quality"} design assets without the $5,000+ agency price tag.
                                    </p>
                                    {((primaryItem as any).useCases?.length > 0) && (
                                        <>
                                            <h3 className="text-2xl mt-8 mb-4">Strategic Applications for {primaryItem?.title}</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 not-prose">
                                                {((primaryItem as any).useCases || []).map((uc: string, idx: number) => (
                                                    <li key={idx} className="flex gap-3 items-center p-4 bg-white border border-foreground/5 rounded-2xl shadow-sm">
                                                        <div className="w-8 h-8 rounded-full bg-candy-pink/10 text-candy-pink flex items-center justify-center shrink-0">
                                                            <Check size={16} className="stroke-[3]" />
                                                        </div>
                                                        <span className="font-bold text-sm tracking-tight text-foreground">{uc}</span>
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
                                            <h3 className="text-2xl mt-8 mb-4">Core Traits of {primaryItem?.title}</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                                {((primaryItem as any).aesthetics || []).map((aes: string, idx: number) => (
                                                    <li key={idx} className="flex gap-3 items-center p-4 bg-white border border-foreground/5 rounded-2xl shadow-sm">
                                                        <div className="w-8 h-8 rounded-full bg-candy-blue/10 text-candy-blue flex items-center justify-center shrink-0">
                                                            <Sparkles size={16} className="stroke-[3]" />
                                                        </div>
                                                        <span className="font-bold text-sm tracking-tight text-foreground">{aes}</span>
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
                                            <h3 className="text-2xl mt-8 mb-4">Common Generator Applications</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                                {((primaryItem as any).useCases || []).map((uc: string, idx: number) => (
                                                    <li key={idx} className="flex gap-3 items-center p-4 bg-white border border-foreground/5 rounded-2xl shadow-sm">
                                                        <div className="w-8 h-8 rounded-full bg-candy-yellow/10 text-candy-yellow flex items-center justify-center shrink-0">
                                                            <TrendingUp size={16} className="stroke-[3]" />
                                                        </div>
                                                        <span className="font-bold text-sm tracking-tight text-foreground">{uc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </>
                            )}
                            <ol className="space-y-3 not-prose mb-8">
                                {[
                                    `Describe your ${combinedTitle?.toLowerCase()} in plain English. Include personality traits, colors, and any reference style you like.`,
                                    `Select your preferred style — Mascot Maker is fully optimized for the kind of output you want.`,
                                    `Click generate. The AI produces a studio-quality asset in under 30 seconds.`,
                                    `Use Identity Lock™ to generate the same character in different poses, expressions, and scenes without drift.`,
                                    `Download with full commercial rights. Use everywhere.`
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white border border-foreground/5">
                                        <span className="shrink-0 w-7 h-7 rounded-full bg-candy-pink text-white text-xs font-black flex items-center justify-center">{i + 1}</span>
                                        <p className="text-sm font-medium text-foreground/70">{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Best Practices ─── */}
            <section className="py-20 bg-cream border-t border-foreground/5">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="font-display text-4xl uppercase mb-3">Expert Tips for {primaryItem?.title}</h2>
                    <p className="text-foreground/50 font-medium mb-10">Proven techniques to get the best results from the {combinedTitle?.toLowerCase()} generator.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {content.tips.map((tip: string, i: number) => (
                            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-foreground/5 shadow-sm">
                                <div className="shrink-0 w-8 h-8 rounded-xl bg-candy-pink/10 flex items-center justify-center">
                                    <Check size={14} className="text-candy-pink" />
                                </div>
                                <p className="text-sm font-medium text-foreground/70 leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Comparison Table ─── */}
            <section className="py-20 bg-white border-t border-foreground/5">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="font-display text-4xl uppercase mb-3">
                        Mascot Maker vs <span className="text-candy-pink">The Alternatives</span>
                    </h2>
                    <p className="text-foreground/50 font-medium mb-10">
                        Why use a dedicated {combinedTitle?.toLowerCase()} tool instead of a design agency, Midjourney, or Canva?
                    </p>
                    <div className="rounded-2xl border-2 border-foreground/10 overflow-hidden">
                        <div className="grid grid-cols-4 bg-foreground text-cream text-xs font-black uppercase tracking-widest">
                            <div className="p-4 col-span-1">Feature</div>
                            <div className="p-4 text-candy-pink">Mascot Maker</div>
                            <div className="p-4 text-foreground/40">Design Agency</div>
                            <div className="p-4 text-foreground/40">Midjourney / DIY</div>
                        </div>
                        {comparisonRows.map((row, i) => (
                            <div key={i} className={`grid grid-cols-4 text-sm border-t border-foreground/5 ${i % 2 === 0 ? "bg-cream" : "bg-white"}`}>
                                <div className="p-4 font-bold text-foreground/70 col-span-1">{row.feature}</div>
                                <div className="p-4 font-bold text-candy-pink">{row.mascotMaker}</div>
                                <div className="p-4 text-foreground/40">{row.agency}</div>
                                <div className="p-4 text-foreground/40">{row.diy}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Stats Bar ─── */}
            <section className="py-12 bg-foreground border-t-4 border-foreground">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {content.stats.map((stat: string, i: number) => (
                            <div key={i} className="space-y-1">
                                <p className="text-cream/40 text-[10px] font-black uppercase tracking-widest">{stat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="py-20 bg-cream border-t border-foreground/5">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="font-display text-4xl uppercase mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: `How do I create a ${combinedTitle?.toLowerCase()} with AI?`,
                                a: `Sign up for a free Mascot Maker account, describe your character in plain English, and the AI generates a studio-quality ${combinedTitle?.toLowerCase()} in under 30 seconds. No design skills or software required.`
                            },
                            {
                                q: `Is the ${primaryItem?.title} generator really free?`,
                                a: `Yes. New accounts start with 25 free credits. Each generation uses 1 credit. Additional credit packs are available, but the core tool is completely free to try — no credit card required.`
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
                            <div key={i} className="p-6 rounded-2xl border-2 border-foreground/5 bg-white">
                                <h3 className="font-black text-base mb-2">{q}</h3>
                                <p className="text-sm text-foreground/60 leading-relaxed">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Internal Linking Hub ─── */}
            <DynamicHubLinks type={type} primarySlug={part1} />

            {/* ─── Final CTA ─── */}
            <section className="py-24 bg-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cream/20">Free · No card required · Commercial rights included</p>
                    <h2 className="font-display text-4xl md:text-6xl text-cream leading-tight tracking-tight uppercase">
                        Your {primaryItem?.title}<br />
                        <span className="text-candy-pink">Starts here.</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-candy-pink text-cream rounded-2xl font-black text-lg tracking-wide shadow-glow-pink hover:brightness-110 hover:scale-[1.02] transition-all group"
                    >
                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                        CREATE FOR FREE
                    </Link>
                </div>
            </section>
        </div>
    );
}
