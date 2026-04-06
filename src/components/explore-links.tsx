import Link from "next/link";
import { INDUSTRIES, STYLES, ENGINES, COMPETITORS } from "@/lib/seo-data";

export function ExploreLinks() {
    // We want to vary the links shown so that all 800+ pages get discovered over time
    // instead of always linking to the same first 12. 
    // Since this is a server component, we'll pick a slice that feels different but is stable.
    
    return (
        <section className="py-20 bg-[#0c0a09] border-t border-white/[0.04] overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="font-display text-3xl md:text-5xl uppercase mb-4 text-white drop-shadow-sm">Search Our Design Hub</h2>
                    <p className="text-white/50 font-medium max-w-2xl mx-auto italic">
                        Discover specialized AI models for different art styles, industries, and tools — or compare us head-to-head with other products.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-pink border-b border-candy-pink/20 pb-3 drop-shadow-[0_0_8px_rgba(255,77,28,0.5)]">Use Cases</h4>
                        <ul className="space-y-3 text-sm font-medium text-white/40">
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
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-blue border-b border-candy-blue/20 pb-3 drop-shadow-[0_0_8px_rgba(33,150,243,0.5)]">By Industry</h4>
                        <ul className="grid grid-cols-1 gap-3 text-sm font-medium text-white/40">
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
                        <h4 className="font-black uppercase tracking-widest text-xs text-[#5cd85c] border-b border-[#5cd85c]/20 pb-3 drop-shadow-[0_0_8px_rgba(92,216,92,0.5)]">By Style</h4>
                        <ul className="grid grid-cols-1 gap-3 text-sm font-medium text-white/40">
                            {STYLES.map((s) => (
                                <li key={s.slug}>
                                    <Link href={`/mascot-maker/style/${s.slug}`} className="hover:text-[#5cd85c] transition-all hover:pl-1">
                                        {s.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-widest text-xs text-candy-yellow border-b border-candy-yellow/20 pb-3 drop-shadow-[0_0_8px_rgba(255,235,59,0.5)]">Comparisons</h4>
                        <ul className="grid grid-cols-1 gap-3 text-sm font-medium text-white/40">
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
                        <h4 className="font-black uppercase tracking-widest text-xs text-white/60 border-b border-white/10 pb-3">Tools & More</h4>
                        <ul className="space-y-3 text-sm font-medium text-white/40">
                            <li>
                                <Link href="/background-remover" className="text-candy-pink hover:text-candy-pink hover:brightness-110 transition-all">
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
