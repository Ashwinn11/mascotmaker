import Link from "next/link";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";
import Image from "next/image";
import { Sparkles, Palette, Clapperboard, Check, Zap, Play, Layers, ArrowRight, HelpCircle, ShoppingCart, WandSparkles, Trash } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";
import { JSONLD } from "@/components/json-ld";
import { STYLES, INDUSTRIES } from "@/lib/seo-data";

const EXAMPLES = [
  "Flat Minimalist Logo",
  "3D Pixar Character",
  "Isometric Game Asset",
  "Retro 80s Vibe",
  "Claymation Robot",
  "Cyberpunk Scene",
];

const ENGINES = [
  {
    title: "Mascot Engine",
    subtitle: "Identity Consistency",
    desc: "Create professional 3D, 2D, or retro characters with full DNA preservation across every action and expression.",
    icon: Palette,
    color: "bg-candy-pink",
    shadow: "shadow-[12px_12px_0_#ff6b9d]",
    border: "border-candy-pink",
    image: "/demo/hero-shiba.webp",
    link: "/create",
    badge: "Core Engine"
  }
];

const TOP_STYLES = STYLES.slice(0, 6);
const TOP_INDUSTRIES = [
  ...INDUSTRIES.filter(i => i.slug === "ai-startups"),
  ...INDUSTRIES.filter(i => i.slug !== "ai-startups").slice(0, 7)
];

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best AI mascot maker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mascot Maker is the world's most advanced AI mascot generator, designed for consistency across 3D, 2D, and animated character sets."
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
          "text": "Yes, we offer 5 free credits to all new users so you can try our AI mascot maker and background remover at no cost."
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
    <div className="bg-cream selection:bg-candy-pink/30 pb-20">
      <JSONLD data={faqSchema} />
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
                <Image src="/app-icon.png" alt="Mascot Maker AI character generator icon" width={24} height={24} className="rounded-md" />
                Studio V2.5 • The Asset Engine
              </div>

              <h1 className="font-display text-7xl sm:text-8xl lg:text-[10rem] text-foreground leading-[0.82] mb-12 -tracking-[0.06em] animate-slide-up stagger-1 capitalize">
                The Ultimate AI <br />
                <span className="text-gradient drop-shadow-sm">Mascot Maker</span>
              </h1>

              <p className="text-2xl sm:text-3xl text-muted-foreground/90 max-w-xl mb-16 font-semibold leading-[1.1] -tracking-wide animate-slide-up stagger-2">
                The world&apos;s most powerful AI mascot maker & builder for consistent character sets, 3D assets, and marketing storyboards.
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
                      alt="AI-generated animated mascot character with motion keyframes showing walk cycle"
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
                    <Image src="/demo/hero-stickers.webp" alt="AI-generated sticker pack with multiple character expressions and poses" fill className="object-cover p-6 group-hover:scale-110 transition-transform duration-1000" />
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

        {/* --- Stats Bar --- */}
        <div className="absolute bottom-0 left-0 right-0 bg-foreground border-y-4 border-foreground py-6 overflow-hidden hidden md:block">
            <div className="mx-auto max-w-7xl px-6 flex justify-around items-center">
                {[
                    { label: "Mascots Generated", val: "1,000+" },
                    { label: "Premium Styles", val: "12+" },
                    { label: "Free Credits", val: "5" },
                    { label: "Countries Served", val: "90+" }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <span className="text-candy-pink text-4xl font-display">{stat.val}</span>
                        <span className="text-white/60 text-xs font-black uppercase tracking-widest">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-1 h-12 rounded-full bg-foreground/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-foreground animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-32 bg-cream border-b-4 border-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-24 text-center">
             <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-yellow/10 border-2 border-candy-yellow/20 text-xs font-black uppercase tracking-widest text-candy-yellow">
              The Process
            </div>
            <h2 className="font-display text-5xl md:text-8xl uppercase leading-none mb-6">
              How To <br /> <span className="text-gradient">Make A Mascot</span>
            </h2>
            <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto italic">
              Crafting your brand's unique identity in 3 simple steps with our advanced AI mascot builder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
             <div className="absolute top-1/2 left-0 w-full h-1 border-t-4 border-dashed border-foreground/5 hidden lg:block -z-10" />
             {[
                { 
                    icon: <Palette size={40} className="text-candy-pink" />, 
                    title: "Brand DNA", 
                    text: "Pick an industry, style, and describe your character. Our AI understands artistic context." 
                },
                { 
                    icon: <Zap size={40} className="text-candy-yellow" />, 
                    title: "AI Generation", 
                    text: "Identity Lock technology creates a consistent set of poses and expressions in seconds." 
                },
                { 
                    icon: <ShoppingCart size={32} className="text-candy-green" />, 
                    title: "Full Ownership", 
                    text: "Download crisp, high-res files with full commercial rights for your business or game." 
                }
             ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-10 rounded-[3rem] border-3 border-foreground bg-white shadow-[8px_8px_0_#2d2420] transition-transform hover:scale-[1.02]">
                    <div className="w-20 h-20 rounded-full border-4 border-foreground bg-white flex items-center justify-center mb-8 shadow-[4px_4px_0_#2d2420]">
                        {item.icon}
                    </div>
                    <h3 className="font-display text-3xl uppercase mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed italic">{item.text}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* ─── Choose Your Style ─── */}
      <section className="py-32 bg-white border-b-4 border-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-green/10 border-2 border-candy-green/20 text-xs font-black uppercase tracking-widest text-candy-green">
              Art Styles
            </div>
            <h2 className="font-display text-5xl md:text-8xl uppercase leading-none mb-6">
              Choose Your <span className="text-gradient">Style</span>
            </h2>
            <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto">
              Every style is a specialized AI model. Pick the one that matches your brand DNA.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TOP_STYLES.map((style) => (
              <Link
                key={style.slug}
                href={`/mascot-maker/${style.slug}`}
                className="group relative p-6 rounded-3xl border-3 border-foreground bg-cream hover:bg-candy-pink/10 transition-all shadow-[6px_6px_0_#2d2420] hover:shadow-[3px_3px_0_#2d2420] hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                <h3 className="font-black text-sm uppercase tracking-tight text-foreground group-hover:text-candy-pink transition-colors">{style.title}</h3>
                <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-tight">{style.description.slice(0, 60)}...</p>
                <ArrowRight size={16} className="mt-3 text-foreground/30 group-hover:text-candy-pink group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/explore" className="text-sm font-black uppercase tracking-widest text-candy-pink hover:underline">
              View all {STYLES.length} styles →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Style Showcase ─── */}
      <section className="py-40 bg-white border-b-4 border-foreground overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative z-10 rounded-[4rem] border-4 border-foreground overflow-hidden shadow-[30px_30px_0_#ffc857] transition-transform duration-700 group-hover:scale-[1.02]">
                <Image src="/demo/style-showcase.webp" alt="AI mascot generator showing multiple art styles including 3D Pixar, claymation, pixel art, and vector designs" width={800} height={800} className="w-full h-auto object-cover" />
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
                From Pixar-grade 3D renders to retro pixel art and high-fidelity isometric game assets. Generate consistent mascot sets across every action and expression.
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

      {/* ─── Free AI Tools ─── */}
      <section className="py-24 bg-foreground border-b-4 border-foreground overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border-2 border-white/20 text-xs font-black uppercase tracking-widest text-white/50 mb-6">
                    Free Ecosystem
                </div>
                <h2 className="font-display text-5xl md:text-8xl text-white uppercase leading-none mb-6">
                    FREE <span className="text-candy-pink">AI TOOLS</span>
                </h2>
                <p className="text-xl text-white/40 font-bold max-w-xl mb-12">
                    Beyond generation. Use our free background remover to make your AI mascots ready for print, web, and social media instantly.
                </p>
                <Link 
                    href="/background-remover"
                    className="inline-flex items-center gap-4 rounded-full border-4 border-white bg-white px-10 py-5 text-xl font-black text-foreground hover:bg-candy-pink hover:text-white transition-all active:scale-95 shadow-[8px_8px_0_#4ea8de]"
                >
                    <WandSparkles size={24} />
                    USE BG REMOVER
                </Link>
            </div>
            <div className="flex-1 relative">
                <div className="w-full aspect-video rounded-[3rem] border-4 border-white overflow-hidden bg-white/5 p-4 flex items-center justify-center">
                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-white/20 checkers-dark">
                        <Image src="/demo/hero-shiba.webp" alt="Background removal demonstration" fill className="object-contain p-10 drop-shadow-2xl brightness-110" />
                    </div>
                </div>
                <div className="absolute -top-6 -right-6 animate-float">
                    <div className="w-20 h-20 rounded-2xl bg-candy-pink border-4 border-white flex items-center justify-center rotate-12 shadow-xl">
                        <Trash size={32} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ─── Popular Use Cases ─── */}
      <section className="py-32 bg-cream border-b-4 border-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-blue/10 border-2 border-candy-blue/20 text-xs font-black uppercase tracking-widest text-candy-blue">
              Industries
            </div>
            <h2 className="font-display text-5xl md:text-8xl uppercase leading-none mb-6">
              Built For <span className="text-candy-blue">Your Industry</span>
            </h2>
            <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto">
              Specialized AI models fine-tuned for your niche. From Discord bots to SaaS products.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TOP_INDUSTRIES.map((industry) => (
              <Link
                key={industry.slug}
                href={`/mascot-maker/${industry.slug}`}
                className="group p-6 rounded-3xl border-3 border-foreground bg-white hover:bg-candy-blue/5 transition-all shadow-[6px_6px_0_#2d2420] hover:shadow-[3px_3px_0_#2d2420] hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                <h3 className="font-black text-lg uppercase tracking-tight text-foreground group-hover:text-candy-blue transition-colors">{industry.title}</h3>
                <p className="text-sm text-muted-foreground font-bold mt-2 leading-snug">{industry.description}</p>
                <ArrowRight size={16} className="mt-4 text-foreground/30 group-hover:text-candy-blue group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/explore" className="text-sm font-black uppercase tracking-widest text-candy-blue hover:underline">
              View all {INDUSTRIES.length} industries →
            </Link>
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
      <section className="py-40 bg-cream relative border-b-4 border-foreground overflow-hidden text-left">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">

            <div className="relative">
              <div className="relative z-10 rounded-[4rem] border-4 border-foreground bg-white p-16 shadow-[24px_24px_0_#ff6b9d] group overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-candy-pink/5 to-transparent -z-10" />

                <h3 className="font-display text-7xl md:text-[9rem] mb-10 leading-[0.8] uppercase -tracking-[0.05em]">
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
                {["/demo/hero-animation.webp", "/demo/hero-stickers.webp", "/demo/hero-shiba.webp", "/demo/style-showcase.webp"].map((img, i) => (
                  <div key={i} className="group relative w-24 aspect-square rounded-[2rem] border-3 border-foreground bg-white overflow-hidden shadow-[6px_6px_0_#e8ddd4] rotate-[-5deg] hover:rotate-0 transition-all">
                    <Image src={img} alt={`AI mascot design example ${i + 1} showing character consistency across styles`} fill className="object-cover p-2" />
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

      {/* ─── FAQ Section ─── */}
      <section className="py-24 bg-white border-b-4 border-foreground">
        <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-display text-5xl md:text-8xl uppercase text-center mb-16">Mascot Maker <span className="text-candy-pink">FAQ</span></h2>
            <div className="grid gap-6">
                {faqSchema.mainEntity.map((faq, i) => (
                    <div key={i} className="p-10 rounded-[3rem] border-3 border-foreground bg-white shadow-[8px_8px_0_#2d2420] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                        <h4 className="flex items-center gap-4 text-2xl font-black uppercase mb-4">
                            <HelpCircle size={28} className="text-candy-blue stroke-[3]" />
                            {faq.name}
                        </h4>
                        <p className="text-lg font-bold text-muted-foreground leading-relaxed italic">{faq.acceptedAnswer.text}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── Footer SEO Links ─── */}
      <ExploreLinks />
    </div>
  );
}
