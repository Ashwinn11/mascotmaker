import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Mascot Gallery — Animated AI Characters",
  description:
    "Explore mascots created by the community. Shop, download, or get inspired for your own design. High-quality animated world of mascots.",
  alternates: {
    canonical: "https://mascotmaker.io/gallery",
  },
  openGraph: {
    title: "Mascot Gallery — Animated AI Characters",
    description: "Explore mascots created by the community. Shop, download, or get inspired.",
    url: "https://mascotmaker.io/gallery",
    siteName: "Mascot Maker",
    images: [{
      url: "https://mascotmaker.io/app-icon.png",
      width: 512,
      height: 512,
      alt: "Mascot Maker — Community Gallery",
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mascot Gallery — Powered by mascotmaker.io",
    images: ["https://mascotmaker.io/app-icon.png"],
  },
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
            Explore characters created by the community. Hover to see them come alive!
          </p>
        </div>
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-candy-purple/10 blur-3xl" />
        <div className="absolute -top-10 -left-20 h-48 w-48 rounded-full bg-candy-green/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <GalleryGrid />
      </div>

      <section className="mx-auto max-w-4xl px-6 py-20 border-t border-border/20">
        <div className="prose prose-lg prose-pink max-w-none space-y-12">
          <div className="space-y-6">
            <h2 className="font-display text-3xl text-foreground">The Design Showcase</h2>
            <p className="text-muted-foreground leading-relaxed">
              We track a lot of data on what makes a "good" mascot. The characters you see here aren&apos;t just accidents—they&apos;re the result of creators leveraging the specific material shaders of our 8 engines. We encourage you to browse not just for the looks, but for the consistency. Notice how a single character carries its personality across 3D, 2D, and sticker variations. That&apos;s the Mascot Maker moat.
            </p>
          </div>

          <div className="pt-8 space-y-6">
            <h2 className="font-display text-3xl text-foreground">Why Multi-Engine Consistency Matters</h2>
            <p className="text-muted-foreground leading-relaxed">
              A mascot isn&apos;t a one-off image. It&apos;s a visual asset that needs to work on a landing page, a physical sticker, and a 16px favicon. In this gallery, you&apos;ll see how our community uses the **Identity Lock** system to ensure their brand characters don&apos;t look like "AI hallucinations" when they move between styles. If you&apos;re building a brand, this is the only way to maintain trust with your audience.
            </p>
          </div>

          <div className="pt-8 space-y-6">
            <h3 className="font-bold text-xl text-foreground">The Future of Personal Branding</h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              From Discord server identities to SaaS "Helper" characters, the era of faceless corporations is ending. Use this gallery to find a style that resonates with your vision, then hop into the studio to make it yours. 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
