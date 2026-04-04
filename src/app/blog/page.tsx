import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, User, Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

import { getBlogPosts, type BlogPost } from "@/lib/blog";

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
        images: ["https://mascotmaker.io/app-icon.png"],
    },
    twitter: {
        card: "summary",
        title: "Blog — Mascot Maker",
        images: ["https://mascotmaker.io/app-icon.png"],
    },
};

export default function BlogIndex() {
    const posts = getBlogPosts();
    const featuredPost = posts[0];
    const otherPosts = posts.slice(1);

    return (
        <div className="bg-cream min-h-screen selection:bg-candy-pink/30">
            {/* ─── Hero Section: Clean & Professional ─── */}
            <section className="relative flex items-center overflow-hidden bg-mesh-candy bg-grain pt-32 pb-16">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-candy-pink/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Breadcrumb items={[
                            { label: "Home", href: "/" },
                            { label: "Journal" }
                        ]} />

                        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-foreground/5 bg-cream/50 backdrop-blur-sm">
                            <span className="text-[9px] font-black tracking-widest uppercase text-foreground/40 leading-none">Mascot Maker Journal — Issue 04</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="font-display text-5xl md:text-7xl leading-tight tracking-tighter text-foreground uppercase">
                                The Mascot <span className="text-candy-pink italic">Journal.</span>
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-foreground/50 max-w-lg leading-relaxed">
                                Actionable guides on brand mascots, AI character design, and building premium visual identity at scale.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Featured Post ─── */}
            <section className="py-12 border-t border-foreground/5">
                <div className="container mx-auto max-w-7xl px-6">
                    <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="group grid lg:grid-cols-[1.2fr_1fr] bg-white rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-premium transition-all duration-700 hover:-translate-y-1"
                    >
                        <div className="relative aspect-video lg:aspect-auto min-h-[300px] overflow-hidden">
                            <Image
                                src={featuredPost.image}
                                alt={featuredPost.imageAlt}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-candy-pink">
                                <span className="px-2.5 py-1 bg-candy-pink/10 rounded-full">{featuredPost.category}</span>
                                <span className="text-foreground/40">{featuredPost.date}</span>
                            </div>
                            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight tracking-tight text-foreground group-hover:text-candy-pink transition-colors">
                                {featuredPost.title}
                            </h2>
                            <p className="text-base md:text-lg text-foreground/50 font-medium leading-relaxed italic">
                                &ldquo;{featuredPost.description}&rdquo;
                            </p>
                            <div className="pt-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground inline-flex items-center gap-4 group-hover:gap-6 transition-all">
                                    READ ARTICLE <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* ─── Grid ─── */}
            <section className="py-12 border-t border-foreground/5">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {otherPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col rounded-3xl bg-cream border border-foreground/5 overflow-hidden hover:shadow-premium transition-all duration-500"
                            >
                                <div className="relative aspect-[16/9] overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.imageAlt}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full border border-white/20 bg-black/20 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-foreground/30">
                                        <span>{post.readTime}</span>
                                        <span className="w-1 h-1 rounded-full bg-foreground/10" />
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-foreground leading-tight group-hover:text-candy-pink transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-foreground/40 text-sm font-medium leading-relaxed line-clamp-2">
                                        {post.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className="py-24 bg-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cream/20">Studio Professional Mode · Free to try</p>
                    <h2 className="font-display text-4xl md:text-6xl text-cream leading-tight tracking-tight uppercase">
                        Ready to build your <span className="text-candy-pink italic">Next Legend?</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-candy-pink text-cream rounded-2xl font-black text-lg tracking-wide shadow-glow-pink hover:brightness-110 hover:scale-[1.02] transition-all group"
                    >
                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                        OPEN STUDIO NOW
                    </Link>
                </div>
            </section>
        </div>
    );
}


