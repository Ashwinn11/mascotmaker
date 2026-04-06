"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wand2, ImageIcon, Eraser } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/create", label: "Create", icon: Wand2 },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/background-remover", label: "Remover", icon: Eraser },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative flex items-center gap-2 rounded-full px-3 py-2 md:px-4 text-sm font-bold transition-all duration-300 overflow-hidden ${
              isActive
                ? "text-white"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {isActive && (
              <div className="absolute inset-0 bg-candy-pink rounded-full -z-10" />
            )}
            {!isActive && (
              <div className="absolute inset-0 bg-white/5 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            <Icon size={16} className={isActive ? "text-white" : "text-muted-foreground group-hover:text-white transition-colors duration-300"} />
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
