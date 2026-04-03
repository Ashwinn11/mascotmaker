"use client";

import React from "react";

interface StickerGridProps {
  spriteBase64: string;
  removeBackground: boolean;
}

export function StickerGrid({ spriteBase64, removeBackground }: StickerGridProps) {
  // Create an array for the 9 stickers in a 3x3 grid
  const stickers = Array.from({ length: 9 });

  return (
    <div className={`grid grid-cols-3 gap-3 p-4 h-full w-full content-center items-center ${removeBackground ? "bg-checkerboard" : "bg-white"}`}>
      {stickers.map((_, i) => {
        // Calculate background position for 3x3 grid with 300% background-size
        const xPercent = (i % 3) * 50; 
        const yPercent = Math.floor(i / 3) * 50;
        
        return (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:z-10 hover:-translate-y-1 active:scale-95 animate-in fade-in zoom-in duration-500"
            style={{ 
              animationDelay: `${i * 50}ms`,
            }}
          >
            {/* Sticker Image using background-position for sprite sheet efficiency */}
            <div 
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(data:image/png;base64,${spriteBase64})`,
                backgroundSize: "300% 300%",
                backgroundPosition: `${xPercent}% ${yPercent}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
            
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* Subtle border to define the sticker edge */}
            <div className="absolute inset-0 border border-white/30 rounded-2xl pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}
