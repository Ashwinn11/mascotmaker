import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Zap, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "About Mascot Maker — The Story Behind the AI Design Studio",
    description: "Learn the story of how Mascot Maker was built to give every creator access to studio-quality AI character design \u2014 without the $5,000 agency fee.",
    alternates: {
        canonical: "https://mascotmaker.io/about",
    },
    openGraph: {
        title: "About Mascot Maker",
        description: "Studio-quality AI mascot generation. Built for creators, not agencies.",
        type: "website",
    },
};

const values = [
    {
        icon: Sparkles,
        title: "Same Face. Every. Time.",
        description: "Consistency is our north star. We focus on 'Identity Lock'—pinning the exact facial geometry and style so your character stays locked between generations.",
    },
    {
        icon: Zap,
        title: "Instant, Not Iterative",
        description: "Agencies take 3 weeks. We take 30 seconds. No briefs, no revisions, no invoices. Just describe it and generate.",
    },
    {
        icon: Shield,
        title: "Commercially Safe",
        description: "Every asset generated comes with full commercial use rights. Use it in ads, merchandise, apps, or pitch decks.",
    },
    {
        icon: Users,
        title: "Built for Every Creator",
        description: "Whether you\u2019re a Twitch streamer, indie game dev, SaaS founder, or marketing agency \u2014 we made this for you.",
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-cream to-white">
            {/* Hero */}
            <section className="relative py-24 md:py-32 px-6 text-center border-b-4 border-foreground">
                <div className="mx-auto max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 px-4 py-2 mb-6">
                        <Sparkles size={14} className="text-candy-pink" />
                        <span className="text-xs font-black uppercase tracking-widest text-candy-pink">Our Story</span>
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl uppercase leading-none mb-6">
                        Design Should Not Cost{" "}
                        <span className="text-gradient">$5,000</span>
                    </h1>
                    <p className="text-xl text-warm-gray font-bold max-w-2xl mx-auto leading-relaxed">
                        Mascot Maker was built out of frustration. Not the dramatic kind \u2014 just the quiet, expensive kind that every founder, creator, and solopreneur feels when they get a design agency quote.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-2xl prose prose-lg">
                    <h2 className="font-display text-3xl uppercase mb-6">The Problem We Saw</h2>
                    <p className="text-warm-gray leading-relaxed mb-6">
                        The tools that existed for AI image generation — Midjourney, Stable Diffusion, DALL-E — are genuinely impressive. But they have a fatal flaw for anyone building a brand: <strong>they cannot keep a character consistent</strong>.
                    </p>
                    <p className="text-warm-gray leading-relaxed mb-6">
                        Generate a mascot on Monday. Try to generate the same mascot on Tuesday in a different pose. You’ll get a completely different character. This is called "AI Drift" — and it’s why most AI outputs fail as serious brand assets. Brands don&apos;t work when the face of the product changes every time it appears in a new context.
                    </p>
                    <p className="text-warm-gray leading-relaxed mb-6">
                        We saw founders and streamers forced to choose between broken AI tools or $5,000 agency quotes. We didn&apos;t think that trade-off should exist.
                    </p>

                    <h2 className="font-display text-3xl uppercase mb-6 mt-12">The Human Side of AI</h2>
                    <p className="text-warm-gray leading-relaxed mb-6 italic border-l-4 border-candy-pink pl-6 py-2 bg-candy-pink/5 rounded-r-xl">
                        &quot;Mascot Maker isn&apos;t about replacing designers. It&apos;s about giving the person who can&apos;t afford a designer the power to build something consistent, professional, and uniquely theirs. We focus on the fine details—the material textures, the lighting rigs, and the logic that keeps character features locked.&quot;
                    </p>

                    <h2 className="font-display text-3xl uppercase mb-6 mt-12">What We Built</h2>
                    <p className="text-warm-gray leading-relaxed mb-6">
                        Mascot Maker is an AI design studio specifically engineered to solve the consistency problem. Our <strong>Identity Lock</strong> system encodes your character’s core traits \u2014 facial structure, color palette, body proportions, style signature \u2014 and preserves them across every generation.
                    </p>
                    <p className="text-warm-gray leading-relaxed mb-6">
                        We specialize in three core areas: <strong>Logo Generation</strong>, <strong>Sticker Packs</strong>, and consistent <strong>Brand Mascots</strong>.
                    </p>
                    <p className="text-warm-gray leading-relaxed mb-6">
                        We support <strong>8 distinct, high-end art styles</strong> \u2014 from 3D Pixar and Claymation to Minimalist Vector and Pixel Art. Whether you need a single app icon or a full character set for Discord, we deliver studio-grade results in seconds.
                    </p>
                    <p className="text-warm-gray leading-relaxed mb-6">
                        We also include a professional-grade <strong>AI Background Remover</strong>, allowing you to instantly turn any generation into a transparent asset ready for your website or app.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6 bg-white border-t-4 border-foreground">
                <div className="mx-auto max-w-5xl">
                    <h2 className="font-display text-4xl md:text-5xl uppercase text-center mb-16">What We Stand For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((v) => (
                            <div key={v.title} className="flex gap-5 p-6 rounded-2xl border-2 border-foreground/10 bg-cream hover:border-candy-pink/30 transition-all group">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-candy-pink/10 flex items-center justify-center group-hover:bg-candy-pink/20 transition-colors">
                                    <v.icon size={22} className="text-candy-pink" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg mb-2">{v.title}</h3>
                                    <p className="text-warm-gray text-sm leading-relaxed">{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center border-t-4 border-foreground bg-foreground">
                <div className="mx-auto max-w-2xl">
                    <h2 className="font-display text-4xl md:text-5xl uppercase text-white mb-6">
                        Try It For Free
                    </h2>
                    <p className="text-white/70 font-bold mb-10 text-lg">
                        No credit card. No design experience. Just describe your character and generate.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-3 rounded-full bg-candy-pink text-white px-10 py-5 text-lg font-black hover:bg-candy-pink/90 transition-all active:scale-95 shadow-[6px_6px_0_#ffffff30]"
                    >
                        <Sparkles size={20} />
                        Start Creating Free
                    </Link>
                </div>
            </section>
        </main>
    );
}
