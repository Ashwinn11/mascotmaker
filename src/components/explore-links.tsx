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

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-pink border-b-2 border-candy-pink/10 pb-3">Engines</h4>
                        <ul className="space-y-3 text-sm font-bold text-muted-foreground">
                            {ENGINES.map((e) => (
                                <li key={e.slug}>
                                    <Link href={`/mascot-maker/${e.slug}`} className="hover:text-foreground transition-all hover:pl-1">
                                        {e.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-blue border-b-2 border-candy-blue/10 pb-3">Industries</h4>
                        <ul className="space-y-3 text-sm font-bold text-muted-foreground">
                            {INDUSTRIES.slice(0, 12).map((i) => (
                                <li key={i.slug}>
                                    <Link href={`/mascot-maker/${i.slug}`} className="hover:text-foreground transition-all hover:pl-1">
                                        {i.title} Assets
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-green border-b-2 border-candy-green/10 pb-3">Art Styles</h4>
                        <ul className="space-y-3 text-sm font-bold text-muted-foreground">
                            {STYLES.slice(0, 12).map((s) => (
                                <li key={s.slug}>
                                    <Link href={`/mascot-maker/${s.slug}`} className="hover:text-foreground transition-all hover:pl-1">
                                        {s.title} Design
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-yellow border-b-2 border-candy-yellow/10 pb-3">Global Studios</h4>
                        <ul className="space-y-3 text-sm font-bold text-muted-foreground">
                            {LOCATIONS.slice(0, 12).map((l) => (
                                <li key={l.slug}>
                                    <Link href={`/mascot-maker/near/${l.slug}`} className="hover:text-foreground transition-all hover:pl-1">
                                        Studio in {l.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-foreground/30 border-b-2 border-foreground/5 pb-3">Resources</h4>
                        <ul className="space-y-3 text-sm font-bold text-muted-foreground">
                            {COMPETITORS.slice(0, 3).map((c) => (
                                <li key={c.slug}>
                                    <Link href={`/mascot-maker/compare/${c.slug}`} className="hover:text-foreground transition-all">
                                        vs {c.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/explore" className="text-candy-pink hover:underline uppercase text-[10px] font-black tracking-tighter">
                                    View Full Index →
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
