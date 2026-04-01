import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, User } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    author: string;
    category: string;
    image: string;
    imageAlt: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "what-is-a-brand-mascot",
        title: "What Is a Brand Mascot? The Complete Guide for 2026",
        description: "Learn what brand mascots are, why they increase recognition by 40%, and how AI tools like Mascot Maker are changing how businesses create them. Real examples from Duolingo, Discord, and more.",
        date: "2026-04-01",
        readTime: "8 min",
        author: "Mascot Maker Team",
        category: "Brand Strategy",
        image: "/demo/hero-shiba.png",
        imageAlt: "AI-generated 3D brand mascot character examples showing identity consistency"
    },
    {
        slug: "ai-mascot-vs-illustrator",
        title: "AI Mascot Generator vs Hiring an Illustrator: Cost, Speed, and Quality Compared",
        description: "A transparent comparison of using AI tools vs traditional illustrators for mascot creation. We break down pricing, turnaround time, revision workflows, and when each option makes sense.",
        date: "2026-04-01",
        readTime: "6 min",
        author: "Mascot Maker Team",
        category: "Comparisons",
        image: "/demo/style-showcase.webp",
        imageAlt: "Comparison of AI-generated mascots across different art styles"
    },
    {
        slug: "character-consistency-ai",
        title: "Why Character Consistency Is the Hardest Problem in AI Image Generation",
        description: "Most AI tools can't generate the same character twice. Learn how Identity Lock technology solves this and why it matters for brand assets, storyboards, and marketing campaigns.",
        date: "2026-04-01",
        readTime: "5 min",
        author: "Mascot Maker Team",
        category: "Technology",
        image: "/demo/hero-animation.webp",
        imageAlt: "AI mascot character maintaining identity across multiple generated poses"
    },
];

export const metadata: Metadata = {
    title: "Blog — Mascot Maker",
    description: "Guides, tutorials, and insights on AI mascot design, brand strategy, and character creation. Learn from the team behind Mascot Maker.",
    alternates: {
        canonical: "https://mascotmaker.io/blog",
    },
    openGraph: {
        title: "Blog — Mascot Maker",
        description: "Guides, tutorials, and insights on AI mascot design, brand strategy, and character creation.",
        type: "website",
        images: ["/og-image.png"],
    },
};

export default function BlogIndex() {
    return (
        <div className="bg-cream min-h-screen selection:bg-candy-pink/30">
            {/* Hero: Modern & Elegant */}
            <section className="relative pt-40 pb-24 bg-mesh-candy bg-grain border-b border-foreground/5 overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Blog" }
                    ]} />
                    <div className="mt-8 mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-foreground/5 text-[10px] font-black uppercase tracking-widest text-foreground/50 animate-slide-up">
                        INSIGHTS & GUIDES
                    </div>
                    <h1 className="font-display text-7xl md:text-[10rem] text-foreground leading-[0.85] uppercase -tracking-tight mb-8 animate-slide-up stagger-1">
                        The Mascot <br /><span className="text-gradient">Maker Blog.</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-semibold max-w-2xl leading-relaxed animate-slide-up stagger-2">
                        Actionable guides on brand mascots, AI character design, and building visual identity at scale.
                    </p>
                </div>
            </section>

            {/* Posts Grid: Premium Layout */}
            <section className="py-32">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {BLOG_POSTS.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col rounded-[3rem] bg-white border border-foreground/5 overflow-hidden shadow-sm hover:shadow-premium hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="relative aspect-[16/11] overflow-hidden m-2 rounded-[2.5rem]">
                                    <Image
                                        src={post.image}
                                        alt={post.imageAlt}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full glass-card border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-10 space-y-4 flex-grow">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                                        <span>{post.date}</span>
                                    </div>
                                    <h2 className="font-display text-3xl uppercase tracking-tight text-foreground leading-[1.1] group-hover:text-candy-pink transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-base text-muted-foreground font-semibold leading-relaxed line-clamp-3 italic opacity-80">
                                        {post.description}
                                    </p>
                                </div>
                                <div className="px-10 pb-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-candy-pink inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                                        READ ARTICLE <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA: Refined Conversion */}
            <section className="py-32 bg-mesh-dark text-white relative overflow-hidden">
                <div className="container mx-auto px-6 text-center space-y-12 relative z-10">
                    <h2 className="font-display text-6xl md:text-9xl uppercase tracking-tighter leading-none mb-4">
                        Ready to <span className="text-candy-yellow">Create?</span>
                    </h2>
                    <p className="text-2xl font-semibold text-white/50 max-w-xl mx-auto italic leading-relaxed">
                        &ldquo;Stop reading about mascots and start making them. Free to try, no credit card required.&rdquo;
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-5 rounded-full bg-white px-14 py-7 text-2xl font-black text-foreground hover:bg-candy-pink hover:text-white transition-all shadow-glow-pink hover:scale-105"
                    >
                        LAUNCH STUDIO <ArrowRight size={32} />
                    </Link>
                </div>
                <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
            </section>
        </div>
    );
}
