import type { Metadata } from "next";
import Link from "next/link";
import { INDUSTRIES, STYLES, ENGINES, COMPETITORS, slugify } from "@/lib/seo-data";

export const metadata: Metadata = {
    title: "Mascot Maker Studio Index",
    description: "Directory of our specialized AI design studio models, industry-specific assets, and comparison guides.",
    alternates: {
        canonical: "https://mascotmaker.io/explore",
    },
    openGraph: {
        title: "Mascot Maker Studio Index",
        description: "Directory of specialized AI mascot styles and industry tools.",
        url: "https://mascotmaker.io/explore",
        siteName: "Mascot Maker",
        images: [{
          url: "https://mascotmaker.io/app-icon.png",
          width: 512,
          height: 512,
          alt: "Mascot Maker — Design Index",
        }],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Mascot Maker Index — Powered by mascotmaker.io",
        images: ["https://mascotmaker.io/app-icon.png"],
    },
};

export default function ExplorePage() {
    const sortedIndustries = [
        ...INDUSTRIES.filter(i => i.slug === "ai-startups"),
        ...INDUSTRIES.filter(i => i.slug !== "ai-startups")
    ];


    return (
        <main className="min-h-screen bg-[#0c0a09] selection:bg-candy-pink/30 text-white">
            <header className="relative py-32 bg-[#141210] border-b border-white/[0.04] overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 mb-8 animate-slide-up shadow-lg">
                        SYSTEM INDEX
                    </div>
                    <h1 className="font-display text-7xl md:text-[10rem] uppercase leading-[0.85] tracking-tight mb-8 animate-slide-up stagger-1 drop-shadow-sm">
                        Design <span className="text-candy-pink">Index.</span>
                    </h1>
                    <p className="text-2xl font-semibold text-white/50 max-w-2xl leading-relaxed animate-slide-up stagger-2">
                        A complete directory of specialized AI mascot styles, industry tools, and a 1,000+ searchable community showcase.
                    </p>
                    <div className="mt-10 flex gap-4 animate-slide-up stagger-3">
                        <Link href="/gallery" className="px-8 py-4 bg-[#1c1916] border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-candy-pink hover:text-[#0c0a09] transition-all duration-300 shadow-xl active:scale-95">
                            Explore Showcase Hub
                        </Link>
                    </div>
                </div>
            </header>

            <section className="py-32 container mx-auto max-w-7xl px-6">
                <div className="grid md:grid-cols-3 gap-24">
                    <div className="space-y-16">
                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-white/80">Engines</h2>
                            <div className="grid gap-4">
                                {ENGINES.map((e) => (
                                    <Link key={e.slug} href={`/mascot-maker/use-case/${e.slug}`} className="group flex items-center gap-4 text-xl font-black text-white/60 hover:text-candy-pink transition-all">
                                        <div className="w-1.5 h-1.5 rounded-full bg-candy-pink scale-0 group-hover:scale-100 transition-transform shadow-[0_0_8px_rgba(255,77,28,0.5)]" />
                                        {e.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-white/80">Industries</h2>
                            <div className="grid gap-3">
                                {sortedIndustries.map((i) => (
                                    <Link key={i.slug} href={`/mascot-maker/industry/${i.slug}`} className={`text-sm font-bold uppercase tracking-widest hover:text-candy-blue transition-colors ${i.slug === "ai-startups" ? "text-candy-blue drop-shadow-[0_0_8px_rgba(33,150,243,0.5)]" : "text-white/50"}`}>
                                        • {i.title} Assets
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-white/80">Art Styles</h2>
                            <div className="grid gap-3">
                                {STYLES.map((s) => (
                                    <Link key={s.slug} href={`/mascot-maker/style/${s.slug}`} className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-[#5cd85c] transition-colors">
                                        • {s.title} Design
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-white/80">Comparisons</h2>
                            <div className="grid gap-3">
                                {COMPETITORS.map((c) => (
                                    <Link key={c.slug} href={`/mascot-maker/compare/${c.slug}`} className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                                        • vs {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-white/80">Style × Industry</h2>
                            <div className="grid gap-2">
                                {STYLES.slice(0, 6).map((s) => (
                                    INDUSTRIES.slice(0, 4).map((i) => (
                                        <Link 
                                            key={`${s.slug}-${i.slug}`} 
                                            href={`/mascot-maker/style/${s.slug}/${i.slug}`} 
                                            className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-candy-pink transition-colors"
                                        >
                                            {s.title} × {i.title}
                                        </Link>
                                    ))
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
