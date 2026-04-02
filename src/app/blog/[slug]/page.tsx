import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogPosts, getBlogPost } from "@/lib/blog";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Full article content — in production you'd use MDX or a CMS
const ARTICLE_CONTENT: Record<string, { sections: { heading: string; content: string }[] }> = {
    "what-is-a-brand-mascot": {
        sections: [
            {
                heading: "What Exactly Is a Brand Mascot?",
                content: "A brand mascot is a character — human, animal, or abstract — that represents a company's identity and values. Think of the Duolingo owl, Discord's Wumpus, or Mailchimp's Freddie. These aren't just logos. They're characters with personality, emotion, and storytelling potential.\n\nThe best mascots create instant emotional recognition. When you see Duo's disappointed face, you feel something. That emotional response is what separates a mascot from a logo.\n\nAccording to a 2024 study published in the Journal of Marketing Research, brands with character mascots see 41% higher recall in unaided brand awareness tests compared to brands using abstract logos alone."
            },
            {
                heading: "Why Do Mascots Work So Well?",
                content: "Mascots work because humans are hardwired to respond to faces and characters. This is called pareidolia — our tendency to see human-like features in objects. When a brand has a mascot, it activates the same neural pathways we use for social interaction.\n\nThis means your audience forms a parasocial relationship with your mascot. They feel like they 'know' your brand on a personal level. This is incredibly powerful for:\n\n• Brand recall: Characters are 3x more memorable than abstract logos\n• Social media engagement: Mascot posts get 2.4x more shares on average\n• Customer trust: Familiar characters reduce purchase anxiety\n• Content creation: One character provides infinite content possibilities"
            },
            {
                heading: "The Old Way vs The New Way",
                content: "Traditionally, creating a brand mascot required hiring an illustrator or design agency. This meant:\n\n• $500–$2,500 for initial character design\n• 4–8 weeks for the design process\n• Additional costs for every new pose, expression, or scene\n• Inconsistency when different artists work on the character\n\nAI mascot generators like Mascot Maker have fundamentally changed this equation. You can now create a professional mascot in minutes, iterate on it infinitely, and maintain perfect character consistency across every piece of content you produce.\n\nThe key technology that makes this possible is called Identity Lock — the ability to generate the same character in completely different poses, angles, and scenarios while maintaining its visual DNA."
            },
            {
                heading: "How to Create Your Brand Mascot",
                content: "Whether you use AI or hire an illustrator, great mascots follow the same design principles:\n\n1. Start with personality, not aesthetics. Define 3–5 personality traits before you open any design tool.\n\n2. Choose a style that matches your audience. 3D Pixar-style for premium SaaS? Pixel art for gaming? Flat design for fintech? The style signals who you're for.\n\n3. Design for versatility. Your mascot needs to work at 16×16 pixels (favicon) and on a billboard. Simple silhouettes always win.\n\n4. Build an expression sheet. You need at minimum: happy, thinking, excited, confused, and waving. These cover 90% of content needs.\n\n5. Create a guidelines document. Document colors, proportions, and personality rules so every piece of content stays on-brand."
            },
            {
                heading: "Getting Started with AI Mascot Creation",
                content: "If you want to create your first brand mascot today, here's the fastest path:\n\n1. Open Mascot Maker's Mascot Generator\n2. Describe your character in plain English (e.g., 'a friendly robot helper for a coding education platform')\n3. Choose your art style from 8 professional AI models\n4. Use Identity Lock to generate logo variations and sticker packs\n5. Export in the resolution you need — with instant background removal\n\nThe entire process takes about 5 minutes for your first character, and you can iterate infinitely until it feels right."
            }
        ]
    },
    "ai-mascot-vs-illustrator": {
        sections: [
            {
                heading: "The Honest Comparison",
                content: "Let's cut through the marketing spin from both sides. AI mascot generators and human illustrators each have genuine strengths. Here's the truth about when to use each option.\n\nWe're not going to pretend AI replaces human creativity. But we're also not going to pretend that spending $2,500 on a mascot makes sense for every startup."
            },
            {
                heading: "Cost Breakdown",
                content: "Human Illustrator:\n• Initial mascot design: $300–$1,200\n• Character sheet (8 poses): $200–$800\n• Each new scene or pose: $30–$150\n• Annual maintenance (new assets): $500–$2,000\n\nAI Mascot Generator (Mascot Maker):\n• Free tier: 5 generations/day\n• Pro tier: $19/month for unlimited generations\n• Each new scene or pose: included\n• Annual cost: $0–$228\n\nThe cost difference is dramatic but cost isn't everything."
            },
            {
                heading: "Speed and Iteration",
                content: "This is where AI has an undeniable advantage.\n\nHuman illustrator timeline:\n• Brief → first concepts: 1–2 weeks\n• Revision rounds: 2–4 weeks\n• Final delivery: 4–8 weeks total\n\nAI generator timeline:\n• First concept: 30 seconds\n• Iteration: instant\n• Final asset: 5 minutes\n\nFor businesses that need to move fast — startups, content creators, social media teams — this speed difference is the deciding factor."
            },
            {
                heading: "Quality and Uniqueness",
                content: "Here's where things get nuanced.\n\n• For one-of-a-kind, portfolio-worthy character design that will define your brand for years: hire an illustrator.\n\n• For consistent, high-quality mascot assets you need in volume and at speed: use an AI generator.\n\n• For the best of both worlds: use AI to rapidly prototype and iterate on your concept, then hire an illustrator to refine the final design. Many professional designers now use this exact workflow."
            },
            {
                heading: "The Consistency Problem",
                content: "The biggest challenge with human illustrators is consistency over time. As your brand grows, you'll need assets from different artists. Each artist interprets your character slightly differently.\n\nAI generators with Identity Lock technology solve this entirely. Once you've locked your character's identity, every generation maintains the exact same proportions, colors, and features — whether you generate 10 images or 10,000."
            },
            {
                heading: "Our Recommendation",
                content: "• Budget under $300: Use AI exclusively. Mascot Maker's free and pro tiers will cover all your needs.\n\n• Budget $300–$1,500: Start with AI to prototype, then hire a freelancer for a polished character sheet. Use AI for high-volume content.\n\n• Budget $1,500+: Hire a professional freelance artist for your primary character design. Use AI for consistency and speed in production.\n\nThe smartest teams use both tools. AI for speed and volume, humans for originality and soul."
            }
        ]
    },
    "character-consistency-ai": {
        sections: [
            {
                heading: "The Same Character Twice Problem",
                content: "Ask any AI tool to generate 'a friendly fox mascot wearing a blue scarf' three times. You'll get three completely different foxes. Different proportions, different shade of blue, different personality.\n\nThis is the fundamental challenge of AI image generation for brand work. Generative models are designed to create novel images — consistency is antithetical to how they work.\n\nFor casual users making one-off images, this isn't a problem. For brands that need the same character across websites, social media, presentations, and merchandise: it's a dealbreaker."
            },
            {
                heading: "Why Standard AI Tools Fail at Consistency",
                content: "Tools like Midjourney, DALL-E, and Stable Diffusion use diffusion models that generate images from random noise. Even with identical prompts and seeds, these models produce variation.\n\nSome approaches people have tried:\n\n• Seed locking: Helps somewhat but character details still drift\n• LoRA fine-tuning: Expensive, technical, and requires dozens of reference images\n• Prompt engineering: 'Same character as before but waving' doesn't work reliably\n• Reference images: Most tools treat reference images as style guides, not identity locks\n\nNone of these methods reliably produce the same character in new poses and scenarios."
            },
            {
                heading: "How Identity Lock Technology Works",
                content: "Mascot Maker's Identity Lock takes a fundamentally different approach. Instead of trying to constrain a generative model (which fights against its nature), Identity Lock extracts and preserves the character's visual DNA — its key proportions, color palette, distinguishing features, and structural relationships.\n\nWhen you generate a new image, the system doesn't start from random noise. It starts from your character's identity parameters and generates the new scene around that fixed identity.\n\nThe result: your character looks the same whether it's waving hello, riding a skateboard, or presenting a sales chart."
            },
            {
                heading: "Why This Matters for Brands",
                content: "Character consistency isn't a nice-to-have. It's a business requirement.\n\nConsider the typical brand content pipeline:\n• Website hero image: character facing forward, smiling\n• Social media: 20+ posts per month, each with the character in a new scenario\n• Email marketing: character in various contextual scenes\n• Product packaging: character at exact brand-standard proportions\n• Documentation: character guiding users through features\n\nWithout consistency, your audience is confused. They see slightly different characters and wonder: is this the same brand? That uncertainty erodes trust."
            },
            {
                heading: "Try It Yourself",
                content: "The best way to understand Identity Lock is to experience it:\n\n1. Open Mascot Maker's Character Generator\n2. Create any character you'd like\n3. Click the Identity Lock button to preserve your character's DNA\n4. Generate 5 different scenarios with the same character\n5. Compare the results — same character, different stories\n\nThis is the workflow that enables brands to produce hundreds of consistent marketing assets without ever worrying about character drift."
            }
        ]
    }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const posts = getBlogPosts();
    const post = posts.find(p => p.slug === slug);
    if (!post) return {};

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: `https://mascotmaker.io/blog/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
            images: [{ url: post.image, alt: post.imageAlt }],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: [post.image],
        }
    };
}

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;
    const post = getBlogPost(slug);
    const allPosts = getBlogPosts();

    if (!post || !post.content) {
        notFound();
    }

    const postIndex = allPosts.findIndex(p => p.slug === slug);
    const nextPost = allPosts[postIndex + 1] || allPosts[0];
    const prevPost = postIndex > 0 ? allPosts[postIndex - 1] : allPosts[allPosts.length - 1];

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "image": `https://mascotmaker.io${post.image}`,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
            "@type": "Organization",
            "name": "Mascot Maker",
            "url": "https://mascotmaker.io"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mascot Maker",
            "logo": {
                "@type": "ImageObject",
                "url": "https://mascotmaker.io/app-icon.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://mascotmaker.io/blog/${slug}`
        }
    };

    return (
        <div className="bg-cream min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />

            {/* Article Header */}
            <section className="relative pt-32 pb-16 bg-white border-b-4 border-foreground">
                <div className="mx-auto max-w-4xl px-6">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Blog", href: "/blog" },
                        { label: post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title }
                    ]} />

                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/10 border-2 border-candy-pink/20 text-xs font-black uppercase tracking-widest text-candy-pink">
                        {post.category}
                    </div>

                    <h1 className="font-display text-4xl md:text-7xl text-foreground leading-[0.9] uppercase -tracking-[0.03em] mb-8">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground">
                        <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="flex items-center gap-2"><Clock size={16} /> {post.readTime} read</span>
                        <span>{post.author}</span>
                    </div>
                </div>
            </section>

            {/* Hero Image */}
            <section className="py-12 bg-cream">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="rounded-[2rem] border-4 border-foreground overflow-hidden shadow-[12px_12px_0_#2d2420]">
                        <div className="relative aspect-[2/1]">
                            <Image
                                src={post.image}
                                alt={post.imageAlt}
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Body */}
            <article className="py-12">
                <div className="mx-auto max-w-3xl px-6">
                    <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-p:text-foreground/80 prose-p:font-medium prose-p:leading-relaxed prose-a:text-candy-pink prose-li:font-medium prose-strong:text-foreground">
                        <MDXRemote source={post.content || ""} />
                    </div>

                    {/* CTA within article */}
                    <div className="mt-16 p-10 rounded-[2rem] border-4 border-foreground bg-white shadow-[8px_8px_0_#ff6b9d] text-center">
                        <h3 className="font-display text-3xl md:text-5xl uppercase mb-4">Try Mascot Maker <span className="text-candy-pink">Free</span></h3>
                        <p className="text-lg text-muted-foreground font-bold mb-8">
                            Create your first AI mascot in under 5 minutes. No credit card required.
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-3 rounded-full bg-foreground px-10 py-5 text-xl font-black text-white shadow-[6px_6px_0_#ffc857] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95"
                        >
                            LAUNCH STUDIO <ArrowRight size={24} />
                        </Link>
                    </div>
                </div>
            </article>

            {/* Navigation */}
            <section className="py-16 bg-white border-t-4 border-foreground">
                <div className="mx-auto max-w-4xl px-6">
                    <h3 className="font-black uppercase tracking-widest text-xs text-muted-foreground mb-8 text-center">Continue Reading</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href={`/blog/${prevPost.slug}`}
                            className="group p-6 rounded-2xl border-3 border-foreground hover:bg-cream transition-colors"
                        >
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-3">
                                <ArrowLeft size={14} /> Previous
                            </div>
                            <h4 className="font-black text-lg text-foreground group-hover:text-candy-pink transition-colors leading-tight">{prevPost.title}</h4>
                        </Link>
                        <Link
                            href={`/blog/${nextPost.slug}`}
                            className="group p-6 rounded-2xl border-3 border-foreground hover:bg-cream transition-colors text-right"
                        >
                            <div className="flex items-center justify-end gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-3">
                                Next <ArrowRight size={14} />
                            </div>
                            <h4 className="font-black text-lg text-foreground group-hover:text-candy-pink transition-colors leading-tight">{nextPost.title}</h4>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
