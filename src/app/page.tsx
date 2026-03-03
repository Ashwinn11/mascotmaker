import Link from "next/link";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";
import type { FluentIcon3D } from "@/components/ui/icon-3d";

const STEPS: { num: number; title: string; description: string; icon: FluentIcon3D }[] = [
  {
    num: 1,
    title: "Describe or Upload",
    description:
      "Just type what you imagine — or upload a photo, sketch, or logo. Nano Banana 2 turns it into a polished mascot in seconds.",
    icon: "pencil",
  },
  {
    num: 2,
    title: "Refine with Chat",
    description:
      "Talk to the AI like a creative partner. AI analyzes your mascot's identity to ensure consistent refinements as you iterate.",
    icon: "speech-balloon",
  },
  {
    num: 3,
    title: "Animate & Download",
    description: "Bring your character to life with actions like wave, dance, or jump. Download as an animated WebP or stickers.",
    icon: "clapper-board",
  },
];

const FEATURES: { icon: FluentIcon3D; title: string; description: string; span?: string }[] = [
  {
    icon: "high-voltage",
    title: "Nano Banana 2",
    description: "The latest in mascot generation technology. Faster, higher quality, and better style consistency than ever before.",
    span: "sm:col-span-2",
  },
  {
    icon: "camera",
    title: "Photo to Mascot",
    description: "Our advanced vision system analyzes your uploads to preserve colors and character traits during transformation.",
  },
  {
    icon: "counterclockwise",
    title: "Identity Preservation",
    description: "Refine your mascot with chat while preserving its core identity. The AI 'remembers' your character's unique features.",
  },
  {
    icon: "film-frames",
    title: "Animations & Stickers",
    description: "Generate perfectly consistent sprite-sheet animations and stickers with one click. 3-in-1 download options!",
    span: "sm:col-span-2",
  },
  {
    icon: "globe",
    title: "Community Gallery",
    description: "Publish your creations to the showcase and browse what the community has brought to life.",
  },
  {
    icon: "inbox-tray",
    title: "Free Downloads",
    description: "Download high-res mascots, animated WebPs, and stickers for free — no watermarks.",
  },
];

const EXAMPLES = [
  "A round panda DJ with headphones and turntables",
  "A cheerful cactus with sunglasses and sneakers",
  "A tiny dragon barista holding a latte",
  "A fluffy cloud cat floating on a rainbow",
  "A brave knight cat with a tiny sword",
  "A friendly robot chef with a spatula",
];

export default function Home() {
  return (
    <div className="bg-cream">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-grain">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-32 text-center">
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-border bg-white px-4 py-1.5 text-sm font-semibold text-warm-gray shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-candy-green animate-pulse" />
              Powered by Nano Banana 2
            </div>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground mb-6 animate-slide-up stagger-1">
            Dream It.{" "}
            <span className="text-gradient">Generate It.</span>
            <br />
            Animate It.
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up stagger-2">
            Create, refine, and animate mascot characters in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <Link
              href="/create"
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-8 py-4 text-lg font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:shadow-candy-pink/30 hover:brightness-105 active:scale-[0.98]"
            >
              <Icon3DInline name="sparkles" size={22} />
              Start Creating
            </Link>
            <Link
              href="/gallery"
              className="rounded-2xl border-2 border-border bg-white px-8 py-4 text-lg font-bold text-warm-gray shadow-sm transition-all hover:border-candy-pink/40 hover:text-foreground active:scale-[0.98]"
            >
              Browse Gallery
            </Link>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-candy-pink/15 blur-3xl" />
        <div className="absolute -top-20 -right-32 h-80 w-80 rounded-full bg-candy-blue/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-candy-yellow/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-candy-purple/5 blur-3xl" />
      </section>

      {/* ─── Marquee ─── */}
      <section className="border-y border-border/50 bg-white/50 py-5 overflow-hidden">
        <div className="flex animate-marquee gap-4 whitespace-nowrap">
          {[...EXAMPLES, ...EXAMPLES].map((ex, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-white px-4 py-2 text-sm font-semibold text-warm-gray"
            >
              <span className="text-candy-pink">&#x2731;</span>
              {ex}
            </span>
          ))}
        </div>
      </section>

      {/* ─── How it Works — Horizontal Timeline ─── */}
      <section className="py-28 bg-dotted relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps from idea to animated mascot. No design skills needed.
            </p>
          </div>

          {/* Timeline layout */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-candy-pink via-candy-yellow to-candy-blue opacity-30" />

            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map((step, i) => (
                <div key={step.num} className="relative flex flex-col items-center text-center group">
                  {/* Step number bubble */}
                  <div className="relative z-10 mb-6">
                    <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white border-2 border-border shadow-lg shadow-candy-pink/5 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-candy-pink/10 group-hover:-translate-y-2 group-hover:border-candy-pink/20">
                      <Icon3D name={step.icon} size="2xl" />
                    </div>
                    {/* Floating step number */}
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-candy-pink to-candy-orange text-xs font-bold text-white shadow-md">
                      {step.num}
                    </div>
                  </div>

                  <h3 className="font-display text-xl text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>

                  {/* Arrow between steps (mobile) */}
                  {i < STEPS.length - 1 && (
                    <div className="md:hidden mt-6 text-muted-foreground/30">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features — Bento Grid ─── */}
      <section className="py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent via-candy-purple/3 to-transparent" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-candy-blue/8 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 h-80 w-80 rounded-full bg-candy-pink/8 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A complete toolkit for creating, customizing, and sharing mascot characters.
            </p>
          </div>

          {/* Bento grid — 3 columns with some cards spanning 2 */}
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className={`group relative overflow-hidden rounded-3xl border-2 border-border/80 bg-white p-6 sm:p-7 shadow-md shadow-black/[0.03] transition-all duration-300 hover:shadow-xl hover:shadow-candy-pink/10 hover:border-candy-pink/30 hover:-translate-y-1 ring-1 ring-black/[0.03] ${feat.span || ""}`}
              >
                {/* Subtle gradient accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-candy-pink/0 to-candy-orange/0 group-hover:from-candy-pink/3 group-hover:to-candy-orange/3 transition-all duration-300 rounded-3xl" />

                <div className="relative z-10">
                  <div className="mb-4">
                    <Icon3D name={feat.icon} size="xl" />
                  </div>
                  <h3 className="font-display text-lg text-foreground mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 bg-dotted relative overflow-hidden">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-candy-yellow/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-candy-pink/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-[2rem] border-2 border-border bg-white p-10 sm:p-14 shadow-lg shadow-candy-pink/5">
            <div className="mb-6 flex justify-center">
              <Icon3D name="artist-palette" size="2xl" animated />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              Your Mascot Awaits
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Create a character that&apos;s uniquely yours with Nano Banana 2. Pick an action, generate stickers, and share it with the world.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-10 py-4 text-lg font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:shadow-candy-pink/30 hover:brightness-105 active:scale-[0.98]"
            >
              <Icon3DInline name="sparkles" size={22} />
              Start Creating
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
