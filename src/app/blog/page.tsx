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
        <div className="bg-[#0c0a09] min-h-screen selection:bg-candy-pink/30 text-white">
            {/* ─── Hero Section: Clean & Professional ─── */}
            <section className="relative flex items-center overflow-hidden bg-[#141210] pt-32 pb-16 border-b border-white/[0.04]">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-candy-pink/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Breadcrumb items={[
                            { label: "Home", href: "/" },
                            { label: "Journal" }
                        ]} />

                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 glass-dark shadow-sm">
                            <span className="text-[9px] font-black tracking-widest uppercase text-white/50 leading-none">Mascot Maker Journal — Issue 04</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="font-display text-5xl md:text-7xl leading-tight tracking-tighter text-white uppercase drop-shadow-sm">
                                The Mascot <span className="text-candy-pink italic">Journal.</span>
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-white/50 max-w-lg leading-relaxed">
                                Actionable guides on brand mascots, AI character design, and building premium visual identity at scale.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Featured Post ─── */}
            <section className="py-12 bg-[#0c0a09]">
                <div className="container mx-auto max-w-7xl px-6">
                    <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="group grid lg:grid-cols-[1.2fr_1fr] bg-[#1c1916] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-lg transition-all duration-700 hover:-translate-y-1 hover:border-candy-pink/20 hover:shadow-2xl"
                    >
                        <div className="relative aspect-video lg:aspect-auto min-h-[300px] overflow-hidden border-r border-white/[0.04]">
                            <Image
                                src={featuredPost.image}
                                alt={featuredPost.imageAlt}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#5cd85c]">
                                <span className="px-3 py-1.5 bg-[#5cd85c]/10 border border-[#5cd85c]/20 rounded-full">{featuredPost.category}</span>
                                <span className="text-white/40">{featuredPost.date}</span>
                            </div>
                            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight tracking-tight text-white group-hover:text-candy-pink transition-colors">
                                {featuredPost.title}
                            </h2>
                            <p className="text-base md:text-lg text-white/50 font-medium leading-relaxed italic">
                                &ldquo;{featuredPost.description}&rdquo;
                            </p>
                            <div className="pt-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 inline-flex items-center gap-4 group-hover:gap-6 group-hover:text-candy-pink transition-all">
                                    READ ARTICLE <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* ─── Grid ─── */}
            <section className="py-12 bg-[#0c0a09]">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {otherPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col rounded-[2rem] bg-[#141210] border border-white/5 overflow-hidden hover:border-white/10 hover:shadow-xl hover:bg-[#1c1916] transition-all duration-500"
                            >
                                <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.04]">
                                    <Image
                                        src={post.image}
                                        alt={post.imageAlt}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full border border-white/20 bg-black/40 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 space-y-5">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30">
                                        <span>{post.readTime}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-white/90 leading-tight group-hover:text-candy-pink transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-2">
                                        {post.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className="py-24 bg-[#141210] relative overflow-hidden border-t border-white/[0.04]">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px] pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5cd85c]">Studio Professional Mode · Free to try</p>
                    <h2 className="font-display text-4xl md:text-6xl text-white leading-tight tracking-tight uppercase drop-shadow-sm">
                        Ready to build your <span className="text-candy-pink italic">Next Legend?</span>
                    </h2>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-candy-pink text-[#0c0a09] rounded-2xl font-black text-lg tracking-wide shadow-glow-coral hover:brightness-110 active:scale-95 transition-all group"
                    >
                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                        OPEN STUDIO NOW
                    </Link>
                </div>
            </section>
        </div>
    );
}
