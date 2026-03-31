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

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 md:px-4 text-sm font-bold transition-all ${isActive
              ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-md scale-105"
              : "text-warm-gray hover:bg-white hover:text-foreground hover:shadow-sm"
              }`}
          >
            <Icon3DInline name={link.icon} size={18} className={isActive ? "brightness-110" : ""} />
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
