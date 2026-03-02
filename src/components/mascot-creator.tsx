"use client";

import { useState } from "react";
import { PromptInput } from "./prompt-input";
import { MascotPreview } from "./mascot-preview";
import { ChatRefiner } from "./chat-refiner";
import { AnimationPicker } from "./animation-picker";
import { GifPreview } from "./gif-preview";
import { Icon3DInline } from "@/components/ui/icon-3d";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Mode = "create" | "refine" | "animate";

interface GifItem {
  spriteUrl: string;
  gifUrl: string;
  action: string;
}

const STEPS = [
  { key: "create" as Mode, label: "Create", icon: "artist-palette" as const, num: 1 },
  { key: "refine" as Mode, label: "Refine", icon: "sparkles" as const, num: 2 },
  { key: "animate" as Mode, label: "Animate", icon: "clapper-board" as const, num: 3 },
];

export function MascotCreator() {
  const [mode, setMode] = useState<Mode>("create");
  const [mascotImageUrl, setMascotImageUrl] = useState<string | null>(null);
  const [mascotDescription, setMascotDescription] = useState<string | null>(null);
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleGenerated = (imageUrl: string, analysis?: string) => {
    setMascotImageUrl(imageUrl);
    if (analysis) setMascotDescription(analysis);
    setMode("refine");
  };

  const handleMascotUpdate = (imageUrl: string) => {
    setMascotImageUrl(imageUrl);
  };

  const handleAnimationGenerated = (gif: GifItem) => {
    setGifs((prev) => [...prev, gif]);
  };

  const handleStartOver = () => {
    setMascotImageUrl(null);
    setMascotDescription(null);
    setGifs([]);
    setMode("create");
    setConfirmReset(false);
  };

  const canGoTo = (step: Mode) => {
    if (step === "create") return true;
    if (step === "refine") return !!mascotImageUrl;
    if (step === "animate") return !!mascotImageUrl;
    return false;
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl bg-white border-2 border-border p-1.5 shadow-sm">
          {STEPS.map((step) => {
            const isActive = mode === step.key;
            const isAccessible = canGoTo(step.key);
            return (
              <button
                key={step.key}
                onClick={() => isAccessible && setMode(step.key)}
                disabled={!isAccessible}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${isActive
                    ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-md scale-105"
                    : isAccessible
                      ? "text-warm-gray hover:bg-muted"
                      : "text-muted-foreground/40 cursor-not-allowed"
                  }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${isActive ? "bg-white/20" : "bg-muted"
                  }`}>
                  {step.num}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">
                  <Icon3DInline name={step.icon} size={18} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Preview */}
        <div className="flex flex-col gap-4">
          <MascotPreview imageUrl={mascotImageUrl} loading={loading && mode === "create"} />
          {mascotImageUrl && mode !== "create" && (
            <button
              onClick={() => setConfirmReset(true)}
              className="self-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Start over with a new mascot
            </button>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex flex-col">
          <div className="rounded-3xl border-2 border-border bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            {mode === "create" && (
              <div>
                <h2 className="font-display text-2xl text-foreground mb-1">Create Your Mascot</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Describe a character or upload an image to transform
                </p>
                <PromptInput onGenerated={handleGenerated} onLoadingChange={setLoading} />
              </div>
            )}

            {mode === "refine" && mascotImageUrl && (
              <ChatRefiner
                mascotImageUrl={mascotImageUrl}
                onMascotUpdate={handleMascotUpdate}
                onLoadingChange={setLoading}
                onDone={() => setMode("animate")}
              />
            )}

            {mode === "animate" && mascotImageUrl && (
              <div className="space-y-6">
                <AnimationPicker
                  mascotImageUrl={mascotImageUrl}
                  mascotDescription={mascotDescription}
                  onAnimationGenerated={handleAnimationGenerated}
                  onLoadingChange={setLoading}
                />
                <GifPreview gifs={gifs} mascotImageUrl={mascotImageUrl} />
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="rounded-3xl border-2 border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Start Over?</DialogTitle>
            <DialogDescription>
              This will discard your current mascot and all animations. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmReset(false)}
              className="rounded-xl border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartOver}
              className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
            >
              Start Over
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
