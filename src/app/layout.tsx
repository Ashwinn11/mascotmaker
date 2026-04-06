import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { NavLinks } from "@/components/nav-links";
import { AuthButton } from "@/components/auth-button";
import { CreditsDisplay } from "@/components/credits-display";
import { MobileNav } from "@/components/mobile-nav";
import { Providers } from "@/components/providers";
import { Lilita_One, DM_Sans } from "next/font/google";
import { SEOSchema } from "@/components/seo-schema";
import "./globals.css";

const heading = Lilita_One({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-text",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mascotmaker.io"),
  title: {
    template: "%s | Mascot Maker",
    default: "Mascot Maker — AI Character & Mascot Generator",
  },
  description:
    "Free AI studio for mascots, logos, and sticker packs. We fixed 'AI drift' so your brand characters stay consistent across every pose. 8 pro styles and a studio-grade background remover.",
  keywords: [
    "mascot builder",
    "mascot maker",
    "AI mascot generator",
    "free mascot creator",
    "AI character generator",
    "mascot design tool",
    "create mascot online",
    "3D character creator",
    "AI avatar maker",
    "pixel art character generator",
    "brand mascot creator",
    "mascotmaker.io",
  ],
  authors: [{ name: "mascotmaker.io" }],
  creator: "mascotmaker.io",
  publisher: "mascotmaker.io",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "https://mascotmaker.io/favicon.ico" },
      { url: "https://mascotmaker.io/app-icon.png", type: "image/png" },
    ],
    apple: [
      { url: "https://mascotmaker.io/apple-touch-icon.png" },
    ],
  },
  openGraph: {
    title: "Mascot Maker — AI Character & Mascot Generator",
    description:
      "Transform any idea into a professional mascot, logo, or sticker pack. Custom AI generation with Identity Lock consistency. Explore mascotmaker.io today.",
    url: "https://mascotmaker.io",
    siteName: "Mascot Maker",
    images: [
      {
        url: "https://mascotmaker.io/app-icon.png",
        width: 512,
        height: 512,
        alt: "Mascot Maker — AI mascot, logo, and sticker generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mascot Maker — Powered by mascotmaker.io",
    description:
      "Free AI mascot, logo, and sticker generator with Identity Lock technology. Create consistent 3D, 2D, and vector characters for your brand.",
    images: ["https://mascotmaker.io/app-icon.png"],
    creator: "@mascotmaker",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        <SEOSchema />
        <Providers>
          {/* ── Navigation ── */}
          <nav className="sticky top-0 z-50 border-b border-foreground/[0.06] bg-cream/85 backdrop-blur-xl backdrop-saturate-150">
            <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 md:px-6">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl overflow-hidden shadow-sm border border-foreground/[0.06] transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
                  <Image
                    src="/app-icon.png"
                    alt="mascotmaker.io"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-display text-lg md:text-xl tracking-tight text-foreground leading-none">
                  Mascot Maker
                </span>
              </Link>

              {/* Right side: Nav + Credits + Auth */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden md:flex">
                  <NavLinks />
                </div>
                <CreditsDisplay />
                <AuthButton />
              </div>

            </div>
          </nav>

          <main className="pb-24 md:pb-0">{children}</main>
          <MobileNav />

          {/* ── Footer ── */}
          <footer className="border-t border-foreground/[0.06] bg-cream/60 pt-10 pb-8">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">

                {/* Brand */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-foreground/[0.06] flex-shrink-0">
                    <Image src="/app-icon.png" alt="Mascot Maker" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-display text-lg text-foreground block leading-tight">Mascot Maker</span>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">mascotmaker.io</p>
                  </div>
                </div>

                {/* External links */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Built With</span>
                  <div className="flex flex-col gap-1.5">
                    <a href="https://deepmind.google" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">Google DeepMind</a>
                    <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">Next.js Framework</a>
                    <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">Lucide Icons</a>
                  </div>
                </div>

                {/* Legal + nav links */}
                <div className="flex flex-col md:items-end gap-3">
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    <Link href="/gallery" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">Gallery</Link>
                    <Link href="/blog" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">Blog</Link>
                    <Link href="/about" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">About</Link>
                    <Link href="/explore" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">Explore</Link>
                    <Link href="/privacy" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">Privacy</Link>
                    <Link href="/terms" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors duration-200">Terms</Link>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60">
                    &copy; {new Date().getFullYear()} mascotmaker.io. All rights reserved.
                  </p>
                </div>

              </div>
            </div>
          </footer>

          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
