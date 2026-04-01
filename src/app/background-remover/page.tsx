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
  }
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
    <div className="bg-cream min-h-screen selection:bg-candy-blue/30">
      <JSONLD data={howToSchema} />
      <JSONLD data={faqSchema} />
      
      {/* ─── Hero Section: Focused & Clean ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-mesh-candy bg-grain">
        <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-foreground/5 text-[10px] font-black uppercase tracking-widest text-foreground/50">
                PRO AI UTILITY
            </div>
          <h1 className="font-display text-6xl md:text-[9rem] uppercase leading-[0.85] tracking-tight">
            Clear <br /><span className="text-gradient">Backgrounds.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-semibold max-w-2xl mx-auto leading-relaxed">
            Perfect for mascots, stickers, and logos. Get high-resolution transparent PNGs in seconds.
          </p>

          {/* Main Tool Container */}
          <div className="max-w-3xl mx-auto mt-20 relative px-4">
            <div className="glass-card p-4 md:p-8 rounded-[3rem] shadow-premium border border-white/50">
              <BackgroundRemoverTool />
            </div>
            {/* Visual Flair */}
            <div className="absolute -top-10 -right-10 hidden md:block animate-float">
                <div className="p-4 glass-card rounded-2xl shadow-xl rotate-[12deg]">
                    <ShieldCheck size={40} className="text-candy-green" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefit Bar ─── */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Zap, label: "Instant Speed", desc: "AI removes background in < 2s" },
                    { icon: Download, label: "High Precision", desc: "Crisp edges for your mascots" },
                    { icon: ShieldCheck, label: "Commercial Rights", desc: "Full ownership of output" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 p-8 rounded-3xl bg-secondary/10 border border-foreground/5 hover:shadow-md transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-cream shadow-sm flex items-center justify-center text-foreground shrink-0 border border-foreground/5">
                            <item.icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-black uppercase text-xs tracking-widest text-foreground mb-1">{item.label}</h3>
                            <p className="text-sm font-semibold text-muted-foreground">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6 text-center">
            <h2 className="font-display text-4xl md:text-5xl uppercase mb-16 italic tracking-tight underline decoration-candy-pink decoration-[6px]">Simple. Efficient.</h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {[
                    { title: "Upload", text: "Drag & drop your JPG or PNG. The larger the better." },
                    { title: "Process", text: "Our AI identifies the subject and removes the background." },
                    { title: "Download", text: "Get your high-resolution file ready to use anywhere." }
                ].map((item, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="text-4xl font-display text-foreground/10 tracking-tighter">0{idx+1}</div>
                        <h3 className="text-lg font-black uppercase tracking-widest text-foreground">{item.title}</h3>
                        <p className="text-sm font-semibold text-muted-foreground italic leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── FAQ Section: Compact ─── */}
      <section className="py-24 bg-secondary/5 border-y border-foreground/5">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-display text-4xl uppercase text-center mb-16 underline decoration-candy-blue decoration-[8px] underline-offset-[12px]">FAQ</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {[
                    { q: "Is it free for everyone?", a: "Every new user gets 5 free credits. Each background removal costs just 1 credit, making it effectively free for your first 5 removals!" },
                    { q: "Does it work for logos?", a: "Absolutely. Our AI is optimized for mascots, logo marks, and stickers." },
                    { q: "What's the best file type to upload?", a: "We support PNG, JPG, JPEG, and WebP. For best results, use high-contrast images." }
                ].map((faq, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-cream/80 border border-foreground/5 hover:bg-cream transition-all">
                        <h4 className="flex items-center gap-4 text-sm font-black uppercase text-foreground/80 mb-3">
                            <Info size={16} className="text-candy-blue shrink-0" />
                            {faq.q}
                        </h4>
                        <p className="text-sm font-semibold text-muted-foreground leading-relaxed italic">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <div className="py-20 bg-cream">
        <ExploreLinks />
      </div>
    </div>
  );
}
