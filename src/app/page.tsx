"use client";

import Link from "next/link";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";
import Image from "next/image";

const EXAMPLES = [
  "Flat Minimalist Logo",
  "3D Pixar Character",
  "Isometric Game Asset",
  "Retro 80s Vibe",
  "Hand-drawn Sketch",
  "Chibi Panda DJ",
  "Claymation Robot",
  "Cyberpunk Scene",
];

export default function Home() {
  return (
    <div className="bg-cream selection:bg-candy-pink/30">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[95vh] overflow-hidden bg-white bg-grain flex items-center border-b-2 border-border/50">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 text-left animate-slide-up">
              <div className="mb-10 inline-flex items-center gap-3 rounded-full border-2 border-candy-pink/20 bg-candy-pink/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-candy-pink shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-candy-pink opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-candy-pink" />
                </span>
                Studio V2 • Asset Engine Active
              </div>

              <h1 className="font-display text-7xl sm:text-8xl lg:text-[9rem] text-foreground leading-[0.85] mb-10 stagger-1 -tracking-[0.05em]">
                Characters, <br />
                <span className="text-gradient">Assets</span> <br />
                & Worlds.
              </h1>

              <p className="text-2xl sm:text-3xl text-muted-foreground/80 max-w-xl mb-14 stagger-2 font-medium leading-[1.15] -tracking-wide">
                The ultimate creative gear to generate, refine, and animate professional assets in any aesthetic.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 stagger-3">
                <Link
                  href="/create"
                  className="group relative inline-flex items-center justify-center gap-4 rounded-[2rem] bg-foreground px-12 py-6 text-2xl font-black text-white shadow-2xl transition-all hover:scale-[1.05] active:scale-[0.95]"
                >
                  <Icon3DInline name="sparkles" size={24} />
                  GO STUDIO
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center gap-4 rounded-[2rem] border-2 border-border bg-white px-12 py-6 text-2xl font-black text-warm-gray transition-all hover:border-candy-pink/40 hover:text-foreground active:scale-[0.95]"
                >
                  BROWSE
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-5 relative animate-pop-in stagger-4">
              <div className="relative z-10 grid gap-6">
                {/* Featured Mascot Card */}
                <div className="group relative overflow-hidden rounded-[3.5rem] border-2 border-border bg-white shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:shadow-candy-pink/10">
                  <div className="aspect-[4/3] bg-dotted/10 relative overflow-hidden">
                    <Image
                      src="/demo/hero-shiba.png"
                      alt="Cool Shiba Mascot"
                      fill
                      className="object-contain p-8 transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-8 left-8">
                      <div className="bg-candy-blue/20 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg text-white border border-white/30">Character Engine v2.0</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Stickers Card */}
                  <div className="group relative overflow-hidden rounded-[2.5rem] border-2 border-border bg-white shadow-xl transition-all duration-700 hover:-translate-y-2">
                    <div className="aspect-square bg-white relative">
                      <div className="absolute inset-0 bg-dotted opacity-20" />
                      <Image
                        src="/demo/hero-stickers.png"
                        alt="Cat Stickers"
                        fill
                        className="object-cover p-4 transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Animation Card */}
                  <div className="group relative overflow-hidden rounded-[2.5rem] border-2 border-border bg-white shadow-xl transition-all duration-700 hover:-translate-y-2">
                    <div className="aspect-square bg-white relative">
                      <div className="absolute inset-0 bg-checkerboard opacity-[0.05]" />
                      <Image
                        src="/demo/hero-animation.png"
                        alt="Robot Animation"
                        fill
                        className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marquee Section ─── */}
      <section className="bg-foreground py-6 overflow-hidden">
        <div className="flex animate-marquee gap-8 whitespace-nowrap">
          {[...EXAMPLES, ...EXAMPLES, ...EXAMPLES].map((ex, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 text-2xl font-display font-black text-white/40 uppercase tracking-tighter"
            >
              <span className="text-candy-pink text-3xl">★</span>
              {ex}
            </span>
          ))}
        </div>
      </section>


      {/* ─── Style Studio ─── */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <div className="max-w-3xl">
              <h2 className="font-display text-7xl md:text-8xl text-foreground mb-10 uppercase -tracking-[0.05em] leading-[0.85]">
                Style <br />
                <span className="text-gradient">Intelligence.</span>
              </h2>
              <p className="text-2xl text-muted-foreground/80 font-medium leading-relaxed max-w-2xl">
                A professional generative engine that understands artistic aesthetics. No generic outputs—pure creative control.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-2 w-20 rounded-full bg-gradient-to-r from-candy-pink to-candy-blue opacity-50 self-center hidden sm:block" />
              <Link
                href="/create"
                className="px-10 py-5 rounded-[2rem] bg-foreground text-white font-black text-xl hover:bg-candy-pink transition-all active:scale-95 shadow-xl"
              >
                OPEN STUDIO
              </Link>
            </div>
          </div>

          <div className="relative mt-24">
            <div className="relative z-20 group">
              {/* Main Showcase Image */}
              <div className="relative overflow-hidden rounded-[4rem] border-2 border-border/40 bg-white/50 shadow-[0_32px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:shadow-[0_45px_100px_-15px_rgba(0,0,0,0.15)]">
                <div className="aspect-[16/9] relative">
                  <div className="absolute inset-0 bg-dotted opacity-[0.05]" />
                  <Image
                    src="/demo/style-showcase.png"
                    alt="Style Studio Showcase"
                    fill
                    className="object-contain p-12 transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Style Labels Floating */}
                  <div className="absolute top-12 left-12 flex flex-col gap-3">
                    <span className="bg-candy-blue/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl animate-float border border-white/20">Pixar V2</span>
                    <span className="bg-candy-pink/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl animate-float-delayed border border-white/20">Retro Film</span>
                  </div>
                  <div className="absolute bottom-12 right-12 flex flex-col items-end gap-3 text-right">
                    <span className="bg-candy-yellow/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl animate-float border border-foreground/10">Pro Branding</span>
                    <span className="bg-candy-green/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl animate-float-delayed border border-white/20">Isometric Engine</span>
                  </div>
                </div>
              </div>

              {/* Backglow Effects */}
              <div className="absolute -inset-10 bg-gradient-to-r from-candy-pink/5 via-candy-blue/5 to-candy-green/5 blur-3xl -z-10 opacity-60 rounded-[5rem] group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Studio Dashboard (Compact & Vibrant) ─── */}
      <section className="py-24 bg-cream relative overflow-hidden border-t-4 border-foreground">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left: Engine Modules (Vibrant / Compact) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6 scale-[0.95] origin-top-left">
              <div className="col-span-2">
                <h2 className="font-display text-6xl text-foreground mb-4 uppercase -tracking-tighter">
                  Studio <span className="text-gradient">Gear.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-bold leading-tight max-w-md">Professional creative engines in one compact dashboard.</p>
              </div>

              {/* Identity Module */}
              <div className="col-span-2 rounded-[2.5rem] bg-candy-pink border-4 border-foreground p-8 text-white shadow-[8px_8px_0_#2d2420] relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-candy-pink shadow-lg group-hover:rotate-12 transition-transform">
                      <Icon3DInline name="high-voltage" size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Identity Link</span>
                  </div>
                  <h3 className="font-display text-4xl mb-2 uppercase leading-none">Consistency Core</h3>
                  <p className="text-xs font-bold leading-relaxed opacity-90 max-w-xs">Our advanced neutral reasoning preserves your character&apos;s unique DNA across every generated action.</p>
                </div>
                <div className="absolute top-0 right-[-10%] h-full w-1/2 bg-white/10 skew-x-[-15deg] group-hover:translate-x-[-10%] transition-transform duration-1000" />
              </div>

              {/* Stylize Module */}
              <div className="rounded-[2.5rem] bg-candy-blue border-4 border-foreground p-6 text-white shadow-[6px_6px_0_#2d2420] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#2d2420] transition-all group">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-candy-blue mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <Icon3DInline name="camera" size={20} />
                </div>
                <h4 className="font-display text-xl mb-1 uppercase tracking-tighter">Stylize</h4>
                <p className="text-[10px] font-black uppercase opacity-70 tracking-widest leading-none">Global Asset Hub</p>
              </div>

              {/* Prompt Module */}
              <div className="rounded-[2.5rem] bg-candy-orange border-4 border-foreground p-6 text-white shadow-[6px_6px_0_#2d2420] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#2d2420] transition-all group">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-candy-orange mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <Icon3DInline name="magic-wand" size={20} />
                </div>
                <h4 className="font-display text-xl mb-1 uppercase tracking-tighter">Reasoning</h4>
                <p className="text-[10px] font-black uppercase opacity-70 tracking-widest leading-none">Artistic Intelligence</p>
              </div>
            </div>

            {/* Right: Output Tray & Rights (Dense) */}
            <div className="lg:col-span-5 space-y-4 lg:pt-0">
              <div className="flex items-center gap-2 mb-6 ml-2">
                <div className="h-2 w-2 rounded-full bg-candy-green animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Output Bundle V2</span>
              </div>

              {[
                { title: "4K Master File", icon: "sparkles", color: "bg-candy-yellow" },
                { title: "3x3 Expression Grid", icon: "artist-palette", color: "bg-candy-blue" },
                { title: "Pro Animation Loop", icon: "clapper-board", color: "bg-candy-green" }
              ].map((item, i) => (
                <div key={i} className="group relative flex items-center gap-4 rounded-3xl border-3 border-foreground bg-white p-4 shadow-[4px_4px_0_#2d2420] hover:translate-x-1 transition-all">
                  <div className={`w-12 h-12 rounded-xl border-2 border-foreground ${item.color} flex items-center justify-center text-foreground shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon3DInline name={item.icon as any} size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-lg uppercase tracking-tighter leading-none mb-1">{item.title}</h4>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Studio Asset {i + 1}</p>
                  </div>
                  <div className="text-candy-green opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                    <Icon3DInline name="check-mark" size={16} />
                  </div>
                </div>
              ))}

              {/* Ownership Banner (Compact Vibrant) */}
              <div className="mt-8 rounded-3xl bg-foreground p-8 text-white relative overflow-hidden group shadow-[8px_8px_0_#ff6b9d]">
                <div className="relative z-10 flex items-center justify-between gap-6">
                  <div>
                    <h4 className="font-display text-3xl uppercase -tracking-tighter mb-1 leading-none">YOU OWN IT.</h4>
                    <p className="text-[10px] font-bold text-white/50 leading-tight uppercase tracking-widest">Full Commercial Rights • No Watermarks</p>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center bg-white/10 rounded-2xl group-hover:rotate-12 transition-transform shadow-2xl backdrop-blur-md">
                    <Icon3DInline name="inbox-tray" size={28} />
                  </div>
                </div>
                <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-tr from-candy-pink/30 to-transparent -z-10 group-hover:opacity-100 opacity-60 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Abstract CSS/SVG visual tokens representing different artistic styles
 * Fulfills the "be creative instead of just images/basic icons" requirement
 */
function StyleToken({ type }: { type: 'pixar' | 'retro' | 'isometric' | 'clay' | 'minimal' | 'chibi' | 'pop' | 'scene' }) {
  switch (type) {
    case 'pixar':
      return (
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-slate-200 shadow-xl" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-candy-blue/40 to-white/80 blur-sm animate-pulse" />
          <div className="absolute top-4 right-6 w-4 h-4 rounded-full bg-white opacity-90 blur-[1px]" />
          <div className="w-20 h-20 rounded-full border-2 border-white/50 backdrop-blur-[2px] shadow-inner" />
        </div>
      );
    case 'retro':
      return (
        <div className="w-24 h-18 relative rounded-xl bg-slate-100 border-4 border-slate-300 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-candy-pink/5 to-transparent animate-marquee" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 opacity-20 bg-grain" />
          <div className="absolute bottom-2 left-2 flex gap-1">
            <div className="h-1 w-4 bg-candy-pink rounded-full" />
            <div className="h-1 w-2 bg-candy-blue rounded-full" />
          </div>
        </div>
      );
    case 'isometric':
      return (
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-12 h-12 bg-slate-200 rotate-45 skew-x-12 relative shadow-lg transform translate-y-2">
            <div className="absolute -top-12 left-0 w-12 h-12 bg-slate-300 skew-y-[30deg]" />
            <div className="absolute top-0 -left-12 w-12 h-12 bg-slate-100 -skew-y-[30deg]" />
          </div>
          <div className="absolute inset-0 border-2 border-dashed border-slate-300 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700" />
        </div>
      );
    case 'clay':
      return (
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-18 h-18 bg-candy-orange rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-wobble shadow-[inset_-4px_-4px_12px_rgba(0,0,0,0.1),8px_8px_20px_rgba(255,138,80,0.2)]" />
          <div className="absolute top-6 left-6 w-3 h-3 bg-white/20 rounded-full blur-[2px]" />
        </div>
      );
    case 'minimal':
      return (
        <div className="w-24 h-24 relative flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-slate-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <div className="w-8 h-8 bg-slate-900 rotate-45" />
          </div>
          <div className="absolute w-20 h-px bg-slate-900/10 rotate-[135deg]" />
        </div>
      );
    case 'chibi':
      return (
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-12 h-12 bg-candy-pink rounded-full animate-float shadow-xl flex items-center justify-center gap-1.5 p-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute w-16 h-16 border-4 border-candy-pink/10 rounded-full" />
          <div className="absolute w-20 h-20 border-2 border-candy-pink/5 rounded-full" />
        </div>
      );
    case 'pop':
      return (
        <div className="w-24 h-24 relative flex items-center justify-center">
          <div className="w-18 h-18 bg-candy-yellow border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0_#ff6b9d]">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
            <div className="absolute top-2 right-2 w-4 h-4 bg-white border-2 border-slate-900 -rotate-12" />
          </div>
        </div>
      );
    case 'scene':
      return (
        <div className="w-24 h-20 relative bg-slate-900 rounded-xl shadow-2xl overflow-hidden group-hover:scale-110 transition-transform">
          <div className="absolute inset-0 bg-gradient-to-tr from-candy-purple/30 to-candy-blue/10" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/10" />
          <div className="absolute top-4 left-4 w-4 h-4 bg-candy-yellow rounded-full blur-[4px] animate-pulse" />
          <div className="absolute bottom-3 left-4 right-4 h-1 bg-white/20 rounded-full" />
        </div>
      );
    default:
      return null;
  }
}
