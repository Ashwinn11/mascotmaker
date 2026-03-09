import Link from "next/link";
import { LOCATIONS, INDUSTRIES, STYLES, ENGINES, COMPETITORS } from "@/lib/seo-data";

export function ExploreLinks() {
    return (
        <section className="py-20 bg-cream border-t-4 border-foreground overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="font-display text-3xl md:text-5xl uppercase mb-4">Explore Mascot Maker</h2>
                    <p className="text-muted-foreground font-bold max-w-2xl mx-auto">
                        Discover specialized AI models for different art styles, industries, location-specific studios, and tool comparisons.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest text-sm text-candy-pink border-b-2 border-candy-pink/20 pb-2">Engines</h4>
                        <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                            {ENGINES.map((e) => (
                                <li key={e.slug}>
                                    <Link href={`/mascot-maker/${e.slug}`} className="hover:text-foreground transition-colors">
                                        {e.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest text-sm text-candy-blue border-b-2 border-candy-blue/20 pb-2">Industries</h4>
                        <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                            {INDUSTRIES.map((i) => (
                                <li key={i.slug}>
                                    <Link href={`/mascot-maker/${i.slug}`} className="hover:text-foreground transition-colors">
                                        {i.title} Assets
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest text-sm text-candy-green border-b-2 border-candy-green/20 pb-2">Art Styles</h4>
                        <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                            {STYLES.map((s) => (
                                <li key={s.slug}>
                                    <Link href={`/mascot-maker/${s.slug}`} className="hover:text-foreground transition-colors">
                                        {s.title} Design
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest text-sm text-candy-yellow border-b-2 border-candy-yellow/20 pb-2">Locations</h4>
                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                                {LOCATIONS.map((l) => (
                                    <li key={l.slug}>
                                        <Link href={`/mascot-maker/near/${l.slug}`} className="hover:text-foreground transition-colors">
                                            Studio in {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest text-sm text-foreground/50 border-b-2 border-foreground/10 pb-2">Compare</h4>
                        <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                            {COMPETITORS.map((c) => (
                                <li key={c.slug}>
                                    <Link href={`/mascot-maker/compare/${c.slug}`} className="hover:text-foreground transition-colors">
                                        Mascot Maker vs {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
