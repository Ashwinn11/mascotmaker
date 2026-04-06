import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { NavLinks } from "@/components/nav-links";
import { AuthButton } from "@/components/auth-button";
import { CreditsDisplay } from "@/components/credits-display";
import { MobileNav } from "@/components/mobile-nav";
import { Providers } from "@/components/providers";
import { Lilita_One, Outfit } from "next/font/google";
import { SEOSchema } from "@/components/seo-schema";
import "./globals.css";

const heading = Lilita_One({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
  display: "swap",
});

const body = Outfit({
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
      <body className={`${heading.variable} ${body.variable} antialiased dark`}>
        <SEOSchema />
        <Providers>
          {/* ── Navigation ── */}
          <nav className="sticky top-0 z-50 border-b border-white/[0.08] glass-dark">
            <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-4 md:px-6">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="relative w-8 h-8 md:w-9 md:h-9 overflow-hidden transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/app-icon.png"
                    alt="mascotmaker.io"
                    fill
                    className="object-cover"
                  />
                  {/* Subtle coral glow around logo on dark mode */}
                  <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(255,77,28,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="font-display text-xl tracking-tight text-white leading-none">
                  Mascot Maker
                </span>
              </Link>

              {/* Right side: Nav + Credits + Auth */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="hidden md:flex">
                  <NavLinks />
                </div>
                <div className="h-4 w-px bg-white/10 hidden md:block" />
                <CreditsDisplay />
                <AuthButton />
              </div>

            </div>
          </nav>

          <main className="pb-24 md:pb-0 min-h-[calc(100vh-64px)]">{children}</main>
          <MobileNav />

          {/* ── Footer ── */}
          <footer className="border-t border-white/[0.05] bg-[#0c0a09] pt-12 pb-10">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start justify-between">

                {/* Brand */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/[0.06] flex-shrink-0 bg-[#141210]">
                    <Image src="/app-icon.png" alt="Mascot Maker" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-display text-lg text-white block leading-tight">Mascot Maker</span>
                    <p className="text-xs text-white/60 font-medium mt-1">mascotmaker.io</p>
                  </div>
                </div>

                {/* External links */}
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/30">Built With</span>
                  <div className="flex flex-col gap-2">
                    <a href="https://deepmind.google" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      Google DeepMind
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </a>
                    <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      Next.js Framework
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </a>
                    <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      Lucide Icons
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </a>
                  </div>
                </div>

                {/* Legal + nav links */}
                <div className="flex flex-col md:items-end gap-5">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
                    <Link href="/gallery" className="text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      Gallery
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/blog" className="text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      Blog
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/about" className="text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      About
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/explore" className="text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      Explore
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/privacy" className="text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      Privacy
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/terms" className="text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200 group relative">
                      Terms
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-candy-pink transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </div>
                  <p className="text-[11px] text-white/40 font-medium">
                    &copy; {new Date().getFullYear()} mascotmaker.io. All rights reserved.
                  </p>
                </div>

              </div>
            </div>
          </footer>

          <Toaster richColors position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
