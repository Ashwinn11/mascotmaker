import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Check, ArrowRight, HelpCircle, Shield, Zap, ArrowUpRight, Palette } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";
import { JSONLD } from "@/components/json-ld";
import { STYLES } from "@/lib/seo-data";

const TOP_STYLES = STYLES.slice(0, 8);

export const metadata: Metadata = {
  title: "Mascot Maker — AI Mascot, Logo & Sticker Generator",
  description: "Create professional 3D, 2D, or retro characters with absolute identity consistency. Generate logos, sticker packs, and mascots in 8 styles. Instant AI background remover.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What can I create with Mascot Maker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mascot Maker is a specialized AI design studio for creating consistent brand mascots, professional logos, and cohesive sticker packs across 8 distinct art styles."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the mascots for commercial purposes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, every character you generate with Mascot Maker comes with full commercial rights. You own the output completely."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a free version of Mascot Maker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, new users get free credits to try our AI sticker pack maker, logo generator, and background remover with no credit card required."
        }
      },
      {
        "@type": "Question",
        "name": "How do I ensure my character stays consistent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our proprietary Identity Lock technology ensures that your mascot's features remain identical across different poses, expressions, and outfits."
        }
      }
    ]
  };

  return (
    <div className="bg-cream selection:bg-candy-pink/30 relative font-sans overflow-x-hidden">
      <JSONLD data={faqSchema} />

      {/* ─── Hero Section: Compact & Studio-Grade ─── 
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-mesh-candy bg-grain pt-24 pb-12">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-candy-pink/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* Left Column: Core Copy */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-foreground/5 bg-cream/50 backdrop-blur-sm animate-pop-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-candy-pink opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-candy-pink"></span>
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase text-foreground/40 leading-none">Identity Lock™ v2.5 — Professional Studio</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-display text-5xl md:text-7xl leading-[0.85] tracking-tighter text-foreground uppercase">
                  Mascots, Logos<br />
                  <span className="text-candy-pink italic">& Stickers.</span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-foreground/50 max-w-xl leading-relaxed animate-slide-up stagger-1">
                  The only AI design studio that locks your character DNA, ensuring 100% identity consistency across logos, sticker packs, and brand mascots.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-4 animate-slide-up stagger-2">
                <Link
                  href="/create"
                  className="group inline-flex items-center gap-4 px-10 py-5 bg-foreground text-cream rounded-2xl font-black text-lg shadow-premium hover:bg-candy-pink transition-all duration-500 hover:scale-[1.02] hover:shadow-glow-pink"
                >
                  <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                  START GENERATING
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-4 px-10 py-5 border border-foreground/10 text-foreground rounded-2xl font-black text-lg hover:border-candy-pink hover:text-candy-pink transition-all duration-500"
                >
                  VIEW GALLERY
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {["/demo/hero-dragon-barista.png", "/demo/hero-animation.webp", "/demo/hero-stickers.webp"].map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl border-4 border-cream overflow-hidden shadow-lg rotate-[5deg] even:rotate-[-5deg]">
                      <Image src={src} alt="Mascot" width={40} height={40} className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black tracking-widest text-foreground/40 uppercase">10,000+ characters generated</p>
                  <div className="flex gap-0.5 text-candy-yellow opacity-50">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-current" />)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visuals */}
            <div className="lg:col-span-5 relative mt-12 lg:mt-0 lg:pl-10">
              <div className="relative aspect-[4/5] w-full max-w-[400px] mx-auto">
                {/* Primary mascot render — Bottom Layer */}
                <div className="absolute top-8 right-0 w-[85%] aspect-square rounded-[2.5rem] overflow-hidden shadow-premium border border-foreground/5 bg-cream z-10 animate-float opacity-80 lg:opacity-100">
                  <Image src="/demo/hero-dragon-barista.png" alt="3D AI Mascot" fill className="object-cover" />
                </div>

                {/* Secondary character sheet — Top Layer */}
                <div className="absolute top-[55%] left-0 w-[60%] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-foreground/10 bg-cream z-20 rotate-[-12deg] hover:rotate-0 transition-transform duration-700 animate-float-delayed">
                  <Image src="/demo/hero-animation.webp" alt="Character sheet" fill className="object-cover" />
                </div>

                {/* Identity Tag */}
                <div className="absolute top-1/2 -left-8 z-30 animate-pop-in hidden md:block">
                  <div className="px-5 py-3 bg-foreground text-cream rounded-xl shadow-premium">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-candy-pink mb-0.5">Identity Lock™</p>
                    <p className="text-[10px] font-bold text-cream/30">Same character engine</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MARQUEE — Scrolling style strip, full-bleed dark
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-foreground py-4 overflow-hidden border-y border-foreground/10">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {["3D Pixar", "Claymation", "Pixel Art", "Flat Vector", "Isometric", "Minimalist", "Retro 80s", "Vector Art", "3D Pixar", "Claymation", "Pixel Art", "Flat Vector", "Isometric", "Minimalist", "Retro 80s", "Vector Art"].map((style, i) => (
            <span key={i} className={`text-sm font-black uppercase tracking-widest ${i % 3 === 0 ? "text-candy-pink" : "text-cream/25"}`}>
              {style} <span className="text-cream/10 mx-4">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PROOF — Full-bleed image showcase, dark section
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-foreground text-cream py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

            {/* Image — left */}
            <div className="lg:w-[55%] relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                <Image src="/demo/style-showcase.webp" alt="AI Mascot Style Gallery" width={900} height={700} className="w-full h-auto" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-6 -right-6 px-6 py-4 bg-candy-pink rounded-3xl shadow-glow-pink">
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-100">8 Studio Styles</p>
                <p className="text-2xl font-black text-cream mt-0.5">One Engine</p>
              </div>
            </div>

            {/* Copy — right */}
            <div className="lg:w-[45%] space-y-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-candy-pink">Visual Excellence</p>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tight">
                Any style.<br />
                <span className="text-candy-pink">One engine.</span>
              </h2>
              <p className="text-cream/50 text-lg font-medium leading-relaxed">
                Whether you need a minimalist vector logo, a cohesive sticker pack, or a consistent brand mascot — generate complete assets in 8 pro styles with zero design skills.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {["3D Pixar", "Claymation", "Pixel Art", "Flat Illustration", "Minimalist", "Vector Art", "Isometric", "Retro 80s"].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-candy-pink flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
              <Link href="/gallery" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-candy-pink hover:gap-5 transition-all">
                BROWSE ALL STYLES <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          IDENTITY LOCK — Feature callout, cream bg, image RIGHT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-cream">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

            {/* Copy — left */}
            <div className="lg:w-[45%] space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-candy-pink/10 border border-candy-pink/20">
                <Shield size={12} className="text-candy-pink" />
                <span className="text-[10px] font-black uppercase tracking-widest text-candy-pink">Core Technology</span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tight text-foreground">
                Same character.<br />
                <span className="text-candy-pink">Every. Single. Time.</span>
              </h2>
              <p className="text-foreground/50 text-lg font-medium leading-relaxed">
                Other AI tools give you a different face every generation. Identity Lock™ pins your mascot's exact features — face structure, color, personality — so your brand stays consistent at scale.
              </p>
              <ul className="space-y-4">
                {[
                  "Consistent across every generation",
                  "Works across all 8 pro styles",
                  "Background Remover included"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-candy-pink/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-candy-pink stroke-[3]" />
                    </div>
                    <span className="text-sm font-semibold text-foreground/70">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/create" className="inline-flex items-center gap-3 px-7 py-4 bg-foreground text-cream rounded-2xl font-black text-sm tracking-wide hover:bg-candy-pink transition-all duration-300 group">
                TRY IDENTITY LOCK
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Image — right */}
            <div className="lg:w-[55%] relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-premium border border-foreground/5">
                <Image src="/demo/character-consistency.webp" alt="Mascot Identity Lock" width={800} height={600} className="w-full h-auto" />
              </div>
              {/* Small decorative accent */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-xl border border-foreground/5 rotate-[-8deg]">
                <Image src="/demo/style-flat.png" alt="" width={96} height={96} className="object-cover w-full h-full" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BACKGROUND REMOVER — Full-width card, distinct layout
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-6 bg-cream px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-foreground overflow-hidden relative">
          <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Image — left, bleeds to edge */}
            <div className="lg:w-1/2 relative min-h-[360px]">
              <Image
                src="/demo/before-after.webp"
                alt="AI Background Remover"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-foreground/40 hidden lg:block" />
            </div>
            {/* Copy — right */}
            <div className="lg:w-1/2 p-12 lg:p-16 relative z-10 space-y-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-candy-pink/20 border border-candy-pink/30">
                <Zap size={12} className="text-candy-pink" />
                <span className="text-[10px] font-black uppercase tracking-widest text-candy-pink">Free Utility Tool</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-cream leading-[0.9] tracking-tight">
                Perfect cutouts.<br />
                <span className="text-candy-pink">In seconds.</span>
              </h2>
              <p className="text-cream/40 text-base font-medium leading-relaxed">
                Remove backgrounds from any mascot or logo instantly. Tuned specifically for characters — crisp edges, no halos, production-ready.
              </p>
              <Link
                href="/background-remover"
                className="self-start inline-flex items-center gap-3 px-7 py-4 bg-candy-pink text-cream rounded-2xl font-black text-sm tracking-wide hover:brightness-110 transition-all group shadow-glow-pink"
              >
                USE BACKGROUND REMOVER
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COMMERCIAL RIGHTS — High-Energy Editorial Layout
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left: Interactive Rights Matrix */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-candy-pink/10 border border-candy-pink/20 text-[10px] font-black uppercase tracking-[0.2em] text-candy-pink">
                  Legal Freedom
                </div>
                <h2 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tighter">
                  You own it.<br />
                  <span className="text-candy-pink italic">Every pixel.</span>
                </h2>
                <p className="text-xl text-foreground/50 font-medium leading-relaxed max-w-lg">
                  No complex licensing. No attribution. Every mascot you generate comes with a full, perpetual commercial license.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "IP OWNERSHIP", desc: "You hold the copyright" },
                  { title: "UNLIMITED USAGE", desc: "Print, Web, TV, Gaming" },
                  { title: "ZERO ROYALTIES", desc: "No hidden recurring fees" },
                  { title: "HIGH RES 4K", desc: "Production-ready exports" }
                ].map((item, i) => (
                  <div key={i} className="group p-6 rounded-[2rem] bg-secondary/10 border border-foreground/5 hover:border-candy-pink/30 transition-all duration-500">
                    <div className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Check size={16} className="text-candy-pink" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-foreground">{item.title}</p>
                    <p className="text-[10px] font-bold text-foreground/30 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Immersive Asset Collage */}
            <div className="relative">
              <div className="absolute inset-0 bg-mesh-candy opacity-20 blur-[100px] rounded-full scale-150 animate-pulse" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-premium rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                    <Image src="/demo/style-vector.png" alt="Proof" width={300} height={300} className="w-full h-auto" />
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-foreground text-cream space-y-4 shadow-2xl">
                    <div className="text-5xl font-display text-candy-pink">100%</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-cream/40 leading-relaxed">
                      Your IP. Your Terms. Forever.
                    </p>
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-premium bg-cream flex items-center justify-center p-8 group">
                    <Image src="/demo/hero-stickers.webp" alt="Proof" width={200} height={200} className="w-full h-auto group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-premium rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                    <Image src="/demo/character-consistency.webp" alt="Proof" width={300} height={400} className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STYLES — Premium Bento Grid
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 bg-cream border-t border-foreground/5 relative">
        <div className="container mx-auto px-6">
          <div className="mb-20 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
              Infinite Possibilities
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter uppercase">
              Models for every<br />
              <span className="text-candy-pink">Industry.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {TOP_STYLES.map((style) => {
              return (
                <Link
                  key={style.slug}
                  href={`/mascot-maker/style/${style.slug}`}
                  className="group flex flex-col bg-cream border border-foreground/5 rounded-2xl overflow-hidden hover:shadow-premium transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Visual: Clean, Square Image */}
                  <div className="aspect-square relative w-full bg-secondary/5 overflow-hidden">
                    <Image
                      src={style.image || "/demo/hero-dragon-barista.png"}
                      alt={style.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Content: Minimal & High-Contrast */}
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-candy-pink transition-colors truncate">
                        {style.title}
                      </h3>
                      <ArrowUpRight size={12} className="text-foreground/20 group-hover:text-candy-pink transition-colors flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest leading-none">V2.0</span>
                      <div className="w-1 h-1 rounded-full bg-foreground/10" />
                      <span className="text-[8px] font-bold text-candy-pink/50 uppercase tracking-widest leading-none">Identity Lock</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link href="/explore" className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 hover:text-candy-pink transition-colors">
              VIEW ALL 1,200+ CATEGORIES
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FAQ — Minimal accordion-list, no visual noise
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 bg-cream border-t border-foreground/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            <div className="md:w-1/3 space-y-3">
              <h2 className="font-display text-4xl leading-tight tracking-tight">Questions?</h2>
              <p className="text-foreground/40 text-sm font-medium">Everything you need to know before you start.</p>
              <Link href="/create" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-candy-pink hover:gap-4 transition-all">
                START NOW <ArrowRight size={14} />
              </Link>
            </div>
            <div className="md:w-2/3 divide-y divide-foreground/6">
              {faqSchema.mainEntity.map((faq, i) => (
                <div key={i} className="py-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle size={16} className="text-candy-pink flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-black uppercase tracking-wide text-foreground">{faq.name}</h4>
                      <p className="text-sm font-medium text-foreground/45 leading-relaxed">{faq.acceptedAnswer.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FINAL CTA — Giant, unmissable, singular focus
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
        {/* Big background word */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-[25vw] text-cream/[0.02] leading-none tracking-tighter">CREATE</span>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cream/20">5 free credits · No credit card required</p>
          <h2 className="font-display text-[clamp(3rem,10vw,8rem)] text-cream leading-[0.88] tracking-tight">
            Your mascot<br />
            <span className="text-candy-pink">is waiting.</span>
          </h2>
          <Link
            href="/create"
            className="inline-flex items-center gap-4 px-10 py-5 bg-candy-pink text-cream rounded-2xl font-black text-lg tracking-wide shadow-glow-pink hover:brightness-110 hover:scale-[1.02] transition-all group"
          >
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            CREATE YOUR MASCOT — FREE
          </Link>
          <p className="text-xs font-medium text-cream/20">Join 10,000+ brands on Discord · Twitch · TikTok · Reddit</p>
        </div>
      </section>

      <ExploreLinks />
    </div>
  );
}
