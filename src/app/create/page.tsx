import type { Metadata } from "next";
import { MascotCreator } from "@/components/mascot-creator";

export const metadata: Metadata = {
  title: "Create",
  description:
    "Describe a character or upload an image and let AI turn it into a custom animated mascot.",
};

export default function CreatePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-dotted">
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-candy-pink/5 via-candy-orange/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-4 text-center">
          <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-3 animate-slide-up">
            Create Your <span className="text-gradient">Mascot</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto animate-slide-up stagger-2">
            Describe a character, refine it with AI chat, then animate it into a GIF.
          </p>
        </div>
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-candy-pink/10 blur-3xl" />
        <div className="absolute -top-10 -right-20 h-48 w-48 rounded-full bg-candy-blue/10 blur-3xl" />
      </div>

      <MascotCreator />
    </div>
  );
}
