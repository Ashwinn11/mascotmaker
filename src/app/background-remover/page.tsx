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
    <div className="bg-cream min-h-screen">
      <JSONLD data={howToSchema} />
      <JSONLD data={faqSchema} />
      
      {/* ─── Hero Section ─── */}
      <section className="py-20 border-b-4 border-foreground bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-candy-pink/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-candy-blue/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="mx-auto max-w-5xl px-6 relative z-10 text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 text-xs font-black uppercase tracking-widest text-candy-pink">
                AI Powered Tool
            </div>
          <h1 className="font-display text-5xl md:text-8xl uppercase leading-none mb-6">
            Free AI <br />
            <span className="text-gradient">BG Remover</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-bold max-w-2xl mx-auto mb-12">
            Perfect for mascots, stickers, and logos. Get high-resolution transparent PNGs in seconds.
          </p>

          <div className="max-w-2xl mx-auto mb-20">
            <BackgroundRemoverTool />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto border-t-4 border-foreground/5 pt-12">
             <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-candy-green/10 border-2 border-candy-green/20 flex items-center justify-center text-candy-green">
                    <ShieldCheck size={20} className="stroke-[3]" />
                </div>
                <div>
                   <h3 className="font-black uppercase text-sm mb-1">Commercial Use</h3>
                   <p className="text-xs text-muted-foreground font-bold">Use in games, ads, or social media.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-candy-blue/10 border-2 border-candy-blue/20 flex items-center justify-center text-candy-blue">
                    <Zap size={20} className="stroke-[3]" />
                </div>
                <div>
                   <h3 className="font-black uppercase text-sm mb-1">Instant Results</h3>
                   <p className="text-xs text-muted-foreground font-bold">Automated AI background removal.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-candy-orange/10 border-2 border-candy-orange/20 flex items-center justify-center text-candy-orange">
                    <Download size={20} className="stroke-[3]" />
                </div>
                <div>
                   <h3 className="font-black uppercase text-sm mb-1">Hibase PNG</h3>
                   <p className="text-xs text-muted-foreground font-bold">Download clean, lossless transparent images.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-24 bg-white border-b-4 border-foreground">
        <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-display text-4xl md:text-6xl uppercase text-center mb-16">How to Make <span className="text-candy-pink">Transparent</span> Mascots</h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
                {[
                    { step: "01", title: "Upload", text: "Drag & drop your JPG or PNG. The larger the better." },
                    { step: "02", title: "Process", text: "Our AI identifies the subject and removes the background." },
                    { step: "03", title: "Download", text: "Get your high-resolution file ready to use anywhere." }
                ].map((item, idx) => (
                    <div key={idx} className="relative group">
                        <span className="absolute -top-6 -left-4 text-7xl font-display text-foreground/5 group-hover:text-candy-pink/10 transition-colors">{item.step}</span>
                        <div className="relative p-8 rounded-3xl border-3 border-foreground bg-white shadow-[6px_6px_0_#2d2420] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                            <h3 className="text-xl font-black uppercase mb-3">{item.title}</h3>
                            <p className="text-sm font-bold text-muted-foreground leading-relaxed">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-24 bg-cream border-b-4 border-foreground">
        <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-display text-4xl uppercase text-center mb-16 underline decoration-candy-blue">Frequently Asked Questions</h2>
            <div className="space-y-6">
                {[
                    { q: "Is it free for everyone?", a: "Every new user gets 5 free credits. Each background removal costs just 1 credit, making it effectively free for your first 5 removals!" },
                    { q: "Does it work for logos?", a: "Absolutely. Our AI is optimized for mascots, logo marks, and stickers." },
                    { q: "What's the best file type to upload?", a: "We support PNG, JPG, JPEG, and WebP. For best results, use high-contrast images." }
                ].map((faq, i) => (
                    <div key={i} className="p-8 rounded-3xl border-3 border-foreground bg-white shadow-[6px_6px_0_#2d2420]">
                        <h4 className="flex items-center gap-3 text-lg font-black uppercase mb-3">
                            <Info size={18} className="text-candy-blue" />
                            {faq.q}
                        </h4>
                        <p className="text-sm font-bold text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <div className="pt-10">
        <ExploreLinks />
      </div>
    </div>
  );
}
