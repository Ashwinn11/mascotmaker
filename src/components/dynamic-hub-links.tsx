import Link from "next/link";
import { INDUSTRIES, STYLES, ENGINES } from "@/lib/seo-data";

interface DynamicHubLinksProps {
    type: string; // "use-case", "industry", "style"
    primarySlug: string;
}

// Maps engine slugs to gallery browse CTAs — only for engines
// that have matching browseable community assets in /gallery
const GALLERY_CTA_MAP: Record<string, { label: string; desc: string }> = {
    "mascot-generator":          { label: "Browse Community Mascots",       desc: "See thousands of mascots made by designers like you." },
    "sticker-pack-generator":    { label: "Browse Community Sticker Packs", desc: "Find ready-to-download Discord and Telegram sticker sets." },
    "logo-generator":            { label: "Browse Community Logos",         desc: "Explore brand logos and marks available to download now." },
    "animated-mascot-generator": { label: "Browse Animated Mascots",        desc: "See animated characters you can buy and use immediately." },
};

export function DynamicHubLinks({ type, primarySlug }: DynamicHubLinksProps) {
    let links: { href: string; title: string; category: string }[] = [];
    let sectionTitle = "Related Design Resources";
    let sectionDesc = "Explore adjacent tools and templates to expand your asset library.";

    if (type === "use-case") {
        const engine = ENGINES.find(e => e.slug === primarySlug);
        sectionTitle = `Top Industries Using ${engine?.title || "This Tool"}`;
        sectionDesc = `See how leading brands use Mascot Maker's ${engine?.title?.toLowerCase() || "generation"} capabilities across different verticals.`;

        links = INDUSTRIES.slice(0, 15).map((ind) => ({
            href: `/mascot-maker/use-case/${primarySlug}/${ind.slug}`,
            title: `${engine?.title || "Assets"} for ${ind.title}`,
            category: "Industry Application",
        }));
    } else if (type === "industry") {
        const industry = INDUSTRIES.find(i => i.slug === primarySlug);
        sectionTitle = `Trending AI Styles for ${industry?.title || "Your Industry"}`;
        sectionDesc = `Discover the most effective artistic directions for building ${industry?.title?.toLowerCase() || "brand"} recognition.`;

        links = STYLES.map((style) => ({
            href: `/mascot-maker/style/${style.slug}/${primarySlug}`,
            title: `${style.title} ${industry?.title ? `for ${industry.title}` : "Style"}`,
            category: "Visual DNA",
        }));
    } else if (type === "style") {
        const style = STYLES.find(s => s.slug === primarySlug);
        sectionTitle = `Apply ${style?.title || "This"} Aesthetic`;
        sectionDesc = `Explore how the ${style?.title || "artistic"} style transforms digital assets across different sectors.`;

        links = INDUSTRIES.slice(0, 15).map((ind) => ({
            href: `/mascot-maker/style/${primarySlug}/${ind.slug}`,
            title: `${style?.title || "Style"} character for ${ind.title}`,
            category: "Aesthetic Application",
        }));
    }

    if (links.length === 0) return null;

    const galleryCta = type === "use-case" ? GALLERY_CTA_MAP[primarySlug] : null;

    return (
        <section className="py-20 bg-[#0c0a09] border-t border-white/[0.04]">
            <div className="container mx-auto px-6 max-w-5xl">

                {/* Browse-intent CTA — appears only for engines with gallery assets */}
                {galleryCta && (
                    <Link
                        href="/gallery"
                        className="group flex items-center justify-between gap-6 mb-10 p-6 rounded-2xl bg-candy-blue/5 border border-candy-blue/20 hover:border-candy-blue/40 hover:bg-candy-blue/10 transition-all duration-300"
                    >
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-candy-blue mb-1">Community Hub</p>
                            <p className="font-black text-lg text-white group-hover:text-candy-blue transition-colors">
                                {galleryCta.label} →
                            </p>
                            <p className="text-sm text-white/40 mt-1">{galleryCta.desc}</p>
                        </div>
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-candy-blue/10 border border-candy-blue/20 flex items-center justify-center text-candy-blue text-lg font-black">
                            ↗
                        </div>
                    </Link>
                )}

                <div className="mb-10 text-center md:text-left">
                    <h2 className="font-display text-4xl py-2 uppercase tracking-tight text-white">{sectionTitle}</h2>
                    <p className="text-white/50 font-medium text-lg mt-2">{sectionDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            className="group p-5 bg-[#141210] rounded-2xl border border-white/5 shadow-sm hover:shadow-lg hover:border-candy-pink/30 hover:bg-[#1c1916] transition-all duration-300 flex flex-col"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 group-hover:text-candy-pink transition-colors">
                                {link.category}
                            </span>
                            <span className="font-bold text-white text-base tracking-tight leading-snug group-hover:text-candy-pink transition-colors">
                                {link.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
