"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface MascotPreviewProps {
  imageUrl: string | null;
  loading: boolean;
}

export function MascotPreview({ imageUrl, loading }: MascotPreviewProps) {
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
            <p className="font-display text-sm text-warm-gray">
              Creating magic...
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
            <div className="animate-float text-6xl">🎨</div>
            <p className="font-display text-lg text-warm-gray">
              Your mascot will appear here
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
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl shadow-candy-pink/10 animate-pop-in">
      <img
        src={imageUrl}
        alt="Your mascot"
        className="h-full w-full object-contain"
      />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
    </div>
  );
}
