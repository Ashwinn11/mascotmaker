import Link from "next/link";
import { INDUSTRIES, STYLES, ENGINES } from "@/lib/seo-data";

interface DynamicHubLinksProps {
    type: string; // "use-case", "industry", "style"
    primarySlug: string;
}

export function DynamicHubLinks({ type, primarySlug }: DynamicHubLinksProps) {
    // Determine which links to show based on the current page's semantic hub.
    // This creates "Spokes" from the "Hub".

    let links: { href: string; title: string; category: string }[] = [];
    let sectionTitle = "Related Design Resources";
    let sectionDesc = "Explore adjacent tools and templates to expand your asset library.";

    if (type === "use-case") {
        const engine = ENGINES.find(e => e.slug === primarySlug);
        sectionTitle = `Top Industries Using ${engine?.title || "This Tool"}`;
        sectionDesc = `See how leading brands use Mascot Maker's ${engine?.title?.toLowerCase() || 'generation'} capabilities across different verticals.`;
        
        // Link to this use-case combined with various top industries.
        links = INDUSTRIES.slice(0, 15).map((ind) => ({
            href: `/mascot-maker/use-case/${primarySlug}/${ind.slug}`,
            title: `${engine?.title || 'Assets'} for ${ind.title}`,
            category: "Industry Application"
        }));
    } else if (type === "industry") {
        const industry = INDUSTRIES.find(i => i.slug === primarySlug);
        sectionTitle = `Trending AI Styles for ${industry?.title || "Your Industry"}`;
        sectionDesc = `Discover the most effective artistic directions for building ${industry?.title?.toLowerCase() || 'brand'} recognition.`;
        
        // Link to this industry combined with all core styles.
        links = STYLES.map((style) => ({
            href: `/mascot-maker/style/${style.slug}/${primarySlug}`,
            title: `${style.title} ${industry?.title ? `for ${industry.title}` : 'Style'}`,
            category: "Visual DNA"
        }));
    } else if (type === "style") {
        const style = STYLES.find(s => s.slug === primarySlug);
        sectionTitle = `Apply ${style?.title || "This"} Aesthetic`;
        sectionDesc = `Explore how the ${style?.title || 'artistic'} style transforms digital assets across different sectors.`;
        
        // Link to this style combined with various industries.
        links = INDUSTRIES.slice(0, 15).map((ind) => ({
            href: `/mascot-maker/style/${primarySlug}/${ind.slug}`,
            title: `${style?.title || 'Style'} character for ${ind.title}`,
            category: "Aesthetic Application"
        }));
    }

    if (links.length === 0) return null;

    return (
        <section className="py-20 bg-secondary/5 border-t border-foreground/5">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="font-display text-4xl py-2 uppercase tracking-tight text-foreground">{sectionTitle}</h2>
                    <p className="text-foreground/50 font-medium text-lg mt-2">{sectionDesc}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {links.map((link, i) => (
                        <Link 
                            key={i} 
                            href={link.href}
                            className="group p-5 bg-white rounded-2xl border border-foreground/5 shadow-sm hover:shadow-md hover:border-candy-pink/30 transition-all duration-300 flex flex-col"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2 group-hover:text-candy-pink transition-colors">
                                {link.category}
                            </span>
                            <span className="font-bold text-foreground text-base tracking-tight leading-snug group-hover:text-candy-pink transition-colors">
                                {link.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
