import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Zap, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "Why we built Mascot Maker — The 'Identity Lock' Story",
    description: "Most AI generators can't make the same character twice. We built Mascot Maker to fix the consistency problem for real brands.",
    alternates: {
        canonical: "https://mascotmaker.io/about",
    },
};

const values = [
    {
        icon: Sparkles,
        title: "Exact Consistency",
        description: "We don't do 'vibe' matches. Identity Lock pins character geometry so your mascot stays the same across every pose and style.",
    },
    {
        icon: Zap,
        title: "30 Seconds, Not 3 Weeks",
        description: "Graphic designers are slow and expensive for simple mascot iterations. We deliver studio-grade renders in under 30 seconds. No briefs, just results.",
    },
    {
        icon: Shield,
        title: "Total Ownership",
        description: "What you generate is yours. Full commercial rights for ads, merchandise, and app assets, with no hidden royalties.",
    },
    {
        icon: Users,
        title: "Built for Creators",
        description: "Whether you're a solo founder or a streamer, we give you the design power of a AAA agency without the $5k invoice.",
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-cream selection:bg-candy-pink/20">
            {/* Simple Hero */}
            <section className="relative py-24 md:py-32 px-6 border-b-4 border-foreground overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-candy-pink/5 to-transparent pointer-events-none" />
                <div className="mx-auto max-w-3xl relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 px-4 py-2 mb-8">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-candy-pink"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-candy-pink">Origins</span>
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter mb-8 italic">
                        Design Should Not Cost <span className="text-candy-pink">$5,000.</span>
                    </h1>
                    <p className="text-xl text-foreground/60 font-medium max-w-xl leading-relaxed">
                        I built Mascot Maker because I was tired of AI tools that couldn&apos;t generate the same character twice. Branding needs consistency, not just random &apos;pretty&apos; images.
                    </p>
                </div>
            </section>

            {/* Story Section — No Fluff */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-2xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="font-display text-3xl uppercase tracking-tight mb-4 text-foreground/80">The Consistency Problem</h2>
                            <p className="text-foreground/60 text-lg font-medium leading-relaxed">
                                Most AI image generators (Midjourney, DALL-E) are fun, but they have a fatal flaw for businesses: they can&apos;t keep a face consistent. If you generate a character on Monday and try to get the same one in a different pose on Tuesday, you get a stranger. 
                            </p>
                            <p className="text-foreground/60 text-lg font-medium leading-relaxed mt-6">
                                We call this &ldquo;AI Drift.&rdquo; It makes traditional AI tools useless for professional brand assets. Brands don&apos;t work when the mascot&apos;s face changes every time it appears on a new landing page or sticker pack.
                            </p>
                        </div>

                        <div className="p-8 rounded-[2.5rem] border-2 border-foreground/5 bg-white shadow-premium">
                            <h3 className="font-display text-2xl uppercase mb-4 text-candy-pink italic">Our Fix</h3>
                            <p className="text-foreground/60 font-bold leading-relaxed">
                                Mascot Maker is a specialized studio that fixes the consistency problem. Our <strong>Identity Lock</strong> engine encodes character DNA \u2014 facial structure, proportions, and material signatures \u2014 and preserves them across every prompt. 
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {["Logo Engines", "Sticker Packs", "Character Mascots", "Commercial Rights"].map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-candy-pink" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-display text-3xl uppercase tracking-tight mb-4 text-foreground/80">Human Intent, AI Speed</h2>
                            <p className="text-foreground/60 text-lg font-medium leading-relaxed">
                                We aren&apos;t here to replace artists. We&apos;re here for the person who can&apos;t afford a $5,000 design agency quote but still need a professional identity. 
                            </p>
                            <p className="text-foreground/60 text-lg font-medium leading-relaxed mt-6">
                                We focus on 8 specific art styles \u2014 from 3D Pixar to Minimalist Vector \u2014 and we built a native <strong>AI Background Remover</strong> into the workflow. You get production-ready assets in under 30 seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 px-6 bg-white border-y-4 border-foreground">
                <div className="mx-auto max-w-5xl">
                    <h2 className="font-display text-4xl md:text-5xl uppercase text-center mb-16 tracking-tight">The Standards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="flex gap-6 p-8 rounded-[2rem] border-2 border-foreground/5 bg-cream hover:border-candy-pink/20 transition-all group">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-candy-pink/10 flex items-center justify-center group-hover:bg-candy-pink/20 transition-colors">
                                    <v.icon size={22} className="text-candy-pink" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg mb-2 uppercase tracking-tight text-foreground/80">{v.title}</h3>
                                    <p className="text-foreground/50 text-sm font-medium leading-relaxed">{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-24 px-6 text-center bg-foreground">
                <div className="mx-auto max-w-2xl space-y-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cream/20">Free Trial · No Card · Commercial Rights</p>
                    <h2 className="font-display text-5xl md:text-7xl uppercase text-white leading-none tracking-tighter">
                        Build your<br />
                        <span className="text-candy-pink italic">Mascot.</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-3 rounded-full bg-candy-pink text-white px-10 py-5 text-xl font-black hover:bg-candy-pink/90 transition-all active:scale-95 shadow-[6px_6px_0_#ffffff30] uppercase tracking-tighter"
                    >
                        <Sparkles size={20} />
                        Get Started
                    </Link>
                </div>
            </section>
        </main>
    );
}
