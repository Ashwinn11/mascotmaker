import type { Metadata } from "next";
import { COMPETITORS } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const competitor = COMPETITORS.find((c) => c.slug === slug);

    if (!competitor) return {};

    const title = `Mascot Maker vs ${competitor.name}: The Best ${competitor.type} Alternative (${new Date().getFullYear()})`;
    const description = `Comparing Mascot Maker with ${competitor.name}. Discover why Mascot Maker is the top choice for brand consistency, 3D character generation, and cinematic storyboarding.`;

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
            images: [`/api/og?title=${encodeURIComponent(`Mascot Maker vs ${competitor.name}`)}`],
        },
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
        "name": "Mascot Maker Studio",
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
        <div className="bg-cream min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-white border-b-4 border-foreground">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 text-xs font-black uppercase tracking-widest text-candy-pink">
                        Comparison Guide
                    </div>
                    <h1 className="font-display text-5xl md:text-8xl text-foreground leading-[0.9] uppercase -tracking-[0.04em] mb-8">
                        Mascot Maker <br /><span className="text-candy-blue">vs</span> {competitor.name}
                    </h1>
                    <p className="text-2xl text-muted-foreground font-bold leading-relaxed mb-12 max-w-3xl mx-auto">
                        Looking for a better alternative to {competitor.name}? While {competitor.name} is known for {competitor.strength.toLowerCase()}, Mascot Maker is built specifically for global brands requiring perfect character consistency and high-end 3D visual production.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/create"
                            className="inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-10 py-5 text-xl font-black text-white shadow-[6px_6px_0_#ff6b9d] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                        >
                            <Sparkles size={24} className="text-candy-yellow" />
                            TRY MASCOT MAKER
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Table */}
            <section className="py-32 bg-cream">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="font-display text-4xl md:text-6xl text-center mb-20 uppercase">Feature Head-to-Head</h2>
                    <div className="overflow-x-auto rounded-[2rem] border-4 border-foreground bg-white shadow-[12px_12px_0_#2d2420]">
                        <table className="w-full text-left">
                            <thead className="bg-foreground text-white">
                                <tr>
                                    <th className="p-8 font-black uppercase tracking-tight text-xl">Core Feature</th>
                                    <th className="p-8 font-black uppercase tracking-tight text-xl text-center bg-candy-pink">Mascot Maker</th>
                                    <th className="p-8 font-black uppercase tracking-tight text-xl text-center">{competitor.name}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-foreground/10 text-lg font-bold">
                                {features.map((f, i) => (
                                    <tr key={i} className="hover:bg-cream/30 transition-colors">
                                        <td className="p-8 border-r-2 border-foreground/5">
                                            {f.name}
                                            <div className="text-sm text-muted-foreground font-medium mt-1 uppercase tracking-wider">{f.notes}</div>
                                        </td>
                                        <td className="p-8 text-center border-r-2 border-foreground/5 bg-candy-pink/5">
                                            {f.mm ? <Check className="mx-auto text-candy-green stroke-[4px]" size={32} /> : <X className="mx-auto text-red-500 stroke-[4px]" size={32} />}
                                        </td>
                                        <td className="p-8 text-center">
                                            {f.comp ? <Check className="mx-auto text-candy-green stroke-[4px]" size={32} /> : <X className="mx-auto text-red-500 stroke-[4px]" size={32} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Why section */}
            <section className="py-32 bg-white border-y-4 border-foreground">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">
                                THE SMART <br /><span className="text-candy-pink">PROFESSIONAL</span> CHOICE.
                            </h2>
                            <p className="text-2xl text-muted-foreground font-bold">
                                {competitor.name} is a powerful tool, but it often fails at {competitor.weakness.toLowerCase()}. Mascot Maker was engineered to solve the most difficult problems in AI design.
                            </p>
                            <div className="grid gap-6">
                                <div className="flex gap-4 p-6 rounded-3xl bg-cream border-4 border-foreground shadow-[6px_6px_0_#2d2420]">
                                    <ShieldCheck className="text-candy-blue shrink-0" size={32} />
                                    <div>
                                        <h4 className="text-xl font-black uppercase">Identity Locking</h4>
                                        <p className="font-bold text-muted-foreground">Keep the same character across hundreds of generations. Never lose your brand DNA again.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 rounded-3xl bg-cream border-4 border-foreground shadow-[6px_6px_0_#2d2420]">
                                    <Zap className="text-candy-yellow shrink-0" size={32} />
                                    <div>
                                        <h4 className="text-xl font-black uppercase">Cinematic Workflows</h4>
                                        <p className="font-bold text-muted-foreground">Go beyond single images. Build full ad sets and storyboards in a single session.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative rounded-[3rem] border-4 border-foreground overflow-hidden shadow-[12px_12px_0_#4ea8de]">
                            <Image src="/demo/landing-story-v2.webp" alt="Mascot Maker Production" width={800} height={800} className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 bg-foreground text-white">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h3 className="font-display text-4xl md:text-6xl mb-12 uppercase italic">"I switched from {competitor.name} because I needed consistent marketing assets. Mascot Maker is 10x faster for my workflow."</h3>
                    <p className="text-xl font-black text-candy-pink uppercase tracking-widest">— Sarah J., Creative Director @ TechFlow</p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-32 bg-white border-b-4 border-foreground">
                <div className="mx-auto max-w-4xl px-6">
                    <h2 className="font-display text-4xl md:text-6xl text-center mb-16 uppercase">Common Questions</h2>
                    <div className="space-y-8">
                        <div className="p-8 rounded-3xl border-4 border-foreground hover:bg-cream transition-colors">
                            <h4 className="text-xl font-black uppercase mb-4">Is Mascot Maker better than {competitor.name}?</h4>
                            <p className="font-bold text-muted-foreground leading-relaxed">It depends on your needs. For general artistic exploration, {competitor.name} is excellent. However, for professional branding, character consistency, and production-ready visual assets, Mascot Maker provides a more specialized and reliable workflow.</p>
                        </div>
                        <div className="p-8 rounded-3xl border-4 border-foreground hover:bg-cream transition-colors">
                            <h4 className="text-xl font-black uppercase mb-4">Can I import my {competitor.name} designs?</h4>
                            <p className="font-bold text-muted-foreground leading-relaxed">Yes! You can upload your existing characters to Mascot Maker and use our Image-to-Character engine to recreate them with full identity lock parameters.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 bg-cream text-center">
                <h2 className="font-display text-6xl md:text-9xl mb-12 uppercase leading-none">READY FOR <br /><span className="text-gradient">THE UPGRADE?</span></h2>
                <Link
                    href="/create"
                    className="inline-flex items-center gap-4 rounded-full border-4 border-foreground bg-foreground px-12 py-6 text-2xl font-black text-white hover:bg-candy-pink transition-all active:scale-95 shadow-[8px_8px_0_#ffc857]"
                >
                    GET STARTED FREE <ArrowRight size={28} />
                </Link>
            </section>
        </div>
    );
}
