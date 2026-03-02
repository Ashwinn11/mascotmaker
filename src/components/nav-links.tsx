"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/create", label: "Create" },
  { href: "/gallery", label: "Gallery" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-candy-pink/10 text-candy-pink"
                : "text-warm-gray hover:bg-secondary hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
