import type { Metadata } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import Link from "next/link";
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
  title: "Mascot Maker",
  description: "Create animated mascot characters with AI",
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
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-warm-gray transition-colors hover:bg-secondary hover:text-foreground"
              >
                Create
              </Link>
              <Link
                href="/gallery"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-warm-gray transition-colors hover:bg-secondary hover:text-foreground"
              >
                Gallery
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
