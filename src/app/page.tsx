import { MascotCreator } from "@/components/mascot-creator";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-dotted">
      {/* Hero section */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-candy-pink/5 via-candy-orange/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-4 text-center">
          <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-3 animate-slide-up">
            Bring Your <span className="text-gradient">Mascot</span> to Life
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto animate-slide-up stagger-2" style={{ opacity: 0 }}>
            Describe a character, iterate on the design, then generate animated GIFs — all powered by AI
          </p>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-candy-pink/10 blur-3xl" />
        <div className="absolute -top-10 -right-20 h-48 w-48 rounded-full bg-candy-blue/10 blur-3xl" />
      </div>

      <MascotCreator />
    </div>
  );
}
