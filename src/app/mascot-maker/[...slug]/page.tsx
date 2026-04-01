
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

            {/* ─── Hero Section: Compact & Sharp ─── */}
            <section className="relative flex items-center overflow-hidden bg-mesh-candy bg-grain pt-24 pb-16">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-candy-pink/5 to-transparent pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">

                        {/* Left: Copy */}
                        <div className="lg:col-span-7 space-y-8">
                            <Breadcrumb items={[
                                { label: "Home", href: "/" },
                                { label: "Mascot Maker", href: "/explore" },
                                ...(secondaryItem ? [{ label: primaryItem?.title || "", href: `/mascot-maker/${slug[0]}` }] : []),
                                { label: secondaryItem?.title || primaryItem?.title || "" }
                            ]} />

                            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-foreground/5 bg-cream/50 backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-candy-pink opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-candy-pink"></span>
                                </span>
                                <span className="text-[9px] font-black tracking-widest uppercase text-foreground/40 leading-none">Identity Lock™ v2.5 — Optimized Engine</span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tighter text-foreground uppercase">
                                    {combinedTitle}<br />
                                    <span className="text-candy-pink italic">Generator.</span>
                                </h1>
                                <p className="text-lg md:text-xl font-medium text-foreground/50 max-w-xl leading-relaxed">
                                    {(primaryItem?.description || "")} {secondaryItem ? `Optimized for ${secondaryItem.title} branding.` : ""} {content.intro}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link
                                    href="/create"
                                    className="group inline-flex items-center gap-4 px-10 py-5 bg-foreground text-cream rounded-2xl font-black text-lg shadow-premium hover:bg-candy-pink transition-all duration-500 hover:scale-[1.02]"
                                >
                                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                                    OPEN STUDIO
                                </Link>
                                <Link
                                    href="/gallery"
                                    className="inline-flex items-center gap-4 px-10 py-5 border border-foreground/10 text-foreground rounded-2xl font-black text-lg hover:border-candy-pink hover:text-candy-pink transition-all duration-500"
                                >
                                    EXAMPLES
                                </Link>
                            </div>
                        </div>

                        {/* Right: Asset Showcase */}
                        <div className="lg:col-span-5 relative mt-12 lg:mt-0">
                            <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-2xl bg-white p-3">
                                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                                    <Image
                                        src={(primaryItem as any)?.image || (isMix ? "/demo/before-after.webp" : isStory ? "/demo/landing-story-v2.webp" : "/demo/hero-dragon-barista.png")}
                                        alt={combinedTitle || "Mascot Maker Preview"}
                                        fill
                                        priority={true}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute top-1/2 -left-6 z-30 hidden md:block">
                                    <div className="px-4 py-3 bg-foreground text-cream rounded-xl shadow-premium">
                                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-candy-pink mb-0.5 leading-none">Identity Lock™</p>
                                      <p className="text-[10px] font-bold text-cream/50 leading-none">Same character engine</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Consistency Section ─── */}
            <section className="py-20 bg-cream border-t border-foreground/5">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="font-display text-4xl md:text-5xl leading-[0.9] tracking-tight uppercase">
                                Same character.<br />
                                <span className="text-candy-pink">Zero AI drift.</span>
                            </h2>
                            <p className="text-foreground/50 text-lg font-medium leading-relaxed max-w-lg">
                                Whether you're generating {combinedTitle?.toLowerCase()} or complex brand narratives, Identity Lock™ pins your character's exact features so they remain consistent across every scene.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                {content.stats.map((stat: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/10 border border-foreground/5">
                                        <Check size={14} className="text-candy-pink" />
                                        <span className="text-[11px] font-bold text-foreground/70 uppercase tracking-wide">{stat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-premium border border-foreground/5 rotate-[1.5deg]">
                            <Image src="/demo/landing-mix-v2.webp" alt="Process" width={500} height={500} className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Editorial Content ─── */}
            <section className="py-20 bg-cream border-t border-foreground/5">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-foreground/60">
                            <h2 className="text-4xl mb-6">What is the {combinedTitle} Designer?</h2>
                            <p className="text-xl leading-relaxed mb-8">{content.definition}</p>
                            <p className="text-lg leading-relaxed">{content.benefit1}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-display text-2xl uppercase">Best Practices</h3>
                                <ul className="space-y-3">
                                    {content.tips.map((tip: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-foreground/5 shadow-sm">
                                            <Sparkles size={14} className="text-candy-pink mt-1 flex-shrink-0" />
                                            <p className="text-[12px] font-medium text-foreground/70">{tip}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-foreground rounded-[2rem] p-8 text-cream flex flex-col justify-center space-y-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-mesh-candy opacity-10 pointer-events-none" />
                                <h3 className="font-display text-3xl uppercase relative z-10 leading-none">Production Ready.</h3>
                                <p className="text-cream/40 text-sm font-medium relative z-10">Outputs include full commercial rights. Generate once, use everywhere.</p>
                                <Link href="/create" className="bg-candy-pink text-cream px-6 py-3.5 rounded-lg font-black text-center text-sm relative z-10 hover:brightness-110 transition-all">
                                    START CREATING
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 border-t border-foreground/5">
                <div className="container mx-auto px-6">
                  <ExploreLinks />
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className="py-24 bg-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cream/20">Studio Professional Mode · Free to try</p>
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
