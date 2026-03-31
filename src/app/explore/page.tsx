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
            <header className="py-20 bg-white border-b-4 border-foreground overflow-hidden">
                <div className="mx-auto max-w-7xl px-6">
                    <h1 className="font-display text-6xl md:text-9xl uppercase leading-none mb-8">
                        Design <span className="text-candy-pink underline decoration-candy-yellow">Index</span>
                    </h1>
                    <p className="text-2xl font-bold text-muted-foreground max-w-2xl">
                        A complete directory of all specialized AI mascot models, location-specific design studios, and cross-industry assets.
                    </p>
                </div>
            </header>

            <section className="py-20 mx-auto max-w-7xl px-6">
                <div className="grid md:grid-cols-3 gap-20">
                    <div className="space-y-12">
                        <div>
                            <h2 className="font-display text-4xl uppercase mb-8 border-b-4 border-candy-pink pb-2">Engines</h2>
                            <div className="grid gap-3">
                                {ENGINES.map((e) => (
                                    <Link key={e.slug} href={`/mascot-maker/${e.slug}`} className="text-xl font-black text-foreground hover:text-candy-pink transition-colors">
                                        • {e.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-display text-4xl uppercase mb-8 border-b-4 border-candy-blue pb-2">Industries</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                {sortedIndustries.map((i) => (
                                    <Link key={i.slug} href={`/mascot-maker/${i.slug}`} className={`text-sm font-bold hover:text-candy-blue transition-colors ${i.slug === "ai-startups" ? "text-candy-blue underline decoration-2 offset-4" : "text-muted-foreground"}`}>
                                        {i.title} Assets
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h2 className="font-display text-4xl uppercase mb-8 border-b-4 border-candy-green pb-2">Art Styles</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                {STYLES.map((s) => (
                                    <Link key={s.slug} href={`/mascot-maker/${s.slug}`} className="text-sm font-bold text-muted-foreground hover:text-candy-green transition-colors">
                                        {s.title} Design
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-display text-4xl uppercase mb-8 border-b-4 border-candy-orange pb-2">Comparisons</h2>
                            <div className="grid gap-3">
                                {COMPETITORS.map((c) => (
                                    <Link key={c.slug} href={`/mascot-maker/compare/${c.slug}`} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                                        Mascot Maker vs {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-display text-4xl uppercase mb-8 border-b-4 border-candy-yellow pb-2">Global Studios</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar mb-12">
                            {sortedLocations.map((l) => (
                                <Link key={l.slug} href={`/mascot-maker/near/${l.slug}`} className={`text-sm font-bold hover:text-candy-yellow transition-colors ${l.slug === "mumbai" ? "text-candy-yellow underline decoration-2 offset-4" : "text-muted-foreground"}`}>
                                    Studio in {l.name}
                                </Link>
                            ))}
                        </div>

                        <h2 className="font-display text-4xl uppercase mb-8 border-b-4 border-foreground pb-2">Top Sets</h2>
                        <div className="grid gap-3">
                            {STYLES.slice(0, 5).map((s) => (
                                INDUSTRIES.slice(0, 3).map((i) => (
                                    <Link 
                                        key={`${s.slug}-${i.slug}`} 
                                        href={`/mascot-maker/${s.slug}/${i.slug}`} 
                                        className="text-xs font-black uppercase tracking-tight text-muted-foreground hover:text-candy-pink transition-colors"
                                    >
                                        • {s.title} for {i.title}
                                    </Link>
                                ))
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
