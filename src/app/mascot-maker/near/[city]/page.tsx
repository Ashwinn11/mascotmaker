import type { Metadata } from "next";
import { LOCATIONS } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, MapPin, Check, Camera, Monitor, Zap } from "lucide-react";

interface PageProps {
    params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;
    const location = LOCATIONS.find((l) => l.slug === city);

    if (!location) return {};

    const title = `AI Creative Studio in ${location.name}, ${location.country} | mascotmaker.io`;

    return {
        title,
        description: `The leading AI design hub for brands in ${location.name}. Generate professional characters, storyboards, and product ads for your ${location.name}-based business.`,
        alternates: {
            canonical: `https://mascotmaker.io/mascot-maker/near/${city}`,
        },
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
        "@type": "LocalBusiness",
        "name": `Mascot Maker Creative Studio ${location.name}`,
        "description": `All-in-one AI design studio for characters, icons, and storyboards in ${location.name}.`,
        "url": `https://mascotmaker.io/mascot-maker/near/${city}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": location.name,
            "addressCountry": location.country
        },
        "priceRange": "$$"
    };

    return (
        <div className="bg-cream min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-white border-b-4 border-foreground">
                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-blue/10 border-2 border-candy-blue/20 text-xs font-black uppercase tracking-widest text-candy-blue">
                                <Zap size={14} className="fill-candy-blue" /> Local Design Hub: {location.name}
                            </div>
                            <h1 className="font-display text-6xl md:text-8xl text-foreground leading-[0.9] uppercase -tracking-[0.04em] mb-8">
                                AI Creative <br /><span className="text-gradient">Studio {location.name}.</span>
                            </h1>
                            <p className="text-2xl text-muted-foreground font-bold leading-relaxed mb-10 max-w-xl">
                                Empower your {location.name} brand with high-end AI characters, storyboards, and product advertisements. mascotmaker.io is the standard for professional AI design.
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
                                        alt="Creative Workflow"
                                        fill
                                        priority={true}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest">
                                        <MapPin className="text-candy-pink" /> {location.name} Local Access
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-white border-2 border-foreground text-[10px] font-black uppercase tracking-widest text-candy-green">Verified Studio</div>
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
                            Bringing the world&apos;s most advanced character and marketing engines directly to the {location.name} creative community.
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
                </div>
            </section>
        </div>
    );
}
