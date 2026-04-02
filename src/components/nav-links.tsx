"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wand2, ImageIcon, BookOpen, Info, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const links: { href: string; label: string; icon: LucideIcon; color: string; activeColor: string }[] = [
  { href: "/create", label: "Create", icon: Wand2, color: "text-candy-pink", activeColor: "text-white" },
  { href: "/gallery", label: "Gallery", icon: ImageIcon, color: "text-candy-blue", activeColor: "text-white" },
  { href: "/blog", label: "Blog", icon: BookOpen, color: "text-candy-orange", activeColor: "text-white" },
  { href: "/about", label: "About", icon: Info, color: "text-candy-green", activeColor: "text-white" },
  { href: "/profile", label: "Profile", icon: User, color: "text-candy-purple", activeColor: "text-white" },
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
            className={`flex items-center gap-2 rounded-xl px-3 py-2 md:px-4 text-sm font-bold transition-all ${
              isActive
                ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-md scale-105"
                : "text-warm-gray hover:bg-white hover:text-foreground hover:shadow-sm"
            }`}
          >
            <Icon size={16} className={isActive ? link.activeColor : link.color} />
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
