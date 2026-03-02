import Link from "next/link";

const STEPS = [
  {
    num: 1,
    title: "Describe or Upload",
    description:
      "Type a character idea or upload any image. Our AI transforms it into a polished mascot instantly.",
    emoji: "✏️",
    color: "from-candy-pink to-candy-orange",
  },
  {
    num: 2,
    title: "Refine with Chat",
    description:
      "Not quite right? Chat with the AI to tweak colors, add accessories, change expressions — iterate until it's perfect.",
    emoji: "💬",
    color: "from-candy-orange to-candy-yellow",
  },
  {
    num: 3,
    title: "Animate & Share",
    description:
      "Pick an action — wave, dance, jump — and get a looping animated GIF. Download it or publish to the gallery.",
    emoji: "🎬",
    color: "from-candy-blue to-candy-purple",
  },
];

const FEATURES = [
  {
    emoji: "⚡",
    title: "Instant Generation",
    description: "From text to mascot in seconds, powered by Google Gemini.",
  },
  {
    emoji: "🎨",
    title: "Upload Anything",
    description: "Turn photos, sketches, or logos into cartoon mascot characters.",
  },
  {
    emoji: "🔄",
    title: "Iterative Refinement",
    description: "Chat-based editing — just describe what to change.",
  },
  {
    emoji: "🎞️",
    title: "Animated GIFs",
    description: "Generate sprite-sheet animations with one click.",
  },
  {
    emoji: "🌐",
    title: "Community Gallery",
    description: "Publish creations and browse what others have made.",
  },
  {
    emoji: "📥",
    title: "Free Downloads",
    description: "Download your mascots and GIFs — no watermarks, no strings.",
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-border bg-white px-4 py-1.5 text-sm font-semibold text-warm-gray shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-candy-green animate-pulse" />
              Powered by Google Gemini
            </div>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground mb-6 animate-slide-up stagger-1">
            Dream It.{" "}
            <span className="text-gradient">Generate It.</span>
            <br />
            Animate It.
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up stagger-2">
            Turn any idea into a custom animated mascot in minutes.
            Describe a character, refine it with AI chat, and bring it to life as an animated GIF.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <Link
              href="/create"
              className="rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-8 py-4 text-lg font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:shadow-candy-pink/30 hover:brightness-105 active:scale-[0.98]"
            >
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
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-candy-pink/8 blur-3xl" />
        <div className="absolute -top-20 -right-32 h-80 w-80 rounded-full bg-candy-blue/8 blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-candy-yellow/6 blur-3xl" />
      </section>

      {/* Example prompts marquee */}
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

      {/* How it Works */}
      <section className="py-24 bg-dotted">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps from idea to animated mascot. No design skills needed.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group relative rounded-3xl border-2 border-border bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-candy-pink/5 hover:-translate-y-1"
              >
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-2xl shadow-md`}>
                  {step.emoji}
                </div>
                <div className="absolute top-6 right-6 font-display text-5xl text-muted/60">
                  {step.num}
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-transparent via-candy-purple/3 to-transparent">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A complete toolkit for creating, customizing, and sharing mascot characters.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="group flex gap-4 rounded-2xl border-2 border-border bg-white p-5 transition-all hover:shadow-md hover:border-candy-pink/20"
              >
                <span className="text-3xl shrink-0">{feat.emoji}</span>
                <div>
                  <h3 className="font-display text-base text-foreground mb-0.5">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-dotted">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl border-2 border-border bg-white p-12 shadow-sm">
            <div className="animate-float text-6xl mb-6">🎨</div>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
              Ready to Create?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Your mascot is just a prompt away. Describe it, perfect it, animate it — all for free.
            </p>
            <Link
              href="/create"
              className="inline-block rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-10 py-4 text-lg font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:shadow-candy-pink/30 hover:brightness-105 active:scale-[0.98]"
            >
              Start Creating
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
