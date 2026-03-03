"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon3DInline, type FluentIcon3D } from "./ui/icon-3d";

const links: { href: string; label: string; icon: FluentIcon3D }[] = [
    { href: "/create", label: "Create", icon: "artist-palette" },
    { href: "/gallery", label: "Gallery", icon: "classical-building" },
    { href: "/profile", label: "Profile", icon: "relieved-face" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="mx-auto mb-6 max-w-fit px-6">
                <nav className="flex items-center gap-1 rounded-2xl border-2 border-white/50 bg-white/80 p-2 shadow-2xl backdrop-blur-xl">
                    {links.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all ${isActive
                                    ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-lg scale-110"
                                    : "text-warm-gray hover:bg-white"
                                    }`}
                            >
                                <Icon3DInline name={link.icon} size={20} className={isActive ? "brightness-110" : ""} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
