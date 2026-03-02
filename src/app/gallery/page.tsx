import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse animated mascots created by the community. Hover to see them come alive!",
};

export default function GalleryPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-dotted">
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-candy-purple/5 via-candy-blue/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-3 animate-slide-up">
            Mascot <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto animate-slide-up stagger-2">
            Browse mascots created by the community. Hover to see them animate!
          </p>
        </div>
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-candy-purple/10 blur-3xl" />
        <div className="absolute -top-10 -left-20 h-48 w-48 rounded-full bg-candy-green/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <GalleryGrid />
      </div>
    </div>
  );
}
