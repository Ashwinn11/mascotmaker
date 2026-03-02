"use client";

import { useEffect, useState } from "react";

interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
  image_url: string;
  gif_url: string | null;
  created_at: string;
}

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-3xl bg-muted"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="animate-float text-7xl mb-4">🏛️</div>
        <h2 className="font-display text-2xl text-foreground mb-2">Gallery is Empty</h2>
        <p className="text-muted-foreground max-w-sm">
          No mascots have been published yet. Create one and be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {items.map((item, i) => (
        <GalleryCard key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border-2 border-border bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-candy-pink/10 animate-pop-in"
      style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={hovered && item.gif_url ? item.gif_url : item.image_url}
          alt={item.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {item.gif_url && (
          <div className={`absolute top-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white transition-opacity ${hovered ? "opacity-100" : "opacity-0"}`}>
            GIF
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-display text-base text-foreground truncate">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </div>
    </div>
  );
}
