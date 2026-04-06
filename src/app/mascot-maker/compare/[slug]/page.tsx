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

export const revalidate = 86400; // 24h — competitor data changes rarely


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const competitor = COMPETITORS.find((c) => c.slug === slug);

    if (!competitor) return {};

    const title = `Mascot Maker vs ${competitor.name} (2026) — Honest Feature Comparison`;
    const description = `Compare Mascot Maker with ${competitor.name}. See how identity consistency, logo creation, and sticker pack generation stack up. Honest side-by-side feature breakdown.`;

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
    return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export default async function ComparisonPage({ params }: PageProps) {
    const { slug } = await params;
    const competitor = COMPETITORS.find((c) => c.slug === slug);

    if (!competitor) {
        notFound();
    }

    const features = [
        { name: "Character Consistency", mm: true, comp: false, notes: "Mascot Maker's Identity Lock™ pins facial DNA. Most general generators drift between poses." },
        { name: "AI Sticker Pack Sets", mm: true, comp: false, notes: "Generate 12+ cohesive reactions from a single character in one click." },
        { name: "Vector-Ready Logo Logic", mm: true, comp: true, notes: "Our engine is tuned specifically for minimalist marks, not just 'pretty pictures'." },
        { name: "Studio Background Removal", mm: true, comp: competitor.name === "Canva", notes: "Precision cutouts at 4K resolution. No manual cleanup needed in Photoshop." },
        { name: "Full Commercial Rights", mm: true, comp: true, notes: "You own what you generate. No complex enterprise licensing required." },
        { name: "Simplified Studio UI", mm: true, comp: competitor.name === "Canva", notes: "Zero learning curve. No layering or manual 'masking' skills needed." },
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
        <div className="bg-[#0c0a09] min-h-screen text-white selection:bg-candy-blue/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
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
                                    "text": "Yes, Mascot Maker offers a free tier that includes access to the Mascot Generator, Logo Maker, and Sticker Pack Studio. Premium features like 4K upscaling, transparent PNG exports, and batch processing are available with an upgrade."
                                }
                            }
                        ]
                    })
                }}
            />

            {/* Hero Section: Comparison Context */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#141210] border-b border-white/[0.04]">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
                <div className="container mx-auto px-6 text-center space-y-10 relative z-10">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Comparisons", href: "/explore" },
                        { label: `vs ${competitor.name}` }
                    ]} />
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#5cd85c] animate-slide-up shadow-sm">
                        PLATFORM HEAD-TO-HEAD
                    </div>
                    <h1 className="font-display text-7xl md:text-[10rem] text-white leading-[0.85] uppercase tracking-tighter animate-slide-up stagger-1 drop-shadow-sm">
                        Mascot Maker <br /><span className="text-candy-blue">vs</span> {competitor.name}.
                    </h1>
                    <p className="text-xl md:text-2xl text-white/50 font-medium leading-relaxed max-w-3xl mx-auto animate-slide-up stagger-2">
                        Looking for a better alternative to {competitor.name}? While they are known for {competitor.strength.toLowerCase()}, Mascot Maker is built specifically for global brands requiring perfect character consistency.
                    </p>
                    <div className="flex justify-center pt-8 animate-slide-up stagger-3">
                        <Link
                            href="/create"
                            className="inline-flex items-center justify-center gap-4 rounded-2xl bg-candy-blue px-12 py-6 text-xl font-black text-[#0c0a09] shadow-[0_0_20px_rgba(33,150,243,0.3)] hover:shadow-[0_0_30px_rgba(33,150,243,0.5)] hover:bg-[#3cacff] active:scale-95 transition-all duration-300 group"
                        >
                            <Sparkles size={24} className="text-[#0c0a09] group-hover:rotate-12 transition-all" />
                            TRY MASCOT MAKER
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Table: Refined & Clean */}
            <section className="py-24 bg-[#0c0a09]">
                <div className="container mx-auto max-w-5xl px-6">
                    <h2 className="font-display text-5xl md:text-7xl text-center mb-24 uppercase italic text-white drop-shadow-sm">Feature Check</h2>
                    <div className="overflow-x-auto rounded-[3.5rem] border border-white/10 bg-[#141210] shadow-2xl glass-dark">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#1c1916] text-white/80 border-b border-white/10">
                                    <th className="p-10 font-display text-2xl md:text-3xl uppercase tracking-tight">Capabilities</th>
                                    <th className="p-10 font-display text-2xl md:text-3xl uppercase tracking-tight text-center bg-candy-blue/[0.05] text-candy-blue">Mascot Maker</th>
                                    <th className="p-10 font-display text-2xl md:text-3xl uppercase tracking-tight text-center">{competitor.name}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-lg font-medium text-white/80">
                                {features.map((f, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-10 border-r border-white/5">
                                            <div className="text-white font-bold">{f.name}</div>
                                            <div className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-3 leading-relaxed">{f.notes}</div>
                                        </td>
                                        <td className="p-10 text-center border-r border-white/5 bg-candy-blue/[0.02]">
                                            {f.mm ? <Check className="mx-auto text-[#5cd85c] stroke-[4] drop-shadow-[0_0_5px_rgba(92,216,92,0.4)]" size={28} /> : <X className="mx-auto text-red-500 stroke-[4]" size={28} />}
                                        </td>
                                        <td className="p-10 text-center">
                                            {f.comp ? <Check className="mx-auto text-white/50 stroke-[4]" size={28} /> : <X className="mx-auto text-red-500/50 stroke-[4]" size={28} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Time & Cost ROI */}
            <section className="py-24 bg-[#141210] border-t border-white/[0.04]">
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="text-center mb-20">
                        <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight text-white drop-shadow-sm">Time & Cost Advantage</h2>
                        <p className="text-white/50 font-medium text-lg mt-6 max-w-2xl mx-auto">
                            See how Mascot Maker compares to {competitor.name} when it comes to speed of execution and budget.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-10 md:p-12 rounded-[3rem] border border-white/10 bg-[#1c1916] space-y-10 shadow-lg glass-dark">
                            <h3 className="font-display text-3xl uppercase tracking-tight text-white/40">{competitor.name} Reality</h3>
                            <ul className="space-y-8">
                                <li className="flex flex-col gap-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30">Time to consistent character</span>
                                    <span className="text-xl font-bold text-white/70">Hours of manual reprompting</span>
                                </li>
                                <li className="flex flex-col gap-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30">Cost barrier</span>
                                    <span className="text-xl font-bold text-white/70">Often requires $20-$30/mo subscription just to start</span>
                                </li>
                                <li className="flex flex-col gap-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30">Hidden friction</span>
                                    <span className="text-xl font-bold text-white/70">Steep learning curve for exact seeding & weight control</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-10 md:p-12 rounded-[3rem] border border-candy-blue/20 bg-candy-blue/[0.03] shadow-[0_0_30px_rgba(33,150,243,0.05)] space-y-10 relative overflow-hidden glass-dark">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-candy-blue/10 rounded-full blur-[40px] pointer-events-none" />
                            <h3 className="font-display text-3xl uppercase tracking-tight text-candy-blue drop-shadow-[0_0_8px_rgba(33,150,243,0.5)]">Mascot Maker ROI</h3>
                            <ul className="space-y-8 relative z-10">
                                <li className="flex flex-col gap-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30">Time to consistent character</span>
                                    <span className="text-xl font-bold text-white">~30 seconds with Identity Lock™</span>
                                </li>
                                <li className="flex flex-col gap-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30">Cost barrier</span>
                                    <span className="text-xl font-bold flex items-center gap-3">
                                        <div className="px-3 py-1 rounded bg-[#5cd85c]/10 border border-[#5cd85c]/20 text-[#5cd85c] text-[10px] uppercase tracking-widest font-black shadow-sm">Free</div> 
                                        <span className="text-white">5 credits on signup</span>
                                    </span>
                                </li>
                                <li className="flex flex-col gap-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30">Hidden friction</span>
                                    <span className="text-xl font-bold text-white">Zero. Click, generate, download.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why section: Deep Dive */}
            <section className="py-32 bg-[#0c0a09] overflow-hidden border-t border-white/[0.04]">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2 space-y-12">
                            <h2 className="font-display text-6xl md:text-8xl uppercase leading-[0.9] text-white drop-shadow-sm">
                                THE SMART <br /><span className="text-candy-pink">PROFESSIONAL</span> CHOICE.
                            </h2>
                            <p className="text-2xl text-white/50 font-medium italic leading-relaxed">
                                {competitor.name} is a powerful tool, but it often fails at {competitor.weakness.toLowerCase()}. Mascot Maker was engineered to solve the most difficult problems in AI design.
                            </p>
                            <div className="grid gap-6 pt-6">
                                {[
                                    { icon: ShieldCheck, title: "Identity Locking", desc: "Keep the same character DNA across logos, stickers, and mascots. Never lose your brand consistency.", color: "text-candy-blue", bg: "bg-[#141210] border border-white/5" },
                                    { icon: Zap, title: "Professional Assets", desc: "Go beyond single images. Build full sticker sets and logo variations in a single session.", color: "text-[#5cd85c]", bg: "bg-[#141210] border border-white/5" }
                                ].map((item, i) => (
                                    <div key={i} className={`flex gap-6 p-10 rounded-[2.5rem] ${item.bg} shadow-lg hover:border-white/10 transition-colors`}>
                                        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 ${item.color} flex items-center justify-center shrink-0`}>
                                            <item.icon size={28} />
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-xl font-black uppercase tracking-tight text-white">{item.title}</h4>
                                            <p className="text-base font-medium text-white/60 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl p-4 bg-[#1c1916] glass-dark">
                                <Image src="/demo/character-consistency.webp" alt={`Mascot Maker AI logo and sticker pack production workflow compared to ${competitor.name}`} width={800} height={800} className="w-full h-auto rounded-[2rem] border border-white/5" />
                            </div>
                            {/* Decorative Flair */}
                            <div className="absolute -bottom-10 -left-10 animate-float">
                                <Camera size={60} className="text-candy-blue drop-shadow-[0_0_15px_rgba(33,150,243,0.5)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Choose Section: Dual Cards */}
            <section className="py-32 bg-[#141210] border-t border-white/[0.04]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h3 className="font-display text-4xl md:text-5xl mb-16 uppercase text-center tracking-tight leading-none italic text-white drop-shadow-sm">Decision Guide.</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-10 rounded-[3rem] border border-white/5 bg-[#1c1916] space-y-8 shadow-lg">
                            <h4 className="text-2xl font-display uppercase tracking-tight text-white/60">Choose {competitor.name} if:</h4>
                            <ul className="space-y-6">
                                {[
                                    `You need ${competitor.strength.toLowerCase()}`,
                                    "You're creating one-off artistic images",
                                    "Character consistency isn't critical"
                                ].map((li, i) => (
                                    <li key={i} className="flex items-center gap-5 text-sm font-black uppercase tracking-widest text-white/40">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 shrink-0" />
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-10 rounded-[3rem] border border-candy-blue/20 bg-candy-blue/[0.02] shadow-[0_0_20px_rgba(33,150,243,0.05)] space-y-8 glass-dark relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-candy-blue/10 rounded-full blur-3xl pointer-events-none" />
                            <h4 className="text-2xl font-display uppercase tracking-tight text-candy-blue drop-shadow-[0_0_8px_rgba(33,150,243,0.5)] relative z-10">Choose Mascot Maker if:</h4>
                            <ul className="space-y-6 relative z-10">
                                {[
                                    "You need the same character in every image",
                                    "You're building brand assets at scale",
                                    "You need logos, stickers, and mascots"
                                ].map((li, i) => (
                                    <li key={i} className="flex items-center gap-5 text-sm font-black uppercase tracking-widest text-white/80">
                                        <div className="w-2.5 h-2.5 rounded-full bg-candy-blue shadow-[0_0_8px_rgba(33,150,243,0.8)] shrink-0" />
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA: Premium Upgrade */}
            <section className="py-32 bg-[#0c0a09] border-t border-white/[0.04] text-white relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-candy-blue/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 space-y-12">
                    <h2 className="font-display text-6xl md:text-[10rem] mb-12 uppercase leading-[0.85] tracking-tighter drop-shadow-sm">READY FOR <br /><span className="text-candy-blue italic">THE UPGRADE?</span></h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-5 rounded-3xl bg-candy-blue px-14 py-7 text-2xl font-black text-[#0c0a09] hover:bg-[#3cacff] transition-all shadow-[0_0_20px_rgba(33,150,243,0.3)] hover:shadow-[0_0_30px_rgba(33,150,243,0.5)] active:scale-95 uppercase tracking-wide"
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
                                    className="px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:border-candy-blue hover:text-candy-blue transition-colors bg-[#141210] hover:bg-candy-blue/5"
                                >
                                    vs {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <ExploreLinks />
        </div>
    );
}
