import type { Metadata } from "next";
import { INDUSTRIES, STYLES, ENGINES, getSEOContent } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Palette, Check, ArrowRight } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";

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
        title = `${primaryItem.title} for ${secondaryItem.title} | mascotmaker.io`;
        description = `Create professional ${primaryItem.title} assets tailored for ${secondaryItem.title} with Mascot Maker. Consistent, studio-quality AI generation.`;
    } else if (engine1) {
        title = `${primaryItem.title} | The World's Most Powerful AI Design Hub`;
        description = primaryItem.description;
    } else if (industry1) {
        title = `Best AI Creative Tools for ${primaryItem.title} | mascotmaker.io`;
        description = primaryItem.description;
    } else {
        title = `${primaryItem.title} AI Generator | Create Professional Visual Assets`;
        description = primaryItem.description;
    }

    const canonicalPath = slug.join('/');

    return {
        title,
        description: description + " Generate professional, consistent AI assets in seconds.",
        alternates: {
            canonical: `https://mascotmaker.io/mascot-maker/${canonicalPath}`,
        },
        openGraph: {
            title,
            description,
            images: [`/api/og?title=${encodeURIComponent(title)}`],
        },
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

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.tips.map((tip: string, i: number) => ({
            "@type": "Question",
            "name": `Pro Tip #${i + 1} for ${combinedTitle}`,
            "acceptedAnswer": { "@type": "Answer", "text": tip }
        }))
    };

    return (
        <div className="bg-cream min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b-4 border-foreground">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-candy-pink/5 -skew-x-12 translate-x-20 pointer-events-none" />

                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 text-xs font-black uppercase tracking-widest text-candy-pink">
                                Advanced Specialized Model
                            </div>
                            <h1 className="font-display text-5xl md:text-8xl text-foreground leading-[0.9] uppercase -tracking-[0.04em] mb-8">
                                {combinedTitle} <br /><span className="text-gradient">for Professionals.</span>
                            </h1>

                            <p className="text-2xl text-muted-foreground font-bold leading-relaxed mb-10 max-w-xl">
                                {(primaryItem?.description || "")} {secondaryItem ? `Specially trained to output high-fidelity assets optimized for ${secondaryItem.title}. ` : ""}
                                {content.intro}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/create"
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-10 py-5 text-xl font-black text-white shadow-[6px_6px_0_#ff6b9d] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                                >
                                    <Sparkles size={24} className="text-candy-yellow" />
                                    OPEN STUDIO
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className={`relative z-10 rounded-[3rem] border-4 border-foreground overflow-hidden shadow-[20px_20px_0_#4ea8de] ${isMix ? 'bg-candy-green/10' : isStory ? 'bg-candy-blue/10' : ''}`}>
                                <Image
                                    src={isMix ? "/demo/landing-mix-v2.webp" : isStory ? "/demo/landing-story-v2.webp" : "/demo/hero-shiba.webp"}
                                    alt={combinedTitle || "Mascot Maker Preview"}
                                    width={600}
                                    height={600}
                                    priority={true}
                                    className="w-full h-auto object-cover p-4 bg-white/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Deep-Dive */}
            <section className="py-32 bg-cream">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">
                                UNLOCK THE <br /><span className="text-candy-pink">FULL WORKFLOW.</span>
                            </h2>
                            <p className="text-2xl text-muted-foreground font-bold">
                                {content.benefit1} <span className="italic underline decoration-candy-yellow">{content.benefit2}</span>
                            </p>

                            <div className="mt-12 space-y-6">
                                <h3 className="text-candy-pink uppercase tracking-widest text-xs font-black">Expert Creation Tips</h3>
                                {content.tips.map((tip: string, i: number) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full border-2 border-candy-pink/30 flex items-center justify-center shrink-0 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-candy-pink" />
                                        </div>
                                        <p className="text-foreground font-bold italic">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ul className="space-y-4">
                            {["Identity Consistency", "Cinematic Quality", "Commercial Rights", "Studio-Tested Prompts"].map((check, i) => (
                                <li key={i} className="flex items-center gap-4 text-xl font-black uppercase tracking-tight">
                                    <div className="w-8 h-8 rounded-lg bg-white border-3 border-foreground flex items-center justify-center">
                                        <Check size={18} className="text-candy-green stroke-[4px]" />
                                    </div>
                                    {check}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-white border-y-4 border-foreground overflow-hidden relative">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h2 className="font-display text-6xl md:text-8xl mb-8 uppercase leading-none">
                        START YOUR <br /><span className="text-gradient">NEXT PROJECT.</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-4 rounded-full border-4 border-foreground bg-foreground px-12 py-6 text-2xl font-black text-white hover:bg-candy-pink transition-all active:scale-95 shadow-[8px_8px_0_#ffc857]"
                    >
                        LAUNCH STUDIO <ArrowRight size={28} />
                    </Link>

                    <div className="mt-20 pt-12 border-t-2 border-foreground/5">
                        <ExploreLinks />
                    </div>
                </div>
            </section>
        </div >
    );
}
