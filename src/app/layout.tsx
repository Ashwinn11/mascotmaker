import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { NavLinks } from "@/components/nav-links";
import { AuthButton } from "@/components/auth-button";
import { CreditsDisplay } from "@/components/credits-display";
import { MobileNav } from "@/components/mobile-nav";
import { Providers } from "@/components/providers";
import { Lilita_One, Nunito } from "next/font/google";
import { SEOSchema } from "@/components/seo-schema";
import "./globals.css";

const heading = Lilita_One({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
  display: "swap",
});

const body = Nunito({
  subsets: ["latin"],
  variable: "--font-body-text",
  display: "swap",
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
          <nav className="sticky top-0 z-50 border-b border-border/50 bg-cream/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between px-4 md:px-6">
              <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                <Image
                  src="/app-icon.png"
                  alt="mascotmaker.io"
                  width={40}
                  height={40}
                  className="rounded-lg md:rounded-xl shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3 md:w-[56px] md:h-[56px]"
                />
                <span className="font-display text-xl md:text-2xl tracking-tight text-foreground">
                  Mascot Maker
                </span>
              </Link>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden md:block">
                  <NavLinks />
                </div>
                <CreditsDisplay />
                <AuthButton />
              </div>
            </div>
          </nav>
          <main className="pb-24 md:pb-0">{children}</main>
          <MobileNav />
          <footer className="border-t border-border/50 bg-cream/50 pt-12 pb-8">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src="/app-icon.png"
                    alt="Mascot Maker"
                    width={64}
                    height={64}
                    className="rounded-xl shadow-sm"
                  />
                  <div>
                    <span className="font-display text-xl text-foreground block">Mascot Maker</span>
                    <p className="text-sm text-muted-foreground font-semibold">mascotmaker.io</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-foreground/50">External Resources</span>
                  <div className="flex flex-col gap-1">
                    <a href="https://deepmind.google" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors">Google DeepMind</a>
                    <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors">Next.js Framework</a>
                    <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors">Lucide Icons</a>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <div className="flex flex-wrap gap-6">
                    <Link href="/blog" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors">Blog</Link>
                    <Link href="/explore" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors">Explore</Link>
                    <Link href="/privacy" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-sm font-semibold text-warm-gray hover:text-candy-pink transition-colors">Terms of Service</Link>
                  </div>
                  <p className="text-xs text-muted-foreground">
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
