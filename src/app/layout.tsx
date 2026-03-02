import type { Metadata } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import Link from "next/link";
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
    template: "%s | Mascot Maker",
    default: "Mascot Maker — Create Animated AI Characters",
  },
  description:
    "Turn any idea into a custom animated mascot in minutes. Describe, refine, and bring characters to life with AI.",
  keywords: [
    "mascot maker",
    "AI character generator",
    "animated mascot",
    "character creator",
    "AI art",
    "GIF maker",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Mascot Maker — Create Animated AI Characters",
    description:
      "Turn any idea into a custom animated mascot in minutes. Describe, refine, and bring characters to life with AI.",
    type: "website",
    siteName: "Mascot Maker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mascot Maker — Create Animated AI Characters",
    description:
      "Turn any idea into a custom animated mascot in minutes. Describe, refine, and bring characters to life with AI.",
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
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-candy-pink to-candy-orange shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M8 14s-4 2-4 6h16c0-4-4-6-4-6" />
                  <path d="M9 6.5c0-1 .5-2 1.5-2.5" />
                  <path d="M15 6.5c0-1-.5-2-1.5-2.5" />
                </svg>
              </div>
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
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-candy-pink to-candy-orange">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M8 14s-4 2-4 6h16c0-4-4-6-4-6" />
                </svg>
              </div>
              <span className="font-display text-sm text-warm-gray">Mascot Maker</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by Google Gemini. Made with care.
            </p>
          </div>
        </footer>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
