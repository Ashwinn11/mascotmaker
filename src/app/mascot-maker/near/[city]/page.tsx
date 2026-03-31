import type { Metadata } from "next";
import { LOCATIONS } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, MapPin, Check, Camera, Monitor, Zap } from "lucide-react";
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
        <div className="bg-cream min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-white border-b-4 border-foreground">
                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Breadcrumb items={[
                                { label: "Home", href: "/" },
                                { label: "Global Studios", href: "/explore" },
                                { label: location.name }
                            ]} />
                            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-blue/10 border-2 border-candy-blue/20 text-xs font-black uppercase tracking-widest text-candy-blue">
                                <Zap size={14} className="fill-candy-blue" /> AI Design Studio: {location.name}
                            </div>
                            <h1 className="font-display text-6xl md:text-8xl text-foreground leading-[0.9] uppercase -tracking-[0.04em] mb-8">
                                AI Creative <br /><span className="text-gradient">Studio {location.name}.</span>
                            </h1>



                            <p className="text-2xl text-muted-foreground font-bold leading-relaxed mb-10 max-w-xl">
                                Empower your {location.name} brand with high-end AI characters, storyboards, and product advertisements. mascotmaker.io is the global standard for professional AI design, <span className="text-candy-blue">deployed locally for {location.name} businesses.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/create"
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-10 py-5 text-xl font-black text-white shadow-[6px_6px_0_#4ea8de] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                                >
                                    <Sparkles size={24} className="text-candy-yellow" />
                                    START IN {location.name.toUpperCase()}
                                </Link>
                                <Link
                                    href="/gallery"
                                    className="inline-flex items-center justify-center gap-3 rounded-full border-4 border-foreground bg-white px-10 py-5 text-xl font-black text-foreground shadow-[6px_6px_0_#e8ddd4] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                                >
                                    PORTFOLIO
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative z-10 rounded-[3rem] border-4 border-foreground bg-candy-purple/5 p-8 shadow-[20px_20px_0_#2d2420]">
                                <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-foreground shadow-xl">
                                    <Image
                                        src="/demo/landing-story-v2.webp"
                                        alt={`AI mascot design storyboard workflow for ${location.name} businesses and creators`}
                                        fill
                                        priority={true}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest">
                                        <MapPin className="text-candy-pink" /> Available in {location.name}
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-white border-2 border-foreground text-[10px] font-black uppercase tracking-widest text-candy-green">Online Studio</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Localized Capabilities */}
            <section className="py-32 bg-cream overflow-hidden">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-20 text-center">
                        <h2 className="font-display text-5xl md:text-8xl text-foreground uppercase -tracking-tight mb-6">
                            Global AI Quality, <br /><span className="text-candy-pink">Local {location.name} Soul.</span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-bold italic">
                            Bringing the world&apos;s most advanced character and marketing engines directly to the {location.name} creative community. <span className="text-candy-pink underline decoration-2">Every tool is manually stress-tested for {location.name.toUpperCase()} brand workflows.</span>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { icon: Sparkles, title: "Character Design", desc: "Craft consistent 3D and 2D characters for your brand identity." },
                            { icon: Monitor, title: "Storyboards", desc: "Generate professional 8-frame narratives in minutes, not days." },
                            { icon: Camera, title: "Product Mix", desc: "Composite your products with AI characters for elite advertising." }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] border-4 border-foreground bg-white shadow-[12px_12px_0_#2d2420]">
                                <div className="w-16 h-16 rounded-2xl border-4 border-foreground bg-candy-blue flex items-center justify-center text-white mb-8 shadow-[4px_4px_0_#2d2420]">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="font-display text-3xl mb-4 uppercase">{item.title}</h3>
                                <p className="text-muted-foreground font-bold leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Verification Tagline */}
            <section className="py-20 bg-white border-t-4 border-foreground overflow-hidden">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h2 className="font-display text-6xl md:text-7xl mb-12 uppercase leading-none">
                        THE FUTURE OF <br /><span className="text-gradient">DESIGN IS HERE.</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-4 rounded-full border-4 border-foreground bg-foreground px-12 py-6 text-2xl font-black text-white hover:bg-candy-pink transition-all active:scale-95 shadow-[8px_8px_0_#ffc857]"
                    >
                        LAUNCH GENERATOR
                    </Link>

                    {/* Geo-Network Linking */}
                    <div className="mt-20 pt-12 border-t-2 border-foreground/5">
                        <ExploreLinks />
                    </div>
                </div>
            </section>
        </div>
    );
}
