import { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";
import { auth } from "@/lib/auth";
import { getPurchasedGalleryItems } from "@/lib/db";

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

export default async function GalleryPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const purchasedItems = userId ? await getPurchasedGalleryItems(userId) : [];
  const purchasedIds = purchasedItems.map(item => item.id);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0c0a09]">
      <div className="relative overflow-hidden border-b border-white/[0.04] bg-[#141210]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-candy-blue/10 border border-candy-blue/20 text-[10px] font-black uppercase tracking-[0.2em] text-candy-blue animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-candy-blue shadow-[0_0_8px_rgba(78,168,222,0.8)] animate-pulse" />
            Community Driven
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-6 animate-slide-up leading-tight tracking-tight">
            Mascot <span className="text-candy-pink drop-shadow-sm">Gallery.</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto animate-slide-up stagger-2 font-medium">
            Discover community-powered character design. Filter by style, industry, or search for your favorite mascot.
          </p>
        </div>
        
        {/* Glow effects */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-candy-blue/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <GalleryGrid currentUserId={userId} purchasedIds={purchasedIds} />
      </div>

      {/* Substantial SEO Content Section */}
      <section className="mx-auto max-w-4xl px-6 py-24 border-t border-white/[0.04]">
        <div className="prose prose-lg prose-invert max-w-none space-y-16">
          <div className="space-y-6 text-center">
            <h2 className="font-display text-4xl text-white tracking-tight">The Design Showcase</h2>
            <p className="text-white/40 leading-relaxed text-lg max-w-3xl mx-auto">
              We track a lot of data on what makes a "good" mascot. The characters you see here aren't just accidents—they're the result of creators leveraging the specific material shaders of our 8 engines. We encourage you to browse not just for the looks, but for the consistency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 pt-8">
            <div className="space-y-5 p-8 rounded-3xl bg-[#141210] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="font-bold text-xl text-white flex items-center gap-3 m-0">
                <span className="h-10 w-10 rounded-xl bg-candy-pink/10 border border-candy-pink/20 flex items-center justify-center text-candy-pink text-sm shadow-[0_0_15px_rgba(255,77,28,0.1)]">1</span>
                Identity Lock System
              </h3>
              <p className="text-sm text-white/40 leading-relaxed m-0">
                A mascot isn't a one-off image. It's a visual asset that needs to work on a landing page, a physical sticker, and a 16px favicon. In this gallery, you'll see how our community uses the Identity Lock system.
              </p>
            </div>
            
            <div className="space-y-5 p-8 rounded-3xl bg-[#141210] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="font-bold text-xl text-white flex items-center gap-3 m-0">
                <span className="h-10 w-10 rounded-xl bg-candy-blue/10 border border-candy-blue/20 flex items-center justify-center text-candy-blue text-sm">2</span>
                Consistency Matters
              </h3>
              <p className="text-sm text-white/40 leading-relaxed m-0">
                Ensure your brand characters don't look like "AI hallucinations" when they move between styles. If you're building a brand, this is the only way to maintain trust with your audience.
              </p>
            </div>
          </div>

          <div className="pt-16 space-y-6 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl text-white tracking-tight m-0">The Future of Personal Branding</h2>
            <p className="text-white/40 leading-relaxed m-0 text-lg italic">
              From Discord server identities to SaaS "Helper" characters, the era of faceless corporations is ending. Use this gallery to find a style that resonates with your vision, then hop into the studio to make it yours. 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
