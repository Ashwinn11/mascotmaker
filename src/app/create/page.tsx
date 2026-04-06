import type { Metadata } from "next";
import { MascotCreator } from "@/components/mascot-creator";

export const metadata: Metadata = {
  title: "Create Your Mascot",
  description:
    "Design a custom mascot character from a text description or image upload. Refine with AI chat and animate with one click — professional AI design system.",
  alternates: {
    canonical: "https://mascotmaker.io/create",
  },
};

export default function CreatePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0c0a09]">
      <div className="relative overflow-hidden border-b border-white/[0.04] bg-[#141210]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-candy-pink/10 border border-candy-pink/20 text-[10px] font-black uppercase tracking-[0.2em] text-candy-pink animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-candy-pink shadow-[0_0_8px_rgba(255,77,28,0.8)] animate-pulse" />
            Studio Engine Active
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-6 animate-slide-up leading-tight tracking-tight">
            Design Your Professional<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-pink to-candy-orange drop-shadow-sm">Mascot Character</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto animate-slide-up stagger-2 font-medium">
            The world's most advanced AI mascot creator. Create custom characters, build entire asset packs, and bring your designs to life.
          </p>
        </div>
        
        {/* Glow effects */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-candy-pink/20 to-transparent" />
      </div>

      <MascotCreator />

      {/* Substantial SEO Content Section */}
      <section className="mx-auto max-w-4xl px-6 py-24 border-t border-white/[0.04]">
        <div className="prose prose-lg prose-invert max-w-none space-y-16">
          <div className="space-y-6 text-center">
            <h2 className="font-display text-4xl text-white tracking-tight">How to Create your Custom AI Mascot</h2>
            <p className="text-white/40 leading-relaxed text-lg max-w-3xl mx-auto">
              Creating a custom mascot for your brand or project has never been easier than with Mascot Maker. Our advanced AI-driven design studio at mascotmaker.io allows anyone—from independent streamers to professional marketing teams—to generate high-fidelity, consistent character sets in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 pt-8">
            <div className="space-y-5 p-8 rounded-3xl bg-[#141210] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="font-bold text-xl text-white flex items-center gap-3 m-0">
                <span className="h-10 w-10 rounded-xl bg-candy-pink/10 border border-candy-pink/20 flex items-center justify-center text-candy-pink text-sm shadow-[0_0_15px_rgba(255,77,28,0.1)]">1</span>
                Define Your Vision
              </h3>
              <p className="text-sm text-white/40 leading-relaxed m-0">
                Start by entering a detailed description of the character you want to create. Whether you need a "tech-savvy shiba inu in a hoodie" or a "menacing steampunk owl," our engine understands complex artistic styles. You can also upload a reference image.
              </p>
            </div>
            
            <div className="space-y-5 p-8 rounded-3xl bg-[#141210] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="font-bold text-xl text-white flex items-center gap-3 m-0">
                <span className="h-10 w-10 rounded-xl bg-candy-blue/10 border border-candy-blue/20 flex items-center justify-center text-candy-blue text-sm">2</span>
                Choose Your Style
              </h3>
              <p className="text-sm text-white/40 leading-relaxed m-0">
                Select from our curated list of professional art styles. From cinematic 3D realism to flat vector logos, we have a style for every branding need. Our styles are specifically tuned to produce clean, high-resolution results.
              </p>
            </div>
            
            <div className="space-y-5 p-8 rounded-3xl bg-[#141210] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="font-bold text-xl text-white flex items-center gap-3 m-0">
                <span className="h-10 w-10 rounded-xl bg-candy-orange/10 border border-candy-orange/20 flex items-center justify-center text-candy-orange text-sm">3</span>
                Refine with AI Chat
              </h3>
              <p className="text-sm text-white/40 leading-relaxed m-0">
                Once the initial design is generated, use our integrated AI Chat Refiner to make precise adjustments. Ask the mascot to "change the eye color to green." This iterative process ensures you get the exact design you had in mind.
              </p>
            </div>
            
            <div className="space-y-5 p-8 rounded-3xl bg-[#141210] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="font-bold text-xl text-white flex items-center gap-3 m-0">
                <span className="h-10 w-10 rounded-xl bg-candy-yellow/10 border border-candy-yellow/20 flex items-center justify-center text-candy-yellow text-sm shadow-[0_0_15px_rgba(245,200,66,0.1)]">4</span>
                Animate and Deploy
              </h3>
              <p className="text-sm text-white/40 leading-relaxed m-0">
                Bring your character to life with our seamless animation engine. Generate animated GIFs of your mascot performing various actions. You retain full commercial rights to all outputs generated at mascotmaker.io.
              </p>
            </div>
          </div>

          <div className="pt-16 space-y-6 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl text-white tracking-tight m-0">Why Consistent Character Design Matters</h2>
            <p className="text-white/40 leading-relaxed m-0 text-lg">
              In modern digital marketing, consistency is king. Mascot Maker is designed to solve the "identity drift" problem common in most AI generators. We ensure that your mascot's colors, facial features, and body structure remain identical across different poses, asset types, and animations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
