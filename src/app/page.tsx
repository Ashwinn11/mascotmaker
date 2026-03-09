"use client";

import Link from "next/link";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";
import Image from "next/image";
import { Sparkles, Palette, Clapperboard, Check, Zap, Play, Layers } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";

const EXAMPLES = [
  "Flat Minimalist Logo",
  "3D Pixar Character",
  "Isometric Game Asset",
  "8-Frame Storyboard",
  "Character-Product Mix",
  "Retro 80s Vibe",
  "Claymation Robot",
  "Cyberpunk Scene",
];

const ENGINES = [
  {
    title: "Mascot Engine",
    subtitle: "Identity Consistency",
    desc: "Create professional 3D, 2D, or retro characters with full DNA preservation across every action.",
    icon: Palette,
    color: "bg-candy-pink",
    shadow: "shadow-[12px_12px_0_#ff6b9d]",
    border: "border-candy-pink",
    image: "/demo/hero-shiba.webp",
    link: "/create?tab=mascot",
    badge: "Most Popular"
  },
  {
    title: "Story Studio",
    subtitle: "Narrative Flow",
    desc: "Design seamless 8-frame narratives. Perfect for storyboards, social content, and brand storytelling.",
    icon: Clapperboard,
    color: "bg-candy-blue",
    shadow: "shadow-[12px_12px_0_#4ea8de]",
    border: "border-candy-blue",
    image: "/demo/landing-story-v2.webp",
    link: "/create?tab=story",
    badge: "New Feature"
  },
  {
    title: "Mix Studio",
    subtitle: "Product Integration",
    desc: "Seamlessly composite characters with real-world products or complex environments for high-end ads.",
    icon: Layers,
    color: "bg-candy-green",
    shadow: "shadow-[12px_12px_0_#5cd85c]",
    border: "border-candy-green",
    image: "/demo/landing-mix-v2.webp",
    link: "/create?tab=mix",
    badge: "Pro Engine"
  }
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mascot Maker Studio",
    "url": "https://mascotmaker.io",
    "logo": "https://mascotmaker.io/app-icon.png",
    "description": "The world's most powerful AI design hub for characters, storyboards, and product ads.",
    "sameAs": [
      "https://twitter.com/mascotmaker",
      "https://discord.gg/mascotmaker"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mascot Maker",
    "url": "https://mascotmaker.io",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mascotmaker.io/gallery?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="bg-cream selection:bg-candy-pink/30 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] lg:min-h-screen overflow-hidden bg-white bg-grain flex items-center border-b-4 border-foreground selection:bg-candy-yellow/30">

        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-candy-pink/5 blur-[120px] rounded-full animate-float-delayed" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-candy-blue/5 blur-[120px] rounded-full animate-float" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">

            {/* Left Column: Massive Typography */}
            <div className="lg:col-span-12 xl:col-span-7 text-left">
              <div className="mb-10 inline-flex items-center gap-3 rounded-full border-3 border-foreground bg-white px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-foreground shadow-[4px_4px_0_#2d2420] animate-slide-up">
                <Image src="/app-icon.png" alt="Icon" width={24} height={24} className="rounded-md" />
                Studio V2.5 • The Asset Engine
              </div>

              <h1 className="font-display text-7xl sm:text-8xl lg:text-[11.5rem] text-foreground leading-[0.82] mb-12 -tracking-[0.06em] animate-slide-up stagger-1">
                CREATE <br />
                <span className="text-gradient drop-shadow-sm">WORLDS.</span>
              </h1>

              <p className="text-2xl sm:text-3xl text-muted-foreground/90 max-w-xl mb-16 font-semibold leading-[1.1] -tracking-wide animate-slide-up stagger-2">
                Unified design engines for characters, cinematically consistent stories, and professional product compositing.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 animate-slide-up stagger-3">
                <Link
                  href="/create"
                  className="group relative inline-flex items-center justify-center gap-5 rounded-[2.5rem] bg-foreground px-14 py-7 text-2xl font-black text-white shadow-[8px_8px_0_#ff6b9d] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-[0.95]"
                >
                  <Sparkles size={28} className="text-candy-yellow" />
                  LAUNCH STUDIO
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center gap-5 rounded-[2.5rem] border-4 border-foreground bg-white px-14 py-7 text-2xl font-black text-foreground shadow-[8px_8px_0_#e8ddd4] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-[0.95]"
                >
                  EXPLORE
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Stack - SPREAD OUT FOR FULL VISIBILITY */}
            <div className="lg:col-span-12 xl:col-span-5 relative hidden lg:block animate-pop-in stagger-4">
              <div className="relative w-full h-[650px] max-w-[600px] ml-auto">

                {/* Animation Card - Top Right */}
                <div className="absolute top-0 right-[-5%] w-[75%] aspect-square rounded-[4rem] border-4 border-foreground bg-white p-6 shadow-[24px_24px_0_#4ea8de] rotate-6 hover:rotate-2 transition-all duration-700 overflow-hidden group z-20">
                  <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden bg-dotted/20">
                    <Image
                      src="/demo/hero-animation.webp"
                      alt="Animation"
                      fill
                      priority={true}
                      className="object-contain p-8 group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                  <div className="absolute top-10 right-10 glass-card px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">Motion Engine</div>
                </div>

                {/* Stickers Card - Bottom Left, Moved further for visibility */}
                <div className="absolute bottom-0 left-[-15%] w-[70%] aspect-square rounded-[4rem] border-4 border-foreground bg-candy-yellow p-6 shadow-[20px_20px_0_#2d2420] -rotate-12 hover:-rotate-6 transition-all duration-700 overflow-hidden group z-10">
                  <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden bg-white/40">
                    <Image src="/demo/hero-stickers.webp" alt="Stickers" fill className="object-cover p-6 group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div className="absolute bottom-10 left-10 glass-card px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">Asset Packs</div>
                </div>

                {/* Floating Props - Kept as 3D for Flair */}
                <div className="absolute top-[40%] right-[-10%] animate-float z-30">
                  <Icon3D name="party-popper" size="2xl" />
                </div>
                <div className="absolute top-[-5%] left-[10%] animate-float-delayed z-30 opacity-80 rotate-12">
                  <Icon3D name="high-voltage" size="xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-1 h-12 rounded-full bg-foreground/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-foreground animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </section>

      {/* ─── Style Showcase ─── */}
      <section className="py-40 bg-white border-b-4 border-foreground overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative z-10 rounded-[4rem] border-4 border-foreground overflow-hidden shadow-[30px_30px_0_#ffc857] transition-transform duration-700 group-hover:scale-[1.02]">
                <Image src="/demo/style-showcase.webp" alt="Style Showcase" width={800} height={800} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-10 -right-10 animate-float z-20">
                <div className="w-32 h-32 rounded-3xl border-4 border-foreground bg-candy-green flex items-center justify-center shadow-[10px_10px_0_#2d2420] rotate-12">
                  <Palette size={64} className="text-white" />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 text-xs font-black uppercase tracking-widest text-candy-pink">
                Visual DNA
              </div>
              <h2 className="font-display text-7xl md:text-9xl text-foreground leading-[0.85] uppercase -tracking-[0.05em] mb-10">
                ANY <span className="text-gradient">STYLE.</span> <br />
                ZERO LIMITS.
              </h2>
              <p className="text-2xl text-muted-foreground font-bold leading-relaxed mb-12">
                From Pixar-grade 3D renders to retro pixel art and high-fidelity isometric game assets. Our engines learn your brand&apos;s style and keep it consistent across every frame.
              </p>

              <div className="flex flex-wrap gap-4">
                {["3D Pixar", "Claymation", "Isometric", "Aureepunk", "8-Bit Retro", "Minimalist"].map((style, i) => (
                  <span key={i} className="px-6 py-2.5 rounded-2xl border-2 border-foreground bg-cream text-xs font-black uppercase tracking-widest shadow-[4px_4px_0_#2d2420]">
                    {style}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Unified Engines (Grid) ─── */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="max-w-4xl mb-24 text-center lg:text-left mx-auto lg:ml-0">
            <h2 className="font-display text-8xl md:text-[8.5rem] text-foreground leading-[0.85] uppercase -tracking-[0.05em] mb-10 stagger-1">
              THE STUDIO <br />
              <span className="text-gradient">WORKFLOW.</span>
            </h2>
            <p className="text-3xl text-muted-foreground font-bold leading-tight max-w-2xl stagger-2">
              Three specialized engines designed to handle every stage of your creative production.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-stretch">
            {ENGINES.map((engine, i) => (
              <Link key={i} href={engine.link} className={`group flex flex-col rounded-[3.5rem] border-4 border-foreground bg-white overflow-hidden transition-all duration-500 hover:-translate-y-3 ${engine.shadow}`}>
                <div className="relative aspect-square overflow-hidden border-b-4 border-foreground">
                  <div className="absolute inset-0 bg-dotted opacity-[0.05]" />
                  <Image
                    src={engine.image}
                    alt={engine.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="glass-card px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border-2 border-foreground/5">{engine.badge}</div>
                  </div>
                  {/* Lucide Icon in solid box */}
                  <div className="absolute bottom-6 right-6">
                    <div className={`w-14 h-14 rounded-2xl border-4 border-foreground ${engine.color} flex items-center justify-center text-white shadow-[4px_4px_0_#2d2420] group-hover:rotate-12 transition-transform`}>
                      <engine.icon size={28} />
                    </div>
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <span className={`text-xs font-black uppercase tracking-[0.2em] mb-2 ${engine.color.replace('bg-', 'text-')}`}>{engine.subtitle}</span>
                  <h3 className="font-display text-4xl mb-4 leading-none uppercase -tracking-tighter">{engine.title}</h3>
                  <p className="text-muted-foreground font-bold leading-relaxed text-sm">{engine.desc}</p>

                  <div className="mt-auto pt-8 flex items-center gap-2 font-black text-xs uppercase tracking-widest text-foreground group-hover:gap-4 transition-all">
                    Open Engine <Play size={14} className="fill-candy-green text-candy-green" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Marquee Section ─── */}
      <section className="bg-foreground py-10 overflow-hidden border-b-4 border-foreground">
        <div className="flex animate-marquee gap-12 whitespace-nowrap">
          {[...EXAMPLES, ...EXAMPLES, ...EXAMPLES].map((ex, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-5 text-4xl font-display font-black text-white/30 uppercase tracking-tighter"
            >
              <span className="text-candy-pink text-5xl">★</span>
              {ex}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Rights Section (High Energy) ─── */}
      <section className="py-40 bg-cream relative border-b-4 border-foreground overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">

            <div className="relative">
              <div className="relative z-10 rounded-[4rem] border-4 border-foreground bg-white p-16 shadow-[24px_24px_0_#ff6b9d] group overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-candy-pink/5 to-transparent -z-10" />

                <h3 className="font-display text-7xl md:text-9xl mb-10 leading-[0.8] uppercase -tracking-[0.05em]">
                  OWN THE <br />
                  <span className="text-candy-pink">OUTPUT.</span>
                </h3>

                <div className="grid gap-6">
                  {[
                    { label: "Full Commercial Freedom", color: "text-candy-green" },
                    { label: "Zero Attribution Required", color: "text-candy-blue" },
                    { label: "High-Resolution Masters", color: "text-candy-purple" },
                    { label: "Direct Layered Exports", color: "text-candy-orange" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 text-2xl font-black text-foreground uppercase tracking-tight group/item">
                      <div className="h-8 w-8 rounded-xl border-3 border-foreground bg-white flex items-center justify-center group-hover/item:rotate-12 transition-transform">
                        <Check size={18} className="text-candy-green stroke-[4px]" />
                      </div>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Massive Floating Prop */}
              <div className="absolute -top-16 -right-16 animate-float-delayed z-20">
                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-foreground bg-candy-yellow flex items-center justify-center shadow-[8px_8px_0_#2d2420] rotate-12">
                  <Icon3D name="party-popper" size="2xl" />
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h4 className="font-display text-5xl mb-6 leading-[0.9] uppercase -tracking-tighter">
                  DESIGNED FOR <br />CREATIVE TEAMS.
                </h4>
                <p className="text-2xl text-muted-foreground leading-relaxed font-bold italic">
                  &ldquo;Mascot Maker provides the consistency of a custom photoshoot with the speed of pure thought.&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {["/demo/hero-animation.webp", "/demo/landing-story-v2.webp", "/demo/landing-mix-v2.webp", "/demo/hero-shiba.webp"].map((img, i) => (
                  <div key={i} className="group relative w-24 aspect-square rounded-[2rem] border-3 border-foreground bg-white overflow-hidden shadow-[6px_6px_0_#e8ddd4] rotate-[-5deg] hover:rotate-0 transition-all">
                    <Image src={img} alt="example" fill className="object-cover p-2" />
                  </div>
                ))}
              </div>

              <Link
                href="/create"
                className="inline-flex items-center gap-4 rounded-full border-4 border-foreground bg-foreground px-10 py-5 text-xl font-black text-white hover:bg-candy-pink transition-all active:scale-95 shadow-[8px_8px_0_#ffc857]"
              >
                START CREATING NOW
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Lines */}
        <div className="absolute top-0 right-0 w-1/3 h-full border-l-4 border-foreground/5 skew-x-[-15deg] pointer-events-none" />
      </section>

      {/* ─── Footer SEO Links ─── */}
      <ExploreLinks />
    </div>
  );
}
