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
        image: "/demo/hero-shiba.webp",
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
        <div className="bg-cream min-h-screen">
            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-white border-b-4 border-foreground">
                <div className="mx-auto max-w-7xl px-6">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Blog" }
                    ]} />
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 text-xs font-black uppercase tracking-widest text-candy-pink">
                        Insights & Guides
                    </div>
                    <h1 className="font-display text-6xl md:text-9xl text-foreground leading-[0.85] uppercase -tracking-[0.04em] mb-8">
                        The Mascot <br /><span className="text-gradient">Maker Blog</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-bold max-w-2xl">
                        Actionable guides on brand mascots, AI character design, and building visual identity at scale.
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {BLOG_POSTS.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group rounded-[2rem] border-4 border-foreground bg-white overflow-hidden shadow-[8px_8px_0_#2d2420] hover:shadow-[4px_4px_0_#2d2420] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.imageAlt}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-foreground text-white text-[10px] font-black uppercase tracking-widest">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h2 className="font-black text-xl uppercase tracking-tight text-foreground group-hover:text-candy-pink transition-colors leading-tight mb-3">
                                        {post.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground font-bold leading-relaxed mb-6">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-foreground text-white text-center border-t-4 border-foreground">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 className="font-display text-5xl md:text-7xl uppercase mb-8">Ready to <span className="text-candy-yellow">Create?</span></h2>
                    <p className="text-xl font-bold text-white/70 mb-12">
                        Stop reading about mascots and start making them. Free to try, no credit card required.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-4 rounded-full border-4 border-white bg-white px-12 py-6 text-2xl font-black text-foreground hover:bg-candy-pink hover:text-white hover:border-candy-pink transition-all active:scale-95"
                    >
                        LAUNCH STUDIO <ArrowRight size={28} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
