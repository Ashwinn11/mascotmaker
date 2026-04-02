import Link from "next/link";
import { INDUSTRIES, STYLES, ENGINES, COMPETITORS } from "@/lib/seo-data";

export function ExploreLinks() {
    // We want to vary the links shown so that all 800+ pages get discovered over time
    // instead of always linking to the same first 12. 
    // Since this is a server component, we'll pick a slice that feels different but is stable.
    
    return (
        <section className="py-20 bg-cream border-t-4 border-foreground overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="font-display text-3xl md:text-5xl uppercase mb-4 text-gradient">Search Our Design Hub</h2>
                    <p className="text-muted-foreground font-bold max-w-2xl mx-auto italic">
                        Discover specialized AI models for different art styles, industries, and tools — or compare us head-to-head with other products.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-pink border-b-2 border-candy-pink/10 pb-3">Use Cases</h4>
                        <ul className="space-y-3 text-sm font-bold text-warm-gray">
                            {ENGINES.map((e) => (
                                <li key={e.slug}>
                                    <Link href={`/mascot-maker/use-case/${e.slug}`} className="hover:text-candy-pink transition-all hover:pl-1">
                                        {e.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-blue border-b-2 border-candy-blue/10 pb-3">By Industry</h4>
                        <ul className="grid grid-cols-1 gap-3 text-sm font-bold text-warm-gray">
                            {INDUSTRIES.map((i) => (
                                <li key={i.slug}>
                                    <Link href={`/mascot-maker/industry/${i.slug}`} className="hover:text-candy-blue transition-all hover:pl-1">
                                        {i.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-green border-b-2 border-candy-green/10 pb-3">By Style</h4>
                        <ul className="grid grid-cols-1 gap-3 text-sm font-bold text-warm-gray">
                            {STYLES.map((s) => (
                                <li key={s.slug}>
                                    <Link href={`/mascot-maker/style/${s.slug}`} className="hover:text-candy-green transition-all hover:pl-1">
                                        {s.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-yellow border-b-2 border-candy-yellow/10 pb-3">Comparisons</h4>
                        <ul className="grid grid-cols-1 gap-3 text-sm font-bold text-warm-gray">
                            {COMPETITORS.map((c) => (
                                <li key={c.slug}>
                                    <Link href={`/mascot-maker/compare/${c.slug}`} className="hover:text-candy-yellow transition-all hover:pl-1">
                                        vs {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-foreground/30 border-b-2 border-foreground/5 pb-3">Tools & More</h4>
                        <ul className="space-y-3 text-sm font-bold text-warm-gray">
                            <li>
                                <Link href="/background-remover" className="text-candy-pink hover:text-candy-pink transition-all">
                                    Free Background Remover
                                </Link>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
