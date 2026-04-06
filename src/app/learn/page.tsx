import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LEARN_TERMS } from "@/lib/learn-data";
import { BookOpen, Sparkles, ArrowUpRight, GraduationCap, Lightbulb, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn & Glossary — Mascot Maker AI Academy",
  description: "Master the art of AI character consistency, brand mascot design, and sticker pack marketing with our expert glossary and technical guides.",
  alternates: {
    canonical: "https://mascotmaker.io/learn",
  },
};

export default function LearnHubPage() {
  const categories = ["Technical", "Concepts", "Marketing"] as const;

  return (
    <div className="bg-[#0c0a09] min-h-screen text-white selection:bg-candy-blue/30">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-[#141210] border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <div className="container mx-auto px-6 text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-[10px] font-black uppercase tracking-widest text-candy-blue animate-slide-up shadow-sm">
            <GraduationCap size={14} className="text-candy-blue" />
            MASCOT DESIGN ACADEMY
          </div>
          <h1 className="font-display text-7xl md:text-[8rem] text-white leading-[0.85] uppercase tracking-tighter animate-slide-up stagger-1 drop-shadow-sm">
            The Glossary <br /><span className="text-candy-pink">of Character.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/40 font-medium leading-relaxed max-w-3xl mx-auto animate-slide-up stagger-2">
            Master the technical terminology and strategic concepts behind professional AI character design and brand identity.
          </p>
        </div>
        
        {/* Glow effects */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-candy-blue/20 to-transparent" />
      </section>

      {/* Categories Search/Navigation */}
      <section className="py-12 bg-[#0c0a09] sticky top-16 z-30 border-b border-white/[0.04] backdrop-blur-xl">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button key={cat} className="px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:border-candy-blue hover:text-candy-blue transition-all bg-[#141210] hover:bg-candy-blue/5">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content: Grid of Learning Terms */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LEARN_TERMS.map((term, index) => (
            <Link 
              key={term.slug}
              href={`/learn/${term.slug}`}
              className="group relative flex flex-col h-full bg-[#141210] rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden shadow-2xl animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-video relative overflow-hidden">
                {term.image ? (
                  <Image src={term.image} alt={term.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80" />
                ) : (
                  <div className="absolute inset-0 bg-[#1c1916] flex items-center justify-center">
                    <BookOpen className="text-white/10" size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent" />
                
                <div className="absolute top-6 left-6">
                   <div className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/50">
                    {term.category}
                  </div>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow space-y-6">
                <h2 className="font-display text-3xl text-white group-hover:text-candy-blue transition-colors leading-none tracking-tight">
                  {term.title}
                </h2>
                <p className="text-sm text-white/40 font-medium leading-relaxed flex-grow">
                  {term.excerpt}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5cd85c]">Read Article</span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-candy-blue group-hover:text-[#0c0a09] transition-all">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Fast CTA */}
      <section className="py-32 container mx-auto px-6 border-t border-white/[0.04]">
        <div className="relative rounded-[4rem] bg-gradient-to-br from-[#141210] to-[#0c0a09] border border-white/5 p-12 md:p-24 overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-candy-blue/5 rounded-full blur-[100px]" />
          <div className="relative z-10 space-y-10">
            <h2 className="font-display text-5xl md:text-8xl text-white leading-none uppercase tracking-tighter">Ready to Apply <br /><span className="text-candy-blue italic">the Science?</span></h2>
            <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">Use our Identity Lock technology to build consistent mascots—now that you understand the theory.</p>
            <div className="flex justify-center pt-6">
              <Link href="/create" className="inline-flex items-center gap-4 rounded-2xl bg-candy-blue px-12 py-6 text-xl font-black text-[#0c0a09] shadow-[0_0_20px_rgba(33,150,243,0.3)] hover:shadow-[0_0_30px_rgba(33,150,243,0.5)] active:scale-95 transition-all uppercase tracking-wide">
                <Sparkles size={24} />
                START DESIGNING
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
