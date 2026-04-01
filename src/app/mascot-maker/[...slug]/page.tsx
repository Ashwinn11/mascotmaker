
import type { Metadata } from "next";
import { INDUSTRIES, STYLES, ENGINES, getSEOContent } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Palette, Check, ArrowRight } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";
import { Breadcrumb } from "@/components/breadcrumb";

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const part1 = slug[0];
    const part2 = slug[1];

    const engine1 = ENGINES.find((e) => e.slug === part1);
    const industry1 = INDUSTRIES.find((i) => i.slug === part1);
    const style1 = STYLES.find((s) => s.slug === part1);

    const industry2 = part2 ? INDUSTRIES.find((i) => i.slug === part2) : null;
    const style2 = part2 ? STYLES.find((s) => s.slug === part2) : null;

    const primaryItem = engine1 || style1 || industry1;
    const secondaryItem = industry2 || style2;

    if (!primaryItem) return {};

    let title = "";
    let description = "";

    if (primaryItem && secondaryItem) {
        title = `${primaryItem.title} for ${secondaryItem.title}`;
        description = `Create professional ${primaryItem.title} assets for ${secondaryItem.title} with Mascot Maker. Consistent, studio-quality AI design.`;
    } else if (engine1) {
        title = `${primaryItem.title} | AI Design Hub`;
        description = primaryItem.description;
    } else if (industry1) {
        title = `AI Tools for ${primaryItem.title}`;
        description = primaryItem.description;
    } else {
        title = `${primaryItem.title} AI Generator`;
        description = primaryItem.description;
    }

    const canonicalPath = slug.join('/');

    return {
        title,
        description: description + " Professional, consistent AI assets in seconds.",
        alternates: {
            canonical: `https://mascotmaker.io/mascot-maker/${canonicalPath}`,
        },
        openGraph: {
            title,
            description,
            type: "website",
            images: [`/og-image.png`], // Use the global og-image for consistency or dynamic one
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`/og-image.png`],
        }
    };
}

export async function generateStaticParams() {
    const paths: { slug: string[] }[] = [];

    // Base level (1 part)
    const allItems = [...ENGINES, ...INDUSTRIES, ...STYLES];
    allItems.forEach((i) => {
        paths.push({ slug: [i.slug] });
    });

    // 2-part combinations: Engine + Industry
    ENGINES.forEach((e) => {
        INDUSTRIES.forEach((i) => {
            paths.push({ slug: [e.slug, i.slug] });
        });
    });

    // 2-part combinations: Style + Industry
    STYLES.forEach((s) => {
        INDUSTRIES.forEach((i) => {
            paths.push({ slug: [s.slug, i.slug] });
        });
    });

    return paths;
}

export default async function GenericCategoricalPage({ params }: PageProps) {
    const { slug } = await params;

    const part1 = slug[0];
    const part2 = slug[1];

    const engine1 = ENGINES.find((e) => e.slug === part1);
    const industry1 = INDUSTRIES.find((i) => i.slug === part1);
    const style1 = STYLES.find((s) => s.slug === part1);

    const industry2 = part2 ? INDUSTRIES.find((i) => i.slug === part2) : null;
    const style2 = part2 ? STYLES.find((s) => s.slug === part2) : null;

    const primaryItem = engine1 || style1 || industry1;
    const secondaryItem = industry2 || style2;

    if (!primaryItem && !secondaryItem) {
        notFound();
    }

    const combinedTitle = secondaryItem ? `${primaryItem?.title} for ${secondaryItem?.title}` : primaryItem?.title;
    const content = getSEOContent(combinedTitle || "Mascot Maker");

    const isStory = slug.join("-").includes("story") || slug.join("-").includes("narrative");
    const isMix = slug.join("-").includes("mix") || slug.join("-").includes("ad");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Mascot Maker Studio",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "description": primaryItem?.description || "Mascot Maker Studio AI Application",
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to Create ${combinedTitle} with AI`,
        "description": `Step-by-step guide to creating professional ${combinedTitle?.toLowerCase()} using Mascot Maker's AI design studio.`,
        "step": content.tips.map((tip: string, i: number) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "text": tip
        }))
    };

    return (
        <div className="bg-cream min-h-screen selection:bg-candy-pink/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

            {/* Hero Section: Sophisticated & Dynamic */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-mesh-candy bg-grain">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <Breadcrumb items={[
                                { label: "Home", href: "/" },
                                { label: "Mascot Maker", href: "/explore" },
                                ...(secondaryItem ? [{ label: primaryItem?.title || "", href: `/mascot-maker/${slug[0]}` }] : []),
                                { label: secondaryItem?.title || primaryItem?.title || "" }
                            ]} />

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-foreground/5 text-[10px] font-black uppercase tracking-widest text-foreground/50">
                                Specialized AI Mode
                            </div>

                            <h1 className="font-display text-6xl md:text-[8rem] text-foreground leading-[0.85] uppercase -tracking-tight">
                                {combinedTitle} <br /><span className="text-gradient">Generator.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground font-semibold leading-relaxed max-w-xl">
                                {(primaryItem?.description || "")} {secondaryItem ? `Specially trained to output high-fidelity assets optimized for ${secondaryItem.title}. ` : ""}
                                {content.intro}
                            </p>

                            <div>
                                <Link
                                    href="/create"
                                    className="inline-flex items-center justify-center gap-4 rounded-2xl bg-foreground px-12 py-6 text-xl font-black text-white shadow-premium hover:shadow-glow-pink hover:scale-[1.02] transition-all group"
                                >
                                    <Sparkles size={24} className="text-candy-yellow group-hover:rotate-12 transition-all" />
                                    OPEN STUDIO
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className={`relative z-10 rounded-[3rem] border border-foreground/5 overflow-hidden shadow-premium bg-white p-4`}>
                                <Image
                                    src={isMix ? "/demo/landing-mix-v2.webp" : isStory ? "/demo/landing-story-v2.webp" : "/demo/hero-shiba.png"}
                                    alt={combinedTitle || "Mascot Maker Preview"}
                                    width={600}
                                    height={600}
                                    priority={true}
                                    className="w-full h-auto rounded-[2rem] object-cover"
                                />
                            </div>
                            {/* Visual Flair Elements */}
                            <div className="absolute -top-6 -right-6 animate-float">
                                <div className="p-4 glass-card rounded-2xl shadow-xl">
                                    <Palette size={32} className="text-candy-pink" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Section: Clean Content Deep-Dive */}
            <section className="py-24 bg-cream">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-3/5 space-y-10">
                            <h2 className="font-display text-5xl md:text-7xl uppercase">
                                Redefining <br /><span className="text-candy-pink">The Workflow.</span>
                            </h2>
                            <p className="text-2xl text-foreground font-bold leading-relaxed">
                                {content.benefit1} <span className="italic underline decoration-candy-yellow decoration-4 underline-offset-4">{content.benefit2}</span>
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8 pt-6">
                                {content.tips.map((tip: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-6 rounded-2xl bg-cream border border-foreground/10 shadow-sm group hover:shadow-md transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-foreground/10 group-hover:bg-candy-pink/10 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-candy-pink" />
                                        </div>
                                        <p className="text-base font-semibold text-foreground italic leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-2/5 p-12 rounded-[3.5rem] bg-secondary/20 border border-foreground/10 shadow-md">
                            <h3 className="font-display text-2xl uppercase mb-10 text-center">Studio Standard</h3>
                            <ul className="space-y-6">
                                {["Identity Consistency", "Cinematic Quality", "Commercial Rights", "Studio-Tested Prompts"].map((check, i) => (
                                    <li key={i} className="flex items-center gap-5 text-lg font-black uppercase tracking-tight text-foreground/70">
                                        <div className="w-8 h-8 rounded-full bg-white border border-foreground/5 flex items-center justify-center shrink-0">
                                            <Check size={16} className="text-candy-green stroke-[4]" />
                                        </div>
                                        {check}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA: Final Conversion */}
            <section className="py-32 bg-mesh-dark text-white relative overflow-hidden">
                <div className="container mx-auto px-6 text-center space-y-12 relative z-10">
                    <h2 className="font-display text-6xl md:text-9xl mb-8 uppercase tracking-tighter leading-none">
                        START YOUR <br /><span className="text-gradient">NEXT PROJECT.</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-5 rounded-full bg-white px-14 py-7 text-2xl font-black text-foreground hover:bg-candy-pink hover:text-white transition-all shadow-glow-pink hover:scale-105"
                    >
                        LAUNCH STUDIO <ArrowRight size={32} />
                    </Link>

                    {/* Related Links: Replaced with Modern Grid */}
                    <div className="max-w-5xl mx-auto mt-32 pt-20 border-t border-white/5 text-left">
                        <h3 className="font-display text-2xl uppercase mb-8 opacity-40">Related specialized studios</h3>
                        <div className="flex flex-wrap gap-x-10 gap-y-4">
                            {(engine1 ? INDUSTRIES : engine1 ? STYLES : INDUSTRIES).slice(0, 12).map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/mascot-maker/${part1}/${item.slug}`}
                                    className="text-xs font-black uppercase tracking-widest text-white hover:text-candy-pink transition-colors"
                                >
                                    {primaryItem?.title} for {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Background Noise/Effect */}
                <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
            </section>

            <div className="py-20 bg-cream">
                <ExploreLinks />
            </div>
        </div >
    );
}
