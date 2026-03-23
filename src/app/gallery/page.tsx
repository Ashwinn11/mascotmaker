import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Mascot Gallery — Animated AI Characters",
  description:
    "Explore mascots created by the community. Shop, download, or get inspired for your own design. High-quality animated world of mascots.",
  alternates: {
    canonical: "https://mascotmaker.io/gallery",
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
            <h2 className="font-display text-3xl text-foreground">Explore the AI Character & Mascot Showcase</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to the premier showcase of AI-generated mascot characters. Our community gallery features the most creative and technically impressive mascots designed right here at mascotmaker.io. From stylized 3D animals to sleek minimalist logos, every character you see is the product of cutting-edge generative technology and refined human creativity. Whether you are a business owner looking for a brand identity or a creator building a new visual universe, our gallery is the perfect place to see the possibilities of consistent AI design.
            </p>
          </div>

          <div className="pt-8 space-y-6">
            <h2 className="font-display text-3xl text-foreground">Beyond Simple Avatars: The Multi-Engine Advantage</h2>
            <p className="text-muted-foreground leading-relaxed">
              What sets the assets in our gallery apart is the "Asset Engine" approach. Rather than generating a single disparate image, our users leverage the identity-locking technology of the Mascot Maker Studio to build entire brand packages. You’ll notice that many of the characters in this gallery exist in various forms—as 3D mascots, 9-frame sticker sheets, and clean vector icons. This cross-engine consistency is what makes our platform the top choice for professional design teams and indie developers alike.
            </p>
          </div>

          <div className="pt-8 space-y-6">
            <h3 className="font-bold text-xl text-foreground">The Future of Digital Identity</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As digital communities on platforms like Discord and Twitch continue to grow, the demand for unique, high-quality digital identities is higher than ever. The characters in this gallery demonstrate how AI can be used to create approachable, memorable, and legally-ownable mascots for any niche. By browsing the styles and prompts used by other creators, you can learn how to fine-tune your own characters to achieve the same level of professional polish and aesthetic appeal.
            </p>
          </div>

          <div className="pt-8 space-y-6">
            <h3 className="font-bold text-xl text-foreground">Join the Mascot Maker Community</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Mascot Maker gallery is more than just a list of images; it’s a living testament to the power of shared creativity. We encourage all our users to publish their best work to the gallery to inspire others and showcase the diverse styles achievable with our engine. From futuristic cyberpunk robots to charming Ghibli-inspired watercolors, the range of visual expression is truly limitless. Start your journey today in the studio and see your own creations featured alongside the best AI mascots in the world.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
