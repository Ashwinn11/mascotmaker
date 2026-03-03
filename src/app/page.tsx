"use client";

import Link from "next/link";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";
import Image from "next/image";

const EXAMPLES = [
  "A round panda DJ with headphones",
  "A cheerful cactus with sneakers",
  "A tiny dragon barista",
  "A fluffy cloud cat",
  "A brave knight cat",
  "A friendly robot chef",
];

export default function Home() {
  return (
    <div className="bg-cream selection:bg-candy-pink/30">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] overflow-hidden bg-grain flex items-center">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <div className="text-left animate-slide-up">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border-2 border-border bg-white px-5 py-2 text-sm font-bold text-warm-gray shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-candy-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-candy-green" />
                </span>
                Powered by Nano Banana 2
              </div>

              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-foreground leading-[0.9] mb-8 stagger-1">
                Make Your <br />
                <span className="text-gradient">Mascot</span> <br />
                Come Alive.
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground max-w-xl mb-12 stagger-2 font-medium leading-relaxed">
                The all-in-one studio to generate, refine, and animate premium mascot characters.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 stagger-3">
                <Link
                  href="/create"
                  className="group relative inline-flex items-center justify-center gap-3 rounded-3xl bg-foreground px-10 py-5 text-xl font-bold text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Icon3DInline name="sparkles" size={24} />
                  Start Creating
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center gap-3 rounded-3xl border-3 border-border bg-white px-10 py-5 text-xl font-bold text-warm-gray transition-all hover:border-candy-pink/40 hover:text-foreground active:scale-[0.98]"
                >
                  Explore Gallery
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="relative animate-pop-in stagger-4">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                {/* Featured Mascot Card */}
                <div className="col-span-2 group relative overflow-hidden rounded-[3rem] border-4 border-white bg-white shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-candy-pink/20">
                  <div className="aspect-[4/3] bg-candy-yellow/10 relative overflow-hidden">
                    <Image
                      src="/demo/hero-shiba.png"
                      alt="Cool Shiba Mascot"
                      fill
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Character Design</span>
                    </div>
                  </div>
                </div>

                {/* Stickers Card */}
                <div className="group relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-candy-blue/20">
                  <div className="aspect-square bg-candy-blue/10 relative">
                    <Image
                      src="/demo/hero-stickers.png"
                      alt="Cat Stickers"
                      fill
                      className="object-cover p-2 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-candy-blue text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Sticker Pack</span>
                    </div>
                  </div>
                </div>

                {/* Animation Card */}
                <div className="group relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-candy-green/20">
                  <div className="aspect-square bg-candy-green/10 relative">
                    <Image
                      src="/demo/hero-animation.png"
                      alt="Robot Animation"
                      fill
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-candy-green text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Animated Actions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Elements */}
              <div className="absolute -top-12 -right-12 h-40 w-40 animate-float opacity-50 blur-2xl bg-candy-pink hidden lg:block" />
              <div className="absolute -bottom-12 -left-12 h-40 w-40 animate-float-delayed opacity-50 blur-2xl bg-candy-blue hidden lg:block" />
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

      {/* ─── 3-in-1 Workflow ─── */}
      <section className="py-32 bg-dotted relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-display text-5xl sm:text-6xl text-foreground mb-6">
              More than just <span className="text-gradient">images.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Mascot Maker gives you a complete character bundle in every generation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "The Mascot",
                desc: "A high-resolution HERO character ready for your brand, logo, or avatar.",
                icon: "sparkles",
                color: "bg-candy-pink"
              },
              {
                title: "The Stickers",
                desc: "A 3x3 grid of expressions. Instant emojis, icons, and reaction stickers.",
                icon: "artist-palette",
                color: "bg-candy-blue"
              },
              {
                title: "The Animation",
                desc: "Perfectly looped GIF and WebP actions like waving, jumping, or dancing.",
                icon: "clapper-board",
                color: "bg-candy-green"
              }
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:-rotate-2 border-2 border-border" />
                <div className="relative p-10 flex flex-col items-center text-center transition-transform duration-300 group-hover:-translate-y-2">
                  <div className={`w-20 h-20 rounded-[1.5rem] ${item.color} flex items-center justify-center text-white shadow-lg mb-8 rotate-3 group-hover:rotate-0 transition-transform`}>
                    <Icon3D name={item.icon as any} size="xl" />
                  </div>
                  <h3 className="font-display text-2xl mb-4 uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bento Features ─── */}
      <section className="py-32 relative overflow-hidden bg-white/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[700px]">
            {/* Identity Preservation - Large Highlight */}
            <div className="md:col-span-2 md:row-span-2 rounded-[3.5rem] bg-cream border-2 border-border p-12 relative overflow-hidden group flex flex-col justify-between shadow-xl shadow-black/5 hover:shadow-candy-pink/10 transition-all duration-500 hover:-translate-y-1">
              <div className="relative z-10">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-candy-pink/10 text-candy-pink mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Icon3D name="high-voltage" size="xl" />
                </div>
                <h3 className="font-display text-5xl mb-6 leading-[1.1] uppercase tracking-tighter">Consistency <br /><span className="text-candy-pink">Preserved.</span></h3>
                <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-md">Our AI analyzes your character&apos;s DNA to ensure every iteration, sticker, and animation stays 100% true to your original design.</p>
              </div>
              <div className="mt-8 relative h-40 w-full rounded-3xl bg-white/50 border-2 border-dashed border-border flex items-center justify-center group-hover:bg-candy-pink/5 transition-colors">
                <Icon3D name="camera" size="2xl" animated />
                <div className="absolute inset-0 bg-dotted opacity-20" />
              </div>
            </div>

            {/* Photo-to-Mascot */}
            <div className="md:col-span-2 rounded-[3.5rem] bg-white border-2 border-border p-10 flex items-center gap-8 group hover:border-candy-blue/40 transition-all duration-300 shadow-lg shadow-black/5">
              <div className="flex-none w-24 h-24 rounded-3xl bg-candy-blue/10 flex items-center justify-center text-candy-blue group-hover:rotate-3 transition-transform">
                <Icon3D name="camera" size="xl" />
              </div>
              <div>
                <h3 className="font-display text-2xl mb-2 uppercase tracking-tighter">Photo-to-Mascot</h3>
                <p className="text-muted-foreground text-sm font-bold leading-snug">Transform real photos, sketches, or logos into polished 3D characters instantly.</p>
              </div>
            </div>

            {/* Chat Refinement */}
            <div className="md:col-span-2 rounded-[3.5rem] bg-white border-2 border-border p-10 flex items-center gap-8 group hover:border-candy-orange/40 transition-all duration-300 shadow-lg shadow-black/5">
              <div className="flex-none w-24 h-24 rounded-3xl bg-candy-orange/10 flex items-center justify-center text-candy-orange group-hover:-rotate-3 transition-transform">
                <Icon3D name="speech-balloon" size="xl" />
              </div>
              <div>
                <h3 className="font-display text-2xl mb-2 uppercase tracking-tighter">AI Chat Partner</h3>
                <p className="text-muted-foreground text-sm font-bold leading-snug">Refine your mascot using natural conversation. Ask for changes like a creative director.</p>
              </div>
            </div>

            {/* Unlocked Freedom - Wide Footer */}
            <div className="md:col-span-4 rounded-[3.5rem] bg-foreground p-8 md:p-12 text-white relative flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden mt-2">
              <div className="relative z-10 max-w-2xl">
                <h3 className="font-display text-4xl mb-4 text-gradient">UNLOCKED FREEDOM</h3>
                <p className="text-white/60 text-lg font-medium leading-tight">Master files, high-res PNGs, and animation sheets are all yours to keep. No watermarks, ever.</p>
              </div>
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                <Icon3D name="inbox-tray" size="xl" animated />
              </div>
              {/* Background effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-candy-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-40 bg-dotted flex justify-center items-center">
        <div className="text-center animate-slide-up">
          <h2 className="font-display text-7xl sm:text-9xl text-foreground mb-12 uppercase tracking-tighter leading-none">
            DREAM <br /> BIGGER.
          </h2>
          <Link
            href="/create"
            className="inline-flex items-center gap-4 rounded-full bg-foreground px-16 py-8 text-2xl font-black text-white shadow-2xl transition-all hover:scale-110 active:scale-95 hover:bg-candy-pink"
          >
            START DESIGNING
            <Icon3DInline name="sparkles" size={28} />
          </Link>
        </div>
      </section>
    </div>
  );
}
