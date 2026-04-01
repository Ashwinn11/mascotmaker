import type { Metadata } from "next";
import Link from "next/link";
import { LOCATIONS, INDUSTRIES, STYLES, ENGINES, COMPETITORS, slugify } from "@/lib/seo-data";

export const metadata: Metadata = {
    title: "Mascot Maker Studio Index",
    description: "Directory of our specialized AI design studio models, industry-specific assets, and comparison guides.",
    alternates: {
        canonical: "https://mascotmaker.io/explore",
    },
};

export default function ExplorePage() {
    const sortedIndustries = [
        ...INDUSTRIES.filter(i => i.slug === "ai-startups"),
        ...INDUSTRIES.filter(i => i.slug !== "ai-startups")
    ];

    const sortedLocations = [
        ...LOCATIONS.filter(l => l.slug === "mumbai"),
        ...LOCATIONS.filter(l => l.slug !== "mumbai")
    ];

    return (
        <main className="min-h-screen bg-cream selection:bg-candy-pink/20">
            <header className="py-32 bg-mesh-candy bg-grain border-b border-foreground/5 overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-foreground/5 text-[10px] font-black uppercase tracking-widest text-foreground/50 mb-8 animate-slide-up">
                        SYSTEM INDEX
                    </div>
                    <h1 className="font-display text-7xl md:text-[10rem] uppercase leading-[0.85] tracking-tight mb-8 animate-slide-up stagger-1">
                        Design <span className="text-gradient">Index.</span>
                    </h1>
                    <p className="text-2xl font-semibold text-muted-foreground max-w-2xl leading-relaxed animate-slide-up stagger-2">
                        A complete directory of specialized AI mascot models, location-specific design studios, and cross-industry assets.
                    </p>
                </div>
            </header>

            <section className="py-32 container mx-auto max-w-7xl px-6">
                <div className="grid md:grid-cols-3 gap-24">
                    <div className="space-y-16">
                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-foreground/80">Engines</h2>
                            <div className="grid gap-4">
                                {ENGINES.map((e) => (
                                    <Link key={e.slug} href={`/mascot-maker/${e.slug}`} className="group flex items-center gap-4 text-xl font-black text-foreground/60 hover:text-candy-pink transition-all">
                                        <div className="w-1.5 h-1.5 rounded-full bg-candy-pink scale-0 group-hover:scale-100 transition-transform" />
                                        {e.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-foreground/80">Industries</h2>
                            <div className="grid gap-3">
                                {sortedIndustries.map((i) => (
                                    <Link key={i.slug} href={`/mascot-maker/${i.slug}`} className={`text-sm font-bold uppercase tracking-widest hover:text-candy-blue transition-colors ${i.slug === "ai-startups" ? "text-candy-blue" : "text-muted-foreground"}`}>
                                        • {i.title} Assets
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-foreground/80">Art Styles</h2>
                            <div className="grid gap-3">
                                {STYLES.map((s) => (
                                    <Link key={s.slug} href={`/mascot-maker/${s.slug}`} className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-candy-green transition-colors">
                                        • {s.title} Design
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-foreground/80">Comparisons</h2>
                            <div className="grid gap-3">
                                {COMPETITORS.map((c) => (
                                    <Link key={c.slug} href={`/mascot-maker/compare/${c.slug}`} className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                                        • vs {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-foreground/80">Global Studios</h2>
                            <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-6 custom-scrollbar">
                                {sortedLocations.map((l) => (
                                    <Link key={l.slug} href={`/mascot-maker/near/${l.slug}`} className={`text-sm font-bold uppercase tracking-widest hover:text-candy-yellow transition-colors ${l.slug === "mumbai" ? "text-candy-yellow font-black" : "text-muted-foreground"}`}>
                                        • Studio in {l.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="font-display text-4xl uppercase tracking-tight text-foreground/80">Premium Sets</h2>
                            <div className="grid gap-2">
                                {STYLES.slice(0, 3).map((s) => (
                                    INDUSTRIES.slice(0, 3).map((i) => (
                                        <Link 
                                            key={`${s.slug}-${i.slug}`} 
                                            href={`/mascot-maker/${s.slug}/${i.slug}`} 
                                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 hover:text-candy-pink transition-colors"
                                        >
                                            {s.title} &times; {i.title}
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
