"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icon3DInline } from "@/components/ui/icon-3d";
import type { FluentIcon3D } from "@/components/ui/icon-3d";
import { motion } from "framer-motion";

interface AnimationPickerProps {
  mascotBase64: string;
  description?: string;
  onAnimationGenerated: (anim: { spriteBase64: string; animationBase64: string; action: string }) => void;
  onLoadingChange: (loading: boolean) => void;
  onApiError: (res: Response, data: Record<string, unknown>) => boolean;
  onCreditsUpdate: (creditsRemaining?: number) => void;
  removeBackground?: boolean;
  subjectType?: "Character" | "Sticker" | "Logo";
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{children}</p>
);

const ANIMATION_PRESETS: { label: string; icon: FluentIcon3D }[] = [
  { label: "Wave", icon: "waving-hand" },
  { label: "Jump", icon: "kangaroo" },
  { label: "Dance", icon: "woman-dancing" },
  { label: "Idle", icon: "relieved-face" },
  { label: "Walk", icon: "person-walking" },
  { label: "Victory", icon: "thumbs-up" },
];

const STICKER_PRESETS: { label: string; icon: FluentIcon3D }[] = [
  { label: "Emotions", icon: "artist-palette" },
  { label: "Happy", icon: "relieved-face" },
  { label: "Dizzy", icon: "dizzy-face" },
  { label: "Cool", icon: "sparkles" },
  { label: "Action", icon: "high-voltage" },
  { label: "Thinking", icon: "magnifying-glass" },
];

export function AnimationPicker({
  mascotBase64,
  description,
  onAnimationGenerated,
  onLoadingChange,
  onApiError,
  onCreditsUpdate,
  removeBackground = false,
  subjectType = "Character",
}: AnimationPickerProps) {
  const [customAction, setCustomAction] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const presets = subjectType === "Sticker" ? STICKER_PRESETS : ANIMATION_PRESETS;
  const isSticker = subjectType === "Sticker";

  const handleAnimate = async (action: string) => {
    setActiveAction(action);
    onLoadingChange(true);
    try {
      const res = await fetch("/api/animate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mascotBase64, action, description, removeBackground, subjectType }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to generate animation");
        return;
      }
      onCreditsUpdate(data.creditsRemaining);
      if (data.animationBase64) {
        onAnimationGenerated({
          spriteBase64: data.spriteBase64,
          animationBase64: data.animationBase64,
          action,
        });
      }
    } catch {
      toast.error("Failed to generate animation. Please try again.");
    } finally {
      setActiveAction(null);
      onLoadingChange(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <SectionLabel>{isSticker ? "Sticker Set" : "Motion Suite"}</SectionLabel>
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/20 italic">
          {isSticker ? "Generate 9 unique expressions" : "Trigger studio animations"}
        </p>
      </div>

      {/* Preset Actions Grid - Obsidian Style */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map((action) => (
          <button
            key={action.label}
            onClick={() => handleAnimate(action.label.toLowerCase())}
            disabled={activeAction !== null}
            className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
              activeAction === action.label.toLowerCase()
              ? "border-[#F5C842] bg-[#F5C842]/5 shadow-lg shadow-[#F5C842]/5"
              : "border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.1]"
            }`}
          >
            <div className={`transition-all duration-500 ${activeAction === action.label.toLowerCase() ? "scale-110 rotate-3" : "opacity-60 group-hover:opacity-100 group-hover:scale-110"}`}>
              <Icon3DInline name={action.icon} size={24} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${activeAction === action.label.toLowerCase() ? "text-[#F5C842]" : "text-white/30 group-hover:text-white/60"}`}>
              {action.label}
            </span>
            
            {activeAction === action.label.toLowerCase() && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl overflow-hidden backdrop-blur-[1px]">
                  {/* Subtle progress line */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 15, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-[#F5C842]"
                  />
                  <div className="h-4 w-4 animate-spin rounded-full border border-[#F5C842] border-t-transparent" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Action Layer */}
      <div className="space-y-4 pt-2">
         <div className="flex items-center justify-center gap-3">
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
          <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Custom Sequence</span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <div className="flex gap-1.5 p-1 rounded-xl bg-black border border-white/[0.08]">
          <input
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customAction.trim()) {
                handleAnimate(customAction.trim());
                setCustomAction("");
              }
            }}
            placeholder="Type a custom action..."
            disabled={activeAction !== null}
            className="flex-1 bg-transparent px-4 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none disabled:opacity-50"
          />
          <Button
            onClick={() => {
              if (customAction.trim()) {
                handleAnimate(customAction.trim());
                setCustomAction("");
              }
            }}
            disabled={!customAction.trim() || activeAction !== null}
            className="rounded-lg bg-[#F5C842] hover:bg-[#F5C842] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-black shadow-md hover:brightness-110 active:scale-95 disabled:opacity-10 transition-all"
          >
            {isSticker ? "Gen" : "Run"}
          </Button>
        </div>
      </div>
    </div>
  );
}

