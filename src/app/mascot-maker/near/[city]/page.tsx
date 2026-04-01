import type { Metadata } from "next";
import { LOCATIONS } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, MapPin, Check, Camera, Monitor, Zap, ArrowRight } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";
import { Breadcrumb } from "@/components/breadcrumb";

interface PageProps {
    params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;
    const location = LOCATIONS.find((l) => l.slug === city);

    if (!location) return {};

    const title = `AI Creative Studio in ${location.name}, ${location.country} | mascotmaker.io`;

    const countryLocale = location.country === "USA" ? "en-US" : location.country === "UK" ? "en-GB" : "en";

    const description = `Create AI mascots and characters in ${location.name}. Free online mascot generator with 3D Pixar, pixel art, claymation & 12+ art styles. No design skills needed.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://mascotmaker.io/mascot-maker/near/${city}`,
            languages: {
                [countryLocale]: `https://mascotmaker.io/mascot-maker/near/${city}`,
                'x-default': `https://mascotmaker.io/mascot-maker/near/${city}`,
            },
        },
        openGraph: {
            title,
            description,
            type: "website",
            images: [`/og-image.png`],
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
    return LOCATIONS.map((l) => ({
        city: l.slug,
    }));
}

export default async function LocationPage({ params }: PageProps) {
    const { city } = await params;
    const location = LOCATIONS.find((l) => l.slug === city);

    if (!location) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Mascot Maker",
        "description": `AI mascot and character generator available for creators and businesses in ${location.name}, ${location.country}. Create consistent 3D, 2D, and animated characters.`,
        "url": `https://mascotmaker.io/mascot-maker/near/${city}`,
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "areaServed": {
            "@type": "City",
            "name": location.name,
            "containedInPlace": {
                "@type": "Country",
                "name": location.country
            }
        },
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://mascotmaker.io"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Global Hub",
                "item": "https://mascotmaker.io/mascot-maker/character-generator"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": `${location.name} Studio`,
                "item": `https://mascotmaker.io/mascot-maker/near/${city}`
            }
        ]
    };

    return (
        <div className="bg-cream min-h-screen selection:bg-candy-blue/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* Hero Section: Modern & Location-Specific */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-mesh-candy bg-grain border-b border-foreground/5">
                <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <Breadcrumb items={[
                                { label: "Home", href: "/" },
                                { label: "Global Studios", href: "/explore" },
                                { label: location.name }
                            ]} />
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-foreground/5 text-[10px] font-black uppercase tracking-widest text-foreground/50 animate-slide-up">
                                <Zap size={14} className="text-candy-blue" /> AI DEPLOYMENT: {location.name.toUpperCase()}
                            </div>
                            <h1 className="font-display text-7xl md:text-[8rem] text-foreground leading-[0.85] uppercase -tracking-tight animate-slide-up stagger-1">
                                AI Creative <br /><span className="text-gradient">Studio {location.name}.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground font-semibold leading-relaxed max-w-xl animate-slide-up stagger-2">
                                Empower your {location.name} brand with high-end AI characters, storyboards, and product advertisements. mascotmaker.io is the global standard for professional AI design.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 animate-slide-up stagger-3">
                                <Link
                                    href="/create"
                                    className="inline-flex items-center justify-center gap-4 rounded-2xl bg-foreground px-12 py-6 text-xl font-black text-white shadow-premium hover:shadow-glow-pink hover:scale-[1.02] transition-all group"
                                >
                                    <Sparkles size={24} className="text-candy-yellow group-hover:rotate-12 transition-all" />
                                    START IN {location.name.toUpperCase()}
                                </Link>
                                <Link
                                    href="/gallery"
                                    className="inline-flex items-center justify-center gap-4 rounded-2xl border border-foreground/5 bg-white/50 backdrop-blur-md px-12 py-6 text-xl font-black text-foreground hover:bg-white transition-all active:scale-95"
                                >
                                    PORTFOLIO
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative z-10 rounded-[4rem] border border-foreground/5 bg-white p-4 shadow-premium">
                                <div className="aspect-square relative rounded-[3rem] overflow-hidden">
                                    <Image
                                        src="/demo/landing-story-v2.webp"
                                        alt={`AI mascot design storyboard workflow for ${location.name} businesses and creators`}
                                        fill
                                        priority={true}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="mt-8 flex items-center justify-between px-6 pb-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                        <MapPin className="text-candy-pink" size={16} /> Available in {location.name}
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full glass-card border border-foreground/5 text-[10px] font-black uppercase tracking-widest text-candy-green">Online Studio</div>
                                </div>
                            </div>
                            {/* Decorative Flair */}
                            <div className="absolute -bottom-10 -left-10 animate-float opacity-50">
                                <Camera size={60} className="text-candy-blue/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Localized Capabilities: Premium Grid */}
            <section className="py-24 bg-cream overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="mb-24 text-center space-y-6">
                        <h2 className="font-display text-6xl md:text-[7rem] text-foreground uppercase tracking-tight leading-[0.9]">
                            Global AI Quality, <br /><span className="text-candy-pink">Local {location.name} Soul.</span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-xl text-foreground font-semibold italic leading-relaxed">
                            Bringing the world&apos;s most advanced character and marketing engines directly to the {location.name} creative community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Sparkles, title: "Character Design", desc: "Craft consistent 3D and 2D characters for your brand identity.", color: "text-candy-pink", bg: "bg-candy-pink/5" },
                            { icon: Monitor, title: "Storyboards", desc: "Generate professional 8-frame narratives in minutes, not days.", color: "text-candy-blue", bg: "bg-candy-blue/5" },
                            { icon: Camera, title: "Product Mix", desc: "Composite your products with AI characters for elite advertising.", color: "text-candy-green", bg: "bg-candy-green/5" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 p-10 rounded-[3rem] bg-white border border-foreground/10 shadow-sm hover:shadow-md transition-all">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                                    <item.icon size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-base font-semibold text-foreground italic leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA: Final Redesign */}
            <section className="py-24 bg-mesh-dark text-white relative overflow-hidden">
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

                    {/* Geo-Network Linking */}
                    <div className="max-w-5xl mx-auto mt-32 pt-20 border-t border-white/5">
                        <ExploreLinks />
                    </div>
                </div>
                <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
            </section>
        </div>
    );
}
