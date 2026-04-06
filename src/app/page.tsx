"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Check, ArrowRight, HelpCircle, Shield, Zap, ArrowUpRight } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";
import { JSONLD } from "@/components/json-ld";
import { STYLES } from "@/lib/seo-data";
import { motion } from "framer-motion";

const TOP_STYLES = STYLES.slice(0, 8);

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
          "text": "Mascot Maker is a specialized AI design studio for creating consistent brand mascots, professional logos, cohesive sticker packs, and instant character animations (GIFs) across 8 distinct styles."
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-[#0c0a09] selection:bg-candy-pink/30 relative font-sans overflow-x-hidden">
      <JSONLD data={faqSchema} />

      {/* ─── Hero Section: Obsidian Studio Grade ─── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-mesh-dark bg-grain pt-32 pb-16">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-candy-pink/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Core Copy */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="lg:col-span-7 space-y-10"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/20 bg-[#1c1916] shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-candy-pink opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-candy-pink"></span>
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase text-white/50 leading-none mt-px">Identity Lock™ v2.5 — Professional Studio</span>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-6">
                <h1 className="font-display text-[clamp(4rem,10vw,7.5rem)] leading-[0.85] tracking-tighter text-white uppercase drop-shadow-2xl">
                  Mascots, Logos<br />
                  <span className="text-candy-pink italic">& Animations.</span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-white/50 max-w-xl leading-relaxed">
                  The only AI design studio that fixes the "consistency" problem. Generate professional 3D characters, logos, sticker packs, and instant animations for your brand.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-5 pt-2">
                <Link
                  href="/create"
                  className="group inline-flex items-center gap-4 px-10 py-5 bg-candy-pink text-white rounded-2xl font-black text-lg shadow-glow-coral hover:brightness-110 transition-all duration-300 hover:scale-[1.02]"
                >
                  <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                  START GENERATING
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-4 px-10 py-5 border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/5 transition-all duration-300"
                >
                  VIEW GALLERY
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-4">
                  {["/demo/hero-dragon-barista.png", "/demo/hero-animation.webp", "/demo/cat-stickers.webp"].map((src, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl border-2 border-[#141210] overflow-hidden shadow-lg shadow-black/50 hover:-translate-y-1 transition-transform">
                      <Image src={src} alt="Mascot" width={48} height={48} className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">10,000+ characters generated</p>
                  <div className="flex gap-1 text-candy-yellow opacity-80">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]" />)}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Hero Visuals */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="lg:col-span-5 relative mt-16 lg:mt-0"
            >
              <div className="relative aspect-[4/5] w-full max-w-[440px] mx-auto">
                <div className="absolute top-8 right-0 w-[90%] aspect-square rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(255,77,28,0.15)] border border-white/10 bg-[#1c1916] z-10 animate-float float-glow overflow-y-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-candy-pink/20 to-transparent pointer-events-none" />
                  <Image src="/demo/hero-dragon-barista.png" alt="3D AI Mascot" fill className="object-cover scale-105" priority />
                </div>

                <div className="absolute top-[50%] left-0 w-[65%] aspect-square rounded-3xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] border border-white/10 bg-[#141210] z-20 rotate-[-8deg] hover:rotate-0 transition-transform duration-500 hover:scale-105 group">
                  <Image src="/demo/hero-animation.webp" alt="Character sheet" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>

                <div className="absolute top-1/2 -left-8 z-30 animate-pop-in hidden md:block" style={{ animationDelay: '0.8s' }}>
                  <div className="px-5 py-3 bg-[#141210]/95 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-candy-pink mb-1">Identity Lock™</p>
                    <p className="text-[11px] font-bold text-white/50">Same character engine</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MARQUEE — Seamless dark bleed
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-[#0c0a09] py-5 overflow-hidden border-y border-white/[0.04]">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-300">
          {["3D Pixar", "Claymation", "Pixel Art", "Flat Vector", "Isometric", "Minimalist", "Retro 80s", "Vector Art", "3D Pixar", "Claymation", "Pixel Art", "Flat Vector", "Isometric", "Minimalist", "Retro 80s", "Vector Art"].map((style, i) => (
            <span key={i} className={`text-sm font-black uppercase tracking-widest ${i % 3 === 0 ? "text-candy-pink drop-shadow-[0_0_10px_rgba(255,77,28,0.4)]" : "text-white/30"}`}>
              {style} <span className="text-white/5 mx-4">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PROOF — Full-bleed dark
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#0c0a09] py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              className="lg:w-[55%] relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/[0.04]">
                <Image src="/demo/style-showcase.webp" alt="AI Mascot Style Gallery" width={900} height={700} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 px-7 py-5 bg-[#141210] rounded-3xl shadow-2xl border border-white/[0.08] backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-candy-pink">8 Studio Styles</p>
                <p className="text-2xl font-black text-white mt-1">One Engine</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              className="lg:w-[45%] space-y-10"
            >
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-candy-pink tracking-[0.2em]">Visual Excellence</p>
                <h2 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tight text-white">
                  Any style.<br />
                  <span className="text-candy-pink">One engine.</span>
                </h2>
              </div>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                Whether you're a founder building a SaaS empire or a streamer looking for a cohesive Twitch identity, we give you the tools to create studio-grade assets without the specialized pro background.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {["3D Pixar", "Claymation", "Pixel Art", "Flat Illustration", "Minimalist", "Vector Art", "Isometric", "Retro 80s"].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-white/50 bg-white/5 rounded-full px-4 py-2 border border-white/[0.04]">
                    <div className="w-1.5 h-1.5 rounded-full bg-candy-pink shadow-[0_0_8px_rgba(255,77,28,0.5)]" />
                    {s}
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Link href="/gallery" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-candy-pink hover:gap-5 transition-all drop-shadow-[0_0_8px_rgba(255,77,28,0.3)]">
                  BROWSE ALL STYLES <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          IDENTITY LOCK — Dark panel style
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-[#141210]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="lg:w-[45%] space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/10 border border-candy-pink/20">
                <Shield size={12} className="text-candy-pink" />
                <span className="text-[10px] font-black uppercase tracking-widest text-candy-pink drop-shadow-[0_0_5px_rgba(255,77,28,0.5)]">Core Technology</span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tight text-white">
                Same character.<br />
                <span className="text-candy-pink">Every. Single. Time.</span>
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                Most AI generators give you a different face every time you click generate. That's a distraction, not a brand. Identity Lock™ is our solution for founders who need their mascot to look identical across every marketing touchpoint.
              </p>
              <ul className="space-y-4">
                {[
                  "Consistent across every generation",
                  "Works across all 8 pro styles",
                  "Background Remover included"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-6 h-6 rounded-full bg-candy-pink/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-candy-pink stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-white/70 mt-1">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/create" className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm tracking-wide hover:bg-candy-pink hover:border-candy-pink hover:text-[#0c0a09] transition-all duration-300 group shadow-lg">
                  TRY IDENTITY LOCK
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="lg:w-[55%] relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/[0.06] bg-[#0c0a09]">
                <Image src="/demo/character-consistency.webp" alt="Mascot Identity Lock" width={800} height={600} className="w-full h-auto opacity-90" />
              </div>
              <div className="absolute -top-6 -left-6 w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border border-white/10 rotate-[-8deg] drop-shadow-[0_0_20px_rgba(255,77,28,0.2)]">
                <Image src="/demo/style-flat.png" alt="" width={112} height={112} className="object-cover w-full h-full hover:scale-110 transition-transform duration-700" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          INSTANT ANIMATION — Dark panel, reversed
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-[#0c0a09] overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse gap-16 lg:gap-24 items-center">

            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="lg:w-[45%] space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-yellow/10 border border-candy-yellow/20">
                <Zap size={12} className="text-candy-yellow" />
                <span className="text-[10px] font-black uppercase tracking-widest text-candy-yellow drop-shadow-[0_0_5px_rgba(245,200,66,0.3)]">Magic Moment</span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.9] tracking-tight text-white">
                Bring your mascot<br />
                <span className="text-candy-yellow">to life instantly.</span>
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                A mascot is just a drawing until it moves. Our engine automatically generates 9-frame studio sprite sheets and converts them into Discord-ready animated GIFs in one click. 
              </p>
              <ul className="space-y-4">
                {[
                  "Automated 9-frame Sprite Sheet generation",
                  "One-click high-fidelity GIF conversion",
                  "Perfect for Discord, Slack, and Web Apps",
                  "Maintain identity across every action"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-6 h-6 rounded-full bg-candy-yellow/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-candy-yellow stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-white/70 mt-1">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/create" className="inline-flex items-center gap-3 px-8 py-4 bg-candy-yellow text-[#0c0a09] rounded-2xl font-black text-sm tracking-wide hover:brightness-110 transition-all group shadow-glow-gold hover:-translate-y-1">
                  ANIMATE YOUR CHARACTER
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="lg:w-[55%] relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-[#1c1916] p-2">
                <div className="rounded-[2rem] overflow-hidden">
                  <Image src="/demo/style-showcase.webp" alt="AI Mascot Animation Engine" width={800} height={600} className="w-full h-auto opacity-90" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 px-6 py-4 bg-[#141210] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-candy-yellow">Engine Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-candy-yellow animate-pulse shadow-[0_0_8px_rgba(245,200,66,0.6)]" />
                  <p className="text-xl font-black text-white whitespace-nowrap italic">Sprite Mapping Active</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BACKGROUND REMOVER — Premium Utility Block
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-[#0c0a09] px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto rounded-[2.5rem] border border-white/10 glass-dark overflow-hidden relative shadow-2xl shadow-candy-pink/5"
        >
          <div className="flex flex-col lg:flex-row items-stretch">
            <div className="lg:w-1/2 relative min-h-[360px] bg-checkerboard border-r border-white/5">
              <Image
                src="/demo/before-after.webp"
                alt="AI Background Remover"
                fill
                className="object-cover opacity-90 mixing-blend-screen"
              />
            </div>
            <div className="lg:w-1/2 p-12 lg:p-20 relative z-10 space-y-8 flex flex-col justify-center bg-[#1c1916]/80 backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-candy-pink/10 border border-candy-pink/20">
                <Zap size={12} className="text-candy-pink" />
                <span className="text-[10px] font-black uppercase tracking-widest text-candy-pink">Free Utility Tool</span>
              </div>
              <div className="space-y-4">
                <h2 className="font-display text-4xl md:text-5xl text-white leading-[0.9] tracking-tight">
                  Perfect cutouts.<br />
                  <span className="text-candy-pink">In seconds.</span>
                </h2>
                <p className="text-white/40 text-base font-medium leading-relaxed max-w-sm">
                  Most background removers struggle with fine character details like hair or fur textures. Our engine is specifically tuned for mascots, delivering production-ready transparency.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/background-remover"
                  className="self-start inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-candy-pink hover:bg-candy-pink/10 text-white hover:text-candy-pink rounded-2xl font-black text-sm tracking-wide transition-all duration-300 shadow-xl"
                >
                  USE REMOVER
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COMMERCIAL RIGHTS — Deep Dark Grid
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 bg-[#141210] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-candy-pink/10 border border-candy-pink/20 text-[10px] font-black uppercase tracking-[0.2em] text-candy-pink">
                  Legal Freedom
                </div>
                <h2 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tighter text-white">
                  You own it.<br />
                  <span className="text-candy-pink italic animate-pulse-glow">Every pixel.</span>
                </h2>
                <p className="text-xl text-white/40 font-medium leading-relaxed max-w-lg">
                  No complex licensing. No attribution. Every mascot you generate comes with a full, perpetual commercial license.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "IP OWNERSHIP", desc: "You hold the copyright" },
                  { title: "UNLIMITED USAGE", desc: "Print, Web, TV, Gaming" },
                  { title: "ZERO ROYALTIES", desc: "No hidden recurring fees" },
                  { title: "HIGH RES 4K", desc: "Production-ready exports" }
                ].map((item, i) => (
                  <div key={i} className="group p-6 rounded-3xl bg-[#1c1916] border border-white/5 hover:border-candy-pink/30 hover:bg-white/5 transition-all duration-500 hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-xl bg-candy-pink/10 flex items-center justify-center mb-5 border border-candy-pink/20 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,77,28,0.1)]">
                      <Check size={18} className="text-candy-pink" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-white mb-1">{item.title}</p>
                    <p className="text-xs font-medium text-white/40">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-candy-pink/5 blur-[100px] rounded-full scale-150 animate-pulse" />
              <div className="relative grid grid-cols-2 gap-5">
                <div className="space-y-5">
                  <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl rotate-[-2deg] hover:rotate-0 hover:scale-105 transition-all duration-500">
                    <Image src="/demo/style-vector.png" alt="Proof" width={300} height={300} className="w-full h-auto opacity-90 hover:opacity-100" />
                  </div>
                  <div className="p-8 rounded-[2rem] bg-[#1c1916] border border-white/10 space-y-4 shadow-2xl">
                    <div className="text-5xl font-display text-candy-pink drop-shadow-[0_0_15px_rgba(255,77,28,0.3)]">100%</div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/50 leading-relaxed">
                      Your IP.<br />Your Terms.<br />Forever.
                    </p>
                  </div>
                </div>
                <div className="space-y-5 pt-16">
                  <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#1c1916] flex items-center justify-center p-6 group rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-500">
                    <Image src="/demo/cat-stickers.webp" alt="Proof" width={200} height={200} className="w-full h-auto group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl rotate-[-1deg] hover:rotate-0 hover:scale-105 transition-all duration-500">
                    <Image src="/demo/character-consistency.webp" alt="Proof" width={300} height={400} className="w-full h-auto object-cover opacity-90 hover:opacity-100" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STYLES — Dark Bento Grid
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-[#0c0a09] relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 space-y-6 text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Infinite Possibilities
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter uppercase text-white">
              Models for every<br />
              <span className="text-candy-pink">Industry.</span>
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {TOP_STYLES.map((style) => (
              <motion.div variants={fadeUp} key={style.slug}>
                <Link
                  href={`/mascot-maker/style/${style.slug}`}
                  className="group flex flex-col bg-[#141210] border border-white/5 rounded-[2rem] overflow-hidden hover:shadow-[0_20px_40px_-10px_rgba(255,77,28,0.1)] hover:border-candy-pink/30 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="aspect-square relative w-full bg-[#1c1916] overflow-hidden border-b border-white/[0.02]">
                    <Image
                      src={style.image || "/demo/hero-dragon-barista.png"}
                      alt={style.title}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141210] to-transparent opacity-50" />
                  </div>

                  <div className="p-5 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-white group-hover:text-candy-pink transition-colors truncate">
                        {style.title}
                      </h3>
                      <ArrowUpRight size={14} className="text-white/20 group-hover:text-candy-pink transition-colors flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">V2.0</span>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[9px] font-bold text-candy-pink/60 uppercase tracking-widest leading-none">Identity Lock</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 text-center">
            <Link href="/explore" className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white hover:bg-white/5 px-6 py-3 rounded-full transition-all">
              VIEW ALL 1,200+ CATEGORIES
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FAQ — Dark Accordion 
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-[#141210] border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/3 space-y-5"
            >
              <h2 className="font-display text-5xl leading-tight tracking-tight text-white">Questions?</h2>
              <p className="text-white/40 text-base font-medium">Everything you need to know before you start generating.</p>
              <div className="pt-4">
                <Link href="/create" className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  START NOW <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
            <div className="md:w-2/3 divide-y divide-white/[0.06]">
              {faqSchema.mainEntity.map((faq, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="py-8 group"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-candy-pink/30 group-hover:bg-candy-pink/10 transition-colors">
                      <HelpCircle size={14} className="text-white/50 group-hover:text-candy-pink transition-colors" />
                    </div>
                    <div className="space-y-3 mt-1.5">
                      <h4 className="text-[13px] font-black uppercase tracking-[0.1em] text-white group-hover:text-candy-pink transition-colors">{faq.name}</h4>
                      <p className="text-sm font-medium text-white/40 leading-relaxed max-w-xl">{faq.acceptedAnswer.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FINAL CTA — Monolithic Dark 
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-32 bg-[#0c0a09] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden mix-blend-screen">
          <span className="font-display text-[28vw] text-white/[0.02] leading-none tracking-tighter">CREATE</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-[500px] bg-gradient-to-t from-candy-pink/[0.05] to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 relative z-10 text-center space-y-10"
        >
          <p className="inline-flex px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/50 shadow-2xl">
            5 free credits · No credit card required
          </p>
          <h2 className="font-display text-[clamp(4rem,10vw,8rem)] text-white leading-[0.88] tracking-tight drop-shadow-2xl">
            Your mascot<br />
            <span className="text-candy-pink">is waiting.</span>
          </h2>
          <div>
            <Link
              href="/create"
              className="inline-flex items-center gap-4 px-12 py-6 bg-candy-pink text-white rounded-full font-black text-lg tracking-wide shadow-[0_0_40px_rgba(255,77,28,0.3)] hover:shadow-[0_0_60px_rgba(255,77,28,0.5)] hover:scale-[1.03] transition-all group border border-white/10"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              GENERATE NOW
            </Link>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/20 mt-10">
            Join 10,000+ brands on Discord · Twitch · TikTok · Web
          </p>
        </motion.div>
      </section>
    </div>
  );
}
