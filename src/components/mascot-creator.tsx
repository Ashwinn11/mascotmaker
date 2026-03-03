"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { PromptInput } from "./prompt-input";
import { MascotPreview } from "./mascot-preview";
import { ChatRefiner } from "./chat-refiner";
import { AnimationPicker } from "./animation-picker";
import { GifPreview } from "./gif-preview";
import { PaywallModal } from "./paywall-modal";
import { Icon3DInline } from "@/components/ui/icon-3d";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
  const { data: session, status, update: updateSession } = useSession();
  const [mode, setMode] = useState<Mode>("create");
  const [mascotImageUrl, setMascotImageUrl] = useState<string | null>(null);
  const [mascotDescription, setMascotDescription] = useState<string | null>(null);
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallType, setPaywallType] = useState<"auth" | "credits">("auth");
  const [paywallCreditsRequired, setPaywallCreditsRequired] = useState(0);

  // Show paywall if not authenticated
  const requireAuth = (): boolean => {
    if (status === "loading") return false;
    if (!session?.user) {
      setPaywallType("auth");
      setPaywallOpen(true);
      return false;
    }
    return true;
  };

  // Handle API errors that indicate auth/credit issues
  const handleApiError = (res: Response, data: { error?: string; creditsRequired?: number; creditsRemaining?: number }): boolean => {
    if (res.status === 401) {
      setPaywallType("auth");
      setPaywallOpen(true);
      return false;
    }
    if (res.status === 402) {
      setPaywallType("credits");
      setPaywallCreditsRequired(data.creditsRequired || 0);
      setPaywallOpen(true);
      return false;
    }
    return true;
  };

  // Refresh session to pick up updated credit balance from DB
  const handleCreditsUpdate = async (_creditsRemaining?: number) => {
    await updateSession();
  };

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
                <PromptInput
                  onGenerated={handleGenerated}
                  onLoadingChange={setLoading}
                  requireAuth={requireAuth}
                  onApiError={handleApiError}
                  onCreditsUpdate={handleCreditsUpdate}
                />
              </div>
            )}

            {mode === "refine" && mascotImageUrl && (
              <ChatRefiner
                mascotImageUrl={mascotImageUrl}
                onMascotUpdate={handleMascotUpdate}
                onLoadingChange={setLoading}
                onDone={() => setMode("animate")}
                onApiError={handleApiError}
                onCreditsUpdate={handleCreditsUpdate}
              />
            )}

            {mode === "animate" && mascotImageUrl && (
              <div className="space-y-6">
                <AnimationPicker
                  mascotImageUrl={mascotImageUrl}
                  mascotDescription={mascotDescription}
                  onAnimationGenerated={handleAnimationGenerated}
                  onLoadingChange={setLoading}
                  onApiError={handleApiError}
                  onCreditsUpdate={handleCreditsUpdate}
                />
                <GifPreview gifs={gifs} mascotImageUrl={mascotImageUrl} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        type={paywallType}
        creditsRequired={paywallCreditsRequired}
        creditsRemaining={session?.user?.credits ?? 0}
      />

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Start Over?"
        description="This will discard your current mascot and all animations. This action cannot be undone."
        confirmText="Start Over"
        variant="destructive"
        onConfirm={handleStartOver}
      />
    </div>
  );
}
