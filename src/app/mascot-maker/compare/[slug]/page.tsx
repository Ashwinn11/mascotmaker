import type { Metadata } from "next";
import { COMPETITORS } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, MapPin, Check, Camera, Monitor, Zap, ArrowRight, X, ShieldCheck, Layers } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";
import { Breadcrumb } from "@/components/breadcrumb";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const competitor = COMPETITORS.find((c) => c.slug === slug);

    if (!competitor) return {};

    const title = `Mascot Maker vs ${competitor.name} (2026) — Honest Feature Comparison`;
    const description = `Compare Mascot Maker with ${competitor.name}. See how identity consistency, storyboard workflows, and 3D product ads stack up. Honest side-by-side feature breakdown.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://mascotmaker.io/mascot-maker/compare/${slug}`,
            languages: {
                'en-US': `https://mascotmaker.io/mascot-maker/compare/${slug}`,
                'x-default': `https://mascotmaker.io/mascot-maker/compare/${slug}`,
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
    return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export default async function ComparisonPage({ params }: PageProps) {
    const { slug } = await params;
    const competitor = COMPETITORS.find((c) => c.slug === slug);

    if (!competitor) {
        notFound();
    }

    const features = [
        { name: "Character Consistency", mm: true, comp: false, notes: "Mascot Maker uses Identity Lock technology." },
        { name: "8-Frame Storyboarding", mm: true, comp: false, notes: "Native workflow in Story Studio." },
        { name: "3D Product Ad Compositing", mm: true, comp: false, notes: "Mix Studio specialized features." },
        { name: "General Art Generation", mm: true, comp: true, notes: "Both produce high-quality visuals." },
        { name: "Commercial Usage Rights", mm: true, comp: true, notes: "Pro plans include full rights." },
        { name: "Ease of Use", mm: true, comp: competitor.name === "Canva", notes: competitor.name === "Canva" ? "Both are beginner friendly." : "Mascot Maker has a streamlined UI." },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Mascot Maker",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "description": `The professional alternative to ${competitor.name} for AI character generation and brand design.`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="bg-cream min-h-screen selection:bg-candy-blue/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `Is Mascot Maker better than ${competitor.name}?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `It depends on your needs. For general artistic exploration, ${competitor.name} is excellent. However, for professional branding, character consistency, and production-ready visual assets, Mascot Maker provides a more specialized and reliable workflow.`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `Can I import my ${competitor.name} designs into Mascot Maker?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes! You can upload your existing characters to Mascot Maker and use our Image-to-Character engine to recreate them with full identity lock parameters."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `Is Mascot Maker free to use?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes, Mascot Maker offers a free tier that includes access to the Character Generator and basic export options. Premium features like 4K upscaling, GIF animation, and batch exports are available with an upgrade."
                            }
                        }
                    ]
                }) }}
            />

            {/* Hero Section: Comparison Context */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-mesh-candy bg-grain border-b border-foreground/5">
                <div className="container mx-auto px-6 text-center space-y-10 relative z-10">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Comparisons", href: "/explore" },
                        { label: `vs ${competitor.name}` }
                    ]} />
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-foreground/5 text-[10px] font-black uppercase tracking-widest text-foreground/50 animate-slide-up">
                        PLATFORM HEAD-TO-HEAD
                    </div>
                    <h1 className="font-display text-7xl md:text-[10rem] text-foreground leading-[0.85] uppercase -tracking-tight animate-slide-up stagger-1">
                        Mascot Maker <br /><span className="text-candy-blue">vs</span> {competitor.name}.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-semibold leading-relaxed max-w-3xl mx-auto animate-slide-up stagger-2">
                        Looking for a better alternative to {competitor.name}? While they are known for {competitor.strength.toLowerCase()}, Mascot Maker is built specifically for global brands requiring perfect character consistency.
                    </p>
                    <div className="flex justify-center pt-6 animate-slide-up stagger-3">
                        <Link
                            href="/create"
                            className="inline-flex items-center justify-center gap-4 rounded-2xl bg-foreground px-12 py-6 text-xl font-black text-white shadow-premium hover:shadow-glow-pink hover:scale-[1.02] transition-all group"
                        >
                            <Sparkles size={24} className="text-candy-yellow group-hover:rotate-12 transition-all" />
                            TRY MASCOT MAKER
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Table: Refined & Clean */}
            <section className="py-24 bg-cream">
                <div className="container mx-auto max-w-5xl px-6">
                    <h2 className="font-display text-5xl md:text-7xl text-center mb-24 uppercase italic">Feature Check</h2>
                    <div className="overflow-x-auto rounded-[3.5rem] border border-foreground/5 bg-cream/40 shadow-premium">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-foreground text-white">
                                    <th className="p-10 font-display text-2xl uppercase tracking-tight">Capabilities</th>
                                    <th className="p-10 font-display text-2xl uppercase tracking-tight text-center bg-candy-pink">Mascot Maker</th>
                                    <th className="p-10 font-display text-2xl uppercase tracking-tight text-center">{competitor.name}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-t border-foreground/5 text-lg font-semibold">
                                {features.map((f, i) => (
                                    <tr key={i} className="hover:bg-white/50 transition-colors">
                                        <td className="p-10 border-r border-foreground/5">
                                            <div className="text-foreground/80">{f.name}</div>
                                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2">{f.notes}</div>
                                        </td>
                                        <td className="p-10 text-center border-r border-foreground/5 bg-candy-pink/[0.02]">
                                            {f.mm ? <Check className="mx-auto text-candy-green stroke-[4]" size={28} /> : <X className="mx-auto text-red-400 stroke-[4]" size={28} />}
                                        </td>
                                        <td className="p-10 text-center">
                                            {f.comp ? <Check className="mx-auto text-candy-green stroke-[4]" size={28} /> : <X className="mx-auto text-red-500 stroke-[4]" size={28} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Why section: Deep Dive */}
            <section className="py-24 bg-cream overflow-hidden">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2 space-y-12">
                            <h2 className="font-display text-6xl md:text-8xl uppercase leading-[0.9]">
                                THE SMART <br /><span className="text-candy-pink">PROFESSIONAL</span> CHOICE.
                            </h2>
                            <p className="text-2xl text-muted-foreground font-semibold italic opacity-80 leading-relaxed">
                                {competitor.name} is a powerful tool, but it often fails at {competitor.weakness.toLowerCase()}. Mascot Maker was engineered to solve the most difficult problems in AI design.
                            </p>
                            <div className="grid gap-6 pt-6">
                                {[
                                    { icon: ShieldCheck, title: "Identity Locking", desc: "Keep the same character across hundreds of generations. Never lose your brand DNA again.", color: "text-candy-blue", bg: "bg-candy-blue/5" },
                                    { icon: Zap, title: "Cinematic Workflows", desc: "Go beyond single images. Build full ad sets and storyboards in a single session.", color: "text-candy-yellow", bg: "bg-candy-yellow/5" }
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
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 rounded-[4rem] border border-foreground/10 overflow-hidden shadow-premium p-4 bg-white">
                                <Image src="/demo/landing-story-v2.webp" alt={`Mascot Maker AI storyboard production workflow compared to ${competitor.name}`} width={800} height={800} className="w-full h-auto rounded-[3rem]" />
                            </div>
                            {/* Decorative Flair */}
                            <div className="absolute -bottom-10 -left-10 animate-float">
                                <Camera size={60} className="text-candy-blue" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Choose Section: Dual Cards */}
            <section className="py-24 bg-secondary/5">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h3 className="font-display text-4xl md:text-5xl mb-16 uppercase text-center tracking-tight leading-none italic">Decision Guide.</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[3rem] border border-foreground/5 bg-cream/80 space-y-6">
                            <h4 className="text-xl font-display uppercase tracking-tight text-candy-blue">Choose {competitor.name} if:</h4>
                            <ul className="space-y-4">
                                {[
                                    `You need ${competitor.strength.toLowerCase()}`,
                                    "You're creating one-off artistic images",
                                    "Character consistency isn't critical"
                                ].map((li, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-tight text-foreground/60">
                                        <div className="w-2 h-2 rounded-full bg-candy-blue" />
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-8 rounded-[3rem] border border-candy-pink/10 bg-candy-pink/[0.02] shadow-premium space-y-6">
                            <h4 className="text-xl font-display uppercase tracking-tight text-candy-pink">Choose Mascot Maker if:</h4>
                            <ul className="space-y-4">
                                {[
                                    "You need the same character in every image",
                                    "You're building brand assets at scale",
                                    "You need storyboards and product ads"
                                ].map((li, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-tight text-foreground/80">
                                        <div className="w-2 h-2 rounded-full bg-candy-pink" />
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA: Premium Upgrade */}
            <section className="py-32 bg-mesh-dark text-white relative overflow-hidden text-center">
                <div className="container mx-auto px-6 relative z-10 space-y-12">
                    <h2 className="font-display text-6xl md:text-[10rem] mb-12 uppercase leading-[0.85] tracking-tighter">READY FOR <br /><span className="text-gradient">THE UPGRADE?</span></h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-5 rounded-full bg-white px-14 py-7 text-2xl font-black text-foreground hover:bg-candy-pink hover:text-white transition-all shadow-glow-pink hover:scale-105"
                    >
                        GET STARTED FREE <ArrowRight size={32} />
                    </Link>

                    {/* Cross-links: Clean Grid */}
                    <div className="max-w-3xl mx-auto mt-32 pt-20 border-t border-white/5 space-y-8">
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-white/30">Other Comparison Guides</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {COMPETITORS.filter(c => c.slug !== slug).map(c => (
                                <Link
                                    key={c.slug}
                                    href={`/mascot-maker/compare/${c.slug}`}
                                    className="px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-candy-pink hover:text-candy-pink transition-colors"
                                >
                                    vs {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
            </section>
            
            <div className="py-20 bg-cream">
                <ExploreLinks />
            </div>
        </div>
    );
}
