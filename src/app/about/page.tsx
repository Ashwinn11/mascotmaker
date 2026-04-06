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
        title: "Community Showcase",
        description: "Join a growing hub of creators. Every published mascot, sticker pack, and logo is searchable, allowing you to find design inspiration and head-to-head style comparisons.",
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0c0a09] text-white selection:bg-candy-pink/30">
            {/* Simple Hero */}
            <section className="relative py-24 md:py-32 px-6 border-b border-white/[0.04] overflow-hidden bg-[#141210]">
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
                <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-candy-pink/5 to-transparent pointer-events-none" />
                <div className="mx-auto max-w-3xl relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full glass-dark border border-white/10 px-4 py-2 mb-8 shadow-lg">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5cd85c] animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5cd85c]">Origins</span>
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter mb-8 italic drop-shadow-sm">
                        Professional Design <br /> <span className="text-candy-pink">Without the Bottleneck.</span>
                    </h1>
                    <p className="text-xl text-white/50 font-medium max-w-xl leading-relaxed">
                        I built Mascot Maker because I was tired of AI tools that couldn&apos;t generate the same character twice. Branding needs consistency, not just random &apos;pretty&apos; images.
                    </p>
                </div>
            </section>

            {/* Story Section — No Fluff */}
            <section className="py-20 px-6 bg-[#0c0a09]">
                <div className="mx-auto max-w-2xl">
                    <div className="space-y-16">
                        <div>
                            <h2 className="font-display text-3xl uppercase tracking-tight mb-5 text-white">The Consistency Problem</h2>
                            <p className="text-white/50 text-lg font-medium leading-relaxed mb-6">
                                Most AI image generators (Midjourney, DALL-E) are fun, but they have a fatal flaw for businesses: they can&apos;t keep a face consistent. If you generate a character on Monday and try to get the same one in a different pose on Tuesday, you get a stranger. 
                            </p>
                            <p className="text-white/50 text-lg font-medium leading-relaxed">
                                We call this &ldquo;AI Drift.&rdquo; It makes traditional AI tools useless for professional brand assets. Brands don&apos;t work when the mascot&apos;s face changes every time it appears on a new landing page or sticker pack.
                            </p>
                        </div>

                        <div className="p-8 rounded-[2rem] border border-white/10 bg-[#1c1916] shadow-2xl glass-dark group hover:border-candy-pink/20 transition-all duration-500">
                            <h3 className="font-display text-2xl uppercase mb-4 text-[#5cd85c] italic flex items-center gap-3">
                                <Sparkles size={24} className="text-[#5cd85c]" />
                                Our Fix
                            </h3>
                            <p className="text-white/70 font-medium leading-relaxed">
                                Mascot Maker is a specialized studio that fixes the consistency problem. Our <strong className="text-white">Identity Lock</strong> engine encodes character DNA \u2014 facial structure, proportions, and material signatures \u2014 and preserves them across every prompt. 
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {["Logo Engines", "Sticker Packs", "Character Mascots", "Commercial Rights"].map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#5cd85c]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#5cd85c]" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-display text-3xl uppercase tracking-tight mb-5 text-white">Human Intent, AI Speed</h2>
                            <p className="text-white/50 text-lg font-medium leading-relaxed mb-6">
                                We aren&apos;t here to replace artists. We&apos;re here for the person who can&apos;t afford separate commissions for every single character pose but still needs a professional identity. 
                            </p>
                            <p className="text-white/50 text-lg font-medium leading-relaxed">
                                We focus on 8 specific art styles \u2014 from 3D Pixar to Minimalist Vector \u2014 and we built a native <strong className="text-white">AI Background Remover</strong> into the workflow.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-display text-3xl uppercase tracking-tight mb-5 text-white">The Searchable Hub</h2>
                            <p className="text-white/50 text-lg font-medium leading-relaxed mb-6">
                                Mascot Maker is more than a tool; it&apos;s a <strong className="text-white">searchable design hub</strong>. Everything you see in the <Link href="/gallery" className="text-candy-pink hover:underline">Showcase</Link> is generated using the same tools you have access to. 
                            </p>
                            <p className="text-white/50 text-lg font-medium leading-relaxed">
                                We believe the future of design is transparent, searchable, and community-powered. Explore thousands of community mascots to find the perfect style for your project.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 px-6 bg-[#141210] border-y border-white/[0.04]">
                <div className="mx-auto max-w-5xl">
                    <h2 className="font-display text-4xl md:text-5xl uppercase text-center mb-16 tracking-tight text-white drop-shadow-sm">The Standards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="flex gap-6 p-8 rounded-[2rem] border border-white/5 bg-[#1c1916] hover:border-white/20 transition-all duration-300 shadow-lg group">
                                <div className="shrink-0 w-12 h-12 rounded-[1rem] bg-[#0c0a09] border border-white/10 flex items-center justify-center group-hover:border-candy-pink/30 group-hover:shadow-[0_0_15px_rgba(255,77,28,0.3)] transition-all">
                                    <v.icon size={22} className="text-candy-pink group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg mb-2 uppercase tracking-tight text-white/90">{v.title}</h3>
                                    <p className="text-white/50 text-sm font-medium leading-relaxed">{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-24 px-6 text-center bg-[#0c0a09] relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-candy-pink/5 to-transparent pointer-events-none" />
                <div className="mx-auto max-w-2xl space-y-10 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5cd85c]/60">Free Trial · No Card · Commercial Rights</p>
                    <h2 className="font-display text-5xl md:text-7xl uppercase text-white leading-none tracking-tighter drop-shadow-sm">
                        Build your<br />
                        <span className="text-candy-pink italic">Mascot.</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-3 rounded-2xl bg-candy-pink text-[#0c0a09] px-10 py-5 text-xl font-black hover:brightness-110 transition-all duration-300 active:scale-95 shadow-glow-coral uppercase tracking-widest"
                    >
                        <Sparkles size={20} />
                        Get Started
                    </Link>

                    {/* SEO Trust Signal Links */}
                    <div className="pt-20 flex flex-wrap justify-center gap-8 opacity-20 hover:opacity-60 transition-opacity">
                        <Link href="https://www.crunchbase.com/organization/mascot-maker" target="_blank" className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-candy-pink transition-colors">
                            Crunchbase Profile
                        </Link>
                        <Link href="https://www.producthunt.com/products/mascot-maker-ai" target="_blank" className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-candy-pink transition-colors">
                            Product Hunt
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
