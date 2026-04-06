import { Metadata } from "next";
import { BackgroundRemoverTool } from "@/components/background-remover-tool";
import { Check, Zap, Info, ShieldCheck, Download, Trash2 } from "lucide-react";
import { JSONLD } from "@/components/json-ld";
import { ExploreLinks } from "@/components/explore-links";

export const metadata: Metadata = {
  title: "Free AI Background Remover for Mascots & Logos",
  description: "Remove the background from your mascot or any image instantly with AI. High-quality transparent PNG output. 5 free credits for new users.",
  keywords: ["free background remover", "remove background from mascot", "AI image transparency", "transparent background maker", "remove bg online"],
  openGraph: {
    title: "Free AI Background Remover — Mascot Maker",
    description: "Instantly remove backgrounds from your mascots and characters with high precision.",
    type: "website",
    url: "https://mascotmaker.io/background-remover",
  },
  alternates: {
    canonical: "/background-remover",
  },
};

export default function BackgroundRemoverPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Remove Background from a Mascot Image",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload Image",
        "text": "Upload your mascot or any image you want to make transparent."
      },
      {
        "@type": "HowToStep",
        "name": "Process with AI",
        "text": "Our AI model identifies the subject and removes the background instantly."
      },
      {
        "@type": "HowToStep",
        "name": "Download PNG",
        "text": "Download your high-resolution transparent PNG mascot."
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the background remover free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All new users get 5 free credits which can be used to remove backgrounds from 5 different images."
        }
      },
      {
        "@type": "Question",
        "name": "What image formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We support JPG, PNG, and WebP formats."
        }
      },
      {
        "@type": "Question",
        "name": "Is the mascot quality preserved?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI model is specifically tuned for mascots and logos to ensure clean edges and high-resolution output."
        }
      }
    ]
  };

  return (
    <div className="bg-[#0c0a09] min-h-screen selection:bg-candy-pink/30 text-white">
      <JSONLD data={howToSchema} />
      <JSONLD data={faqSchema} />
      
      {/* ─── Hero Section: Focused & Clean ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#141210] border-b border-white/[0.04]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        
        <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#5cd85c] shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5cd85c] animate-pulse" />
                PRO AI UTILITY
            </div>
          <h1 className="font-display text-5xl md:text-7xl uppercase leading-tight tracking-tight drop-shadow-sm">
            Cutout <br /><span className="text-candy-pink">Studio.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-medium max-w-2xl mx-auto leading-relaxed">
            Standard AI tools give you halos and choppy edges. We tuned our engine specifically to handle character fur and mascot geometry.
          </p>

          {/* Main Tool Container */}
          <div className="max-w-3xl mx-auto mt-20 relative px-4">
            <div className="glass-dark p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/10 relative z-10">
              <BackgroundRemoverTool />
            </div>
            {/* Visual Flair */}
            <div className="absolute top-1/2 -right-12 hidden lg:block animate-float -translate-y-1/2 z-0">
                <div className="p-5 glass-dark rounded-2xl shadow-xl rotate-[12deg] border border-white/5 bg-[#1c1916]">
                    <ShieldCheck size={48} className="text-[#5cd85c]" />
                </div>
            </div>
            
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#5cd85c]/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── Benefit Bar ─── */}
      <section className="py-20 bg-[#0c0a09]">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Zap, label: "Instant Speed", desc: "AI removes background in < 2s", color: "candy-yellow" },
                    { icon: Download, label: "High Precision", desc: "Crisp edges for your mascots", color: "candy-pink" },
                    { icon: ShieldCheck, label: "Commercial Rights", desc: "Full ownership of output", color: "#5cd85c" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 p-8 rounded-[2rem] bg-[#141210] border border-white/5 hover:border-white/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className={`w-14 h-14 rounded-2xl bg-[#1c1916] shadow-sm flex items-center justify-center shrink-0 border border-white/10 text-${item.color.startsWith('#') ? '[#5cd85c]' : item.color}`}>
                            <item.icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-black uppercase text-xs tracking-widest text-white mb-1.5">{item.label}</h3>
                            <p className="text-sm font-medium text-white/50">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-24 bg-[#141210] border-y border-white/[0.04]">
        <div className="container mx-auto px-6 text-center">
            <h2 className="font-display text-4xl md:text-5xl uppercase mb-20 italic tracking-tight relative inline-block">
              <span className="relative z-10">Simple. Efficient.</span>
              <div className="absolute -bottom-3 left-0 right-0 h-3 bg-candy-pink/30 -skew-x-12 z-0" />
            </h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {[
                    { title: "Drop & Detect", text: "Drag your file in. Our logic separates the subject from the noise visually." },
                    { title: "Refine", text: "Our AI traces the edges at 4K resolution to avoid 'pixel bleed' on your site." },
                    { title: "Ship", text: "Download your high-res PNG. Ready for headers, Discord, or pitch decks." }
                ].map((item, idx) => (
                    <div key={idx} className="space-y-5 p-6 rounded-3xl hover:bg-white/5 transition-colors duration-300">
                        <div className="text-5xl font-display text-white/10 tracking-tighter">0{idx+1}</div>
                        <h3 className="text-lg font-black uppercase tracking-widest text-white">{item.title}</h3>
                        <p className="text-sm font-medium text-white/40 italic leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── FAQ Section: Compact ─── */}
      <section className="py-24 bg-[#0c0a09]">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-display text-4xl uppercase text-center mb-16 relative inline-block">
              <span className="relative z-10">FAQ</span>
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-candy-blue/30 -skew-x-12 z-0" />
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {[
                    { q: "Is it free for everyone?", a: "Every new user gets 5 free credits. Each background removal costs just 1 credit, making it effectively free for your first 5 removals!" },
                    { q: "Does it work for logos?", a: "Absolutely. Our AI is optimized for mascots, logo marks, and stickers." },
                    { q: "What's the best file type to upload?", a: "We support PNG, JPG, JPEG, and WebP. For best results, use high-contrast images." }
                ].map((faq, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-[#1c1916] border border-white/5 hover:border-white/10 hover:bg-[#201d19] transition-all duration-300 shadow-lg">
                        <h4 className="flex items-start gap-4 text-sm font-black uppercase text-white/80 mb-4 leading-tight">
                            <Info size={16} className="text-candy-blue shrink-0 mt-0.5" />
                            {faq.q}
                        </h4>
                        <p className="text-sm font-medium text-white/40 leading-relaxed italic">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <div className="py-20 bg-[#141210] border-t border-white/[0.04]">
        <ExploreLinks />
      </div>
    </div>
  );
}
