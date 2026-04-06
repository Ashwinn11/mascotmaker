"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon3DInline, type FluentIcon3D } from "./ui/icon-3d";

const links: { href: string; label: string; icon: FluentIcon3D }[] = [
    { href: "/create", label: "Create", icon: "artist-palette" },
    { href: "/gallery", label: "Gallery", icon: "classical-building" },
    { href: "/blog", label: "Blog", icon: "pencil" },
    { href: "/profile", label: "Profile", icon: "relieved-face" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            <div className="mx-auto mb-6 max-w-fit px-6">
                <nav className="flex items-center gap-1 rounded-full glass-dark p-2 shadow-2xl relative overflow-hidden">
                    {/* Add a subtle highlight line at top */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    {links.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                          <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col items-center justify-center min-w-[64px] gap-1 rounded-full px-3 py-2 transition-all duration-300 ${isActive
                                    ? "bg-candy-pink text-white shadow-glow-coral"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon3DInline name={link.icon} size={20} className={isActive ? "brightness-110" : "opacity-70"} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-white" : "text-muted-foreground"}`}>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
