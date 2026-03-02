"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon3D } from "@/components/ui/icon-3d";

interface MascotPreviewProps {
  imageUrl: string | null;
  loading: boolean;
}

const LOADING_MESSAGES = [
  "Sketching your character...",
  "Adding colors and details...",
  "Polishing the final look...",
  "Almost there...",
];

export function MascotPreview({ imageUrl, loading }: MascotPreviewProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!loading) {
      setMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-dashed border-candy-pink/30 bg-white">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-candy-pink/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-candy-pink" style={{ animationDuration: "1s" }} />
            </div>
            <p className="font-display text-sm text-warm-gray transition-opacity duration-300">
              {LOADING_MESSAGES[msgIndex]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-dashed border-border bg-white/50">
        <div className="absolute inset-0 flex items-center justify-center bg-dotted">
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <Icon3D name="artist-palette" size="2xl" animated />
            <p className="font-display text-lg text-warm-gray">
              Your canvas awaits
            </p>
            <p className="text-sm text-muted-foreground">
              Describe a character or upload an image to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-white bg-checkerboard shadow-xl shadow-candy-pink/10 animate-pop-in"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={imageUrl}
        alt="Your mascot"
        className="h-full w-full object-contain"
      />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
      <a
        href={imageUrl}
        download="mascot.png"
        className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-warm-gray shadow-lg backdrop-blur-sm transition-all hover:bg-white ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </a>
    </div>
  );
}
