import type { Metadata } from "next";
import { INDUSTRIES, STYLES, ENGINES } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Palette, Check, ArrowRight, Layers, Clapperboard, Monitor } from "lucide-react";
import { Icon3D } from "@/components/ui/icon-3d";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const engine = ENGINES.find((e) => e.slug === slug);
    const industry = INDUSTRIES.find((i) => i.slug === slug);
    const style = STYLES.find((s) => s.slug === slug);
    const item = engine || industry || style;

    if (!item) return {};

    let title = "";
    if (engine) {
        title = `${item.title} | The World's Most Powerful AI Design Hub`;
    } else if (industry) {
        title = `Best AI Creative Tools for ${item.title} | mascotmaker.io`;
    } else {
        title = `${item.title} AI Generator | Create Professional Visual Assets`;
    }

    return {
        title,
        description: item.description + " Generate professional, consistent AI assets in seconds with mascotmaker.io.",
        alternates: {
            canonical: `https://mascotmaker.io/mascot-maker/${slug}`,
        },
        openGraph: {
            title,
            description: item.description,
            images: [`/api/og?title=${encodeURIComponent(item.title)}`],
        },
    };
}

export async function generateStaticParams() {
    const paths = [...ENGINES, ...INDUSTRIES, ...STYLES].map((item) => ({
        slug: item.slug,
    }));
    return paths;
}

export default async function GenericCategoricalPage({ params }: PageProps) {
    const { slug } = await params;
    const engine = ENGINES.find((e) => e.slug === slug);
    const industry = INDUSTRIES.find((i) => i.slug === slug);
    const style = STYLES.find((s) => s.slug === slug);
    const item = engine || industry || style;

    if (!item) {
        notFound();
    }

    const isStory = slug.includes("story") || slug.includes("narrative");
    const isMix = slug.includes("mix") || slug.includes("ad") || slug.includes("product");
    const isIcon = slug.includes("icon") || slug.includes("logo");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Mascot Maker Studio",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "description": item.description,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        },
        "featureList": [
            "AI Character Generation",
            "Story Studio Narratives",
            "Mix Studio Product Ads",
            "Icon & Logo Creation"
        ]
    };

    return (
        <div className="bg-cream min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b-4 border-foreground">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-candy-pink/5 -skew-x-12 translate-x-20 pointer-events-none" />

                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 text-xs font-black uppercase tracking-widest text-candy-pink">
                                {engine ? "Advanced Engine" : industry ? "Industry Optimized" : "Style Specific"}
                            </div>
                            <h1 className="font-display text-5xl md:text-8xl text-foreground leading-[0.9] uppercase -tracking-[0.04em] mb-8">
                                {item.title} <br /><span className="text-gradient">for Professionals.</span>
                            </h1>
                            <p className="text-2xl text-muted-foreground font-bold leading-relaxed mb-10 max-w-xl">
                                {item.description} Our specialized AI workflows handle everything from character design to cinematic storyboards.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/create"
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-10 py-5 text-xl font-black text-white shadow-[6px_6px_0_#ff6b9d] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                                >
                                    <Sparkles size={24} className="text-candy-yellow" />
                                    OPEN STUDIO
                                </Link>
                                <Link
                                    href="/gallery"
                                    className="inline-flex items-center justify-center gap-3 rounded-full border-4 border-foreground bg-white px-10 py-5 text-xl font-black text-foreground shadow-[6px_6px_0_#e8ddd4] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                                >
                                    MODELS
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className={`relative z-10 rounded-[3rem] border-4 border-foreground overflow-hidden shadow-[20px_20px_0_#4ea8de] ${isMix ? 'bg-candy-green/10' : isStory ? 'bg-candy-blue/10' : ''}`}>
                                <Image
                                    src={isMix ? "/demo/landing-mix-v2.webp" : isStory ? "/demo/landing-story-v2.webp" : "/demo/hero-shiba.webp"}
                                    alt={item.title}
                                    width={600}
                                    height={600}
                                    priority={true}
                                    className="w-full h-auto object-cover p-4"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 animate-float">
                                <div className={`w-28 h-28 rounded-3xl border-4 border-foreground ${isMix ? 'bg-candy-green' : isStory ? 'bg-candy-blue' : 'bg-candy-yellow'} flex items-center justify-center shadow-[8px_8px_0_#2d2420] rotate-[12deg]`}>
                                    {isMix ? <Layers size={48} className="text-white" /> : isStory ? <Clapperboard size={48} className="text-white" /> : <Icon3D name="sparkles" size="xl" />}
                                </div>
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
                                Whether you need high-fidelity 3D characters, pixel-perfect icons, or 8-frameストーリーboards, our AI keeps your brand DNA intact throughout the process.
                            </p>
                            <ul className="space-y-4">
                                {["Identity Consistency", "Cinematic Quality", "Commercial Rights"].map((check, i) => (
                                    <li key={i} className="flex items-center gap-4 text-xl font-black uppercase tracking-tight">
                                        <div className="w-8 h-8 rounded-lg bg-white border-3 border-foreground flex items-center justify-center">
                                            <Check size={18} className="text-candy-green stroke-[4px]" />
                                        </div>
                                        {check}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative rounded-[3rem] border-4 border-foreground overflow-hidden shadow-[12px_12px_0_#2d2420]">
                            <Image src="/demo/style-showcase.webp" alt="Showcase" width={800} height={800} className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-foreground text-white">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h3 className="font-display text-4xl md:text-6xl mb-12 uppercase tracking-tighter">
                        Trusted by developers, designers, <br />and storytellers worldwide.
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["Product Ads", "SaaS Icons", "Discord Avatars", "Twitch Emotes", "Game Assets"].map((tag, i) => (
                            <span key={i} className="px-6 py-2 rounded-xl border-2 border-white/20 bg-white/5 text-xs font-black uppercase tracking-widest whitespace-nowrap">
                                {tag}
                            </span>
                        ))}
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
                </div>
            </section>
        </div>
    );
}
