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
    default: "Mascot Maker — AI Mascot & Character Generator at mascotmaker.io",
  },
  description:
    "The ultimate AI mascot maker. Create custom characters from text or images, refine them with AI chat, and bring them to life with animations. All-in-one character creator at mascotmaker.io.",
  keywords: [
    "mascot maker",
    "AI mascot generator",
    "mascotmaker.io",
    "character generator",
    "animated mascot creator",
    "AI cartoon avatar",
    "mascot animation tool",
    "AI Character Generator",
    "Mascot Maker",
    "AI Icon Maker",
    "Character Consistency",
    "Professional AI Design",
  ],
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Mascot Maker — The fastest AI Character Generator",
    description:
      "Transform any idea into a professional mascot. Custom AI generation, chat-based refiner, and GIF animation. Explore mascotmaker.io today.",
    type: "website",
    siteName: "Mascot Maker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mascot Maker — Powered by mascotmaker.io",
    description:
      "The all-in-one platform for creating and animating custom AI mascot characters.",
  },
  alternates: {
    canonical: "https://mascotmaker.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} antialiased`}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
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
                <div className="flex flex-col md:items-end gap-2">
                  <div className="flex gap-6">
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
