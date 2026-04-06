import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LEARN_TERMS } from "@/lib/learn-data";
import { Breadcrumb } from "@/components/breadcrumb";
import { ArrowLeft, ArrowRight, Sparkles, Share2, BookOpen, Clock, Calendar } from "lucide-react";
import { ExploreLinks } from "@/components/explore-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = LEARN_TERMS.find((t) => t.slug === slug);

  if (!term) return { title: "Term Not Found" };

  return {
    title: `${term.title} — AI Character Masterclass`,
    description: term.excerpt,
    alternates: {
      canonical: `https://mascotmaker.io/learn/${slug}`,
    },
    openGraph: {
      title: term.title,
      description: term.excerpt,
      type: "article",
      images: [term.image || "/app-icon.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: term.title,
      description: term.excerpt,
      images: [term.image || "/app-icon.png"],
    },
  };
}

export async function generateStaticParams() {
  return LEARN_TERMS.map((t) => ({ slug: t.slug }));
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  const term = LEARN_TERMS.find((t) => t.slug === slug);

  if (!term) notFound();

  const relatedTerms = LEARN_TERMS.filter((t) => 
    term.relatedSlugs.includes(t.slug)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": term.title,
    "description": term.excerpt,
    "image": term.image || "https://mascotmaker.io/app-icon.png",
    "author": {
      "@type": "Organization",
      "name": "Mascot Maker Studio"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mascot Maker",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mascotmaker.io/app-icon.png"
      }
    }
  };

  return (
    <div className="bg-[#0c0a09] min-h-screen text-white selection:bg-candy-blue/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header / Breadcrumb */}
      <section className="pt-32 pb-16 border-b border-white/[0.04] bg-[#141210]">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
            <Breadcrumb items={[
                { label: "Academy", href: "/learn" },
                { label: term.category, href: "/learn" },
                { label: term.title }
            ]} />
            
            <div className="space-y-8">
                <div className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#5cd85c]">
                    <span className="flex items-center gap-1.5"><Clock size={12}/> 5 MIN READ</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1.5"><Calendar size={12}/> UPDATED 2026</span>
                </div>
                
                <h1 className="font-display text-6xl md:text-8xl text-white leading-tight uppercase tracking-tighter drop-shadow-sm">
                    {term.title}
                </h1>
                
                <p className="text-2xl md:text-3xl text-white/40 font-medium leading-relaxed italic">
                    {term.excerpt}
                </p>
            </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-24 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20">
            {/* Sidebar (On Desktop) */}
            <aside className="lg:w-1/3 space-y-12 shrink-0">
                <div className="p-10 rounded-[3rem] bg-[#141210] border border-white/5 space-y-8 sticky top-32">
                    <h3 className="font-display text-2xl uppercase text-white tracking-tight flex items-center gap-3">
                        <Share2 size={20} className="text-candy-blue" />
                        Quick Resources
                    </h3>
                    <div className="space-y-4">
                        <Link href="/create" className="flex items-center justify-between p-5 rounded-2xl bg-candy-blue text-[#0c0a09] font-black uppercase tracking-wide text-xs hover:bg-[#3cacff] transition-all group">
                             Launch Creator <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="flex items-center justify-between w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">
                             Copy Link <Share2 size={16} />
                        </button>
                    </div>
                    
                    <div className="pt-8 border-t border-white/5 space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Related Topics</h4>
                        <div className="space-y-6">
                            {relatedTerms.map(rt => (
                                <Link key={rt.slug} href={`/learn/${rt.slug}`} className="block group">
                                    <div className="text-white font-bold group-hover:text-candy-blue transition-colors">{rt.title}</div>
                                    <div className="text-xs text-white/40 mt-1 line-clamp-1">{rt.excerpt}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Article Content */}
            <article className="lg:w-2/3 max-w-3xl">
                {term.image && (
                    <div className="aspect-video relative rounded-[4rem] overflow-hidden border border-white/5 mb-16 shadow-2xl">
                        <Image src={term.image} alt={term.title} fill className="object-cover" />
                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                )}
                
                <div className="prose prose-invert prose-2xl prose-candy max-w-none space-y-12">
                    {term.fullContent.map((paragraph, i) => (
                        <p key={i} className="text-xl md:text-2xl text-white/60 leading-relaxed font-normal">
                            {paragraph}
                        </p>
                    ))}
                    
                    <div className="bg-[#1c1916] p-12 rounded-[3.5rem] border border-white/5 space-y-8 mt-16 shadow-lg">
                        <h3 className="font-display text-4xl text-white uppercase tracking-tight flex items-center gap-4 m-0">
                            <Lightbulb size={32} className="text-candy-pink" /> 
                            The Studio Rule
                        </h3>
                        <p className="text-lg text-white/50 leading-relaxed m-0 italic">
                            In professional mascot design, Identity Lock isn't optional—it's the baseline. If your mascot changes between generations, you're not building a brand, you're building a gallery of cousins.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-24 mt-24 border-t border-white/5 order-last lg:order-none">
                    <Link href="/learn" className="flex-1 p-10 rounded-[2.5rem] bg-[#141210] border border-white/5 hover:border-white/10 group transition-all">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2">
                           <ArrowLeft size={16} /> Course Map
                        </div>
                        <div className="text-xl font-bold text-white group-hover:text-candy-blue transition-colors uppercase italic">Back to Glossary</div>
                    </Link>
                    <Link href="/create" className="flex-1 p-10 rounded-[2.5rem] bg-candy-blue hover:bg-[#3cacff] group transition-all text-[#0c0a09]">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#0c0a09]/50 mb-3 flex items-center gap-2">
                           Next Step <Sparkles size={16} />
                        </div>
                        <div className="text-xl font-bold uppercase italic">Apply to my Design</div>
                    </Link>
                </div>
            </article>
        </div>
      </section>

      <section className="bg-[#141210] border-t border-white/[0.04] py-24">
        <ExploreLinks />
      </section>
    </div>
  );
}

// Re-use standard icon for simplicity
function Lightbulb(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}
