"use client";

import { useState } from "react";
import { downloadFile } from "@/lib/download";
import { Icon3DInline } from "@/components/ui/icon-3d";

interface AnimationItem {
  spriteBase64: string;
  animationBase64: string;
  action: string;
}

interface AnimationPreviewProps {
  animations: AnimationItem[];
  mascotBase64: string;
}

function downloadBase64(base64: string, filename: string, mimeType: string = "image/png") {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AnimationPreview({ animations }: AnimationPreviewProps) {
  const [hoverStates, setHoverStates] = useState<Record<number, "gif" | "pack" | null>>({});

  // Show only previous animations here, as the latest one is now featured on the left
  const others = animations.slice(0, animations.length - 1).reverse();

  if (others.length === 0) return null;

  return (
    <div className="space-y-4 border-t-2 border-border pt-6">
      <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-widest pl-2 flex items-center gap-2">
        <Icon3DInline name="clapper-board" size={16} />
        Recent Animations
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {others.map((anim, idx) => {
          const i = animations.length - 2 - idx;
          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border-2 border-border bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-white">
                <img
                  src={hoverStates[i] === "pack"
                    ? `data:image/png;base64,${anim.spriteBase64}`
                    : `data:image/webp;base64,${anim.animationBase64}`
                  }
                  alt={`${anim.action} animation`}
                  className={`h-full w-full object-contain transition-all duration-300 ${hoverStates[i] === "pack" ? "scale-95" : "scale-100"}`}
                />
              </div>
              <div className="p-2">
                <p className="text-[10px] font-bold text-warm-gray capitalize mb-1.5">{anim.action}</p>
                <div className="flex gap-1">
                  <button
                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, [i]: "gif" }))}
                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, [i]: null }))}
                    onClick={() => downloadFile(`data:image/webp;base64,${anim.animationBase64}`, `mascot-${anim.action}.webp`)}
                    className="flex-1 rounded-lg bg-muted py-1.5 text-center text-[9px] font-bold text-warm-gray transition-colors hover:bg-border truncate px-1"
                  >
                    Animated
                  </button>
                  <button
                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, [i]: "pack" }))}
                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, [i]: null }))}
                    onClick={() => downloadBase64(anim.spriteBase64, `mascot-${anim.action}-pack.png`)}
                    className="flex-1 rounded-lg bg-muted py-1.5 text-center text-[9px] font-bold text-warm-gray transition-colors hover:bg-border truncate px-1"
                  >
                    Stickers
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
