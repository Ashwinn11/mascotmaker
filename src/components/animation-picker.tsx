"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AnimationPickerProps {
  mascotImageUrl: string;
  mascotDescription?: string | null;
  onAnimationGenerated: (gif: { spriteUrl: string; gifUrl: string; action: string }) => void;
  onLoadingChange: (loading: boolean) => void;
}

const PRESET_ACTIONS = [
  { label: "Wave", emoji: "👋", color: "from-candy-pink to-candy-orange" },
  { label: "Jump", emoji: "🦘", color: "from-candy-orange to-candy-yellow" },
  { label: "Dance", emoji: "💃", color: "from-candy-yellow to-candy-green" },
  { label: "Idle", emoji: "😌", color: "from-candy-green to-candy-blue" },
  { label: "Walk", emoji: "🚶", color: "from-candy-blue to-candy-purple" },
  { label: "Thumbs Up", emoji: "👍", color: "from-candy-purple to-candy-pink" },
];

export function AnimationPicker({
  mascotImageUrl,
  mascotDescription,
  onAnimationGenerated,
  onLoadingChange,
}: AnimationPickerProps) {
  const [customAction, setCustomAction] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAnimate = async (action: string) => {
    setActiveAction(action);
    onLoadingChange(true);
    try {
      const res = await fetch("/api/animate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mascotImageUrl, action, description: mascotDescription }),
      });
      const data = await res.json();
      if (data.gifUrl) {
        onAnimationGenerated({
          spriteUrl: data.spriteUrl,
          gifUrl: data.gifUrl,
          action,
        });
      }
    } catch (err) {
      console.error("Animate failed:", err);
    } finally {
      setActiveAction(null);
      onLoadingChange(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-lg text-foreground mb-1">Animate Your Mascot</h3>
        <p className="text-sm text-muted-foreground">Pick an action or describe your own</p>
      </div>

      {/* Preset Actions Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {PRESET_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleAnimate(action.label.toLowerCase())}
            disabled={activeAction !== null}
            className={`group relative overflow-hidden rounded-2xl border-2 border-border bg-white p-4 text-center transition-all hover:border-transparent hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-wait ${
              activeAction === action.label.toLowerCase() ? "border-candy-pink shadow-lg" : ""
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 transition-opacity group-hover:opacity-10`} />
            <div className="relative">
              <span className="text-2xl block mb-1">{action.emoji}</span>
              <span className="text-xs font-bold text-warm-gray">{action.label}</span>
            </div>
            {activeAction === action.label.toLowerCase() && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-candy-pink border-t-transparent" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Action */}
      <div className="flex gap-2">
        <input
          value={customAction}
          onChange={(e) => setCustomAction(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customAction.trim()) {
              handleAnimate(customAction.trim());
              setCustomAction("");
            }
          }}
          placeholder="Or type a custom action..."
          disabled={activeAction !== null}
          className="flex-1 rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-candy-purple focus:outline-none focus:ring-2 focus:ring-candy-purple/20 disabled:opacity-50"
        />
        <Button
          onClick={() => {
            if (customAction.trim()) {
              handleAnimate(customAction.trim());
              setCustomAction("");
            }
          }}
          disabled={!customAction.trim() || activeAction !== null}
          className="rounded-2xl bg-gradient-to-r from-candy-purple to-candy-pink px-5 text-white shadow-md hover:brightness-105 active:scale-95"
        >
          Animate
        </Button>
      </div>
    </div>
  );
}
