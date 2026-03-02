import type { Metadata } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { NavLinks } from "@/components/nav-links";
import "./globals.css";

const heading = Lilita_One({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const body = Nunito({
  variable: "--font-body-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s — Mascot Maker",
    default: "Mascot Maker — AI Mascot & Character Generator with Animation",
  },
  description:
    "Create custom mascot characters from text or images in seconds. Refine with AI chat, animate as GIFs, and share with the world — completely free, powered by Nano Banana 2.",
  keywords: [
    "mascot maker",
    "AI character generator",
    "animated mascot",
    "character creator",
    "AI mascot generator",
    "GIF maker",
    "cartoon avatar",
    "mascot animation",
    "text to character",
    "AI art generator",
    "free mascot creator",
  ],
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Mascot Maker — AI Mascot & Character Generator with Animation",
    description:
      "Create custom mascot characters from text or images in seconds. Refine with AI chat, animate as GIFs, and share with the world — completely free.",
    type: "website",
    siteName: "Mascot Maker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mascot Maker — AI Mascot & Character Generator",
    description:
      "Turn any idea into a custom animated mascot. Describe it, refine with AI chat, and bring it to life as an animated GIF — all for free.",
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
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-cream/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/app-icon.png"
                alt="Mascot Maker"
                width={36}
                height={36}
                className="rounded-xl shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3"
              />
              <span className="font-display text-xl tracking-tight text-foreground">
                Mascot Maker
              </span>
            </Link>
            <NavLinks />
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-border/50 bg-cream/50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2">
              <Image
                src="/app-icon.png"
                alt="Mascot Maker"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="font-display text-sm text-warm-gray">Mascot Maker</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by Nano Banana 2. Made with care.
            </p>
          </div>
        </footer>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
