"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { StudioMascot } from "./studio-mascot";
import { MascotPreview } from "./mascot-preview";
import { ChatRefiner } from "./chat-refiner";
import { AnimationPicker } from "./animation-picker";
import { AnimationPreview } from "./animation-preview";
import { PaywallModal } from "./paywall-modal";
import { Icon3DInline } from "@/components/ui/icon-3d";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type StudioTab = "mascot";
type MascotStep = "create" | "refine" | "animate";

interface AnimationItem {
  spriteBase64: string;
  animationBase64: string;
  action: string;
}

const STUDIO_TABS = [
  { key: "mascot" as StudioTab, label: "Mascot", icon: "artist-palette" as const, desc: "Create a single asset" },
];

const ALL_MASCOT_STEPS = [
  { key: "create" as MascotStep, label: "Create", num: 1 },
  { key: "refine" as MascotStep, label: "Refine", num: 2 },
  { key: "animate" as MascotStep, label: "Action Set", num: 3 },
];

// ── Shared left-panel placeholder shown before any result exists ──────────────
function EmptyPreview({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
      <Icon3DInline name={icon as any} size={48} className="opacity-40" />
      <div>
        <p className="text-sm font-black text-white/70 tracking-wide uppercase">{title}</p>
        <p className="text-xs text-white/40 mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function MascotCreator() {
  const { data: session, status, update: updateSession } = useSession();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<StudioTab>("mascot");

  // Handle deep-linking to specific tabs
  useEffect(() => {
    const tabParam = searchParams.get("tab") as StudioTab;
    if (tabParam && STUDIO_TABS.some(t => t.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Mascot workflow
  const [mascotStep, setMascotStep] = useState<MascotStep>("create");
  const [mascotBase64, setMascotBase64] = useState<string | null>(null);
  const [mascotImages, setMascotImages] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [animations, setAnimations] = useState<AnimationItem[]>([]);
  const [mascotLoading, setMascotLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pendingStep, setPendingStep] = useState<MascotStep | null>(null);
  const [createOptions, setCreateOptions] = useState({
    aspectRatio: "1:1",
    imageSize: "2K" as "512px" | "1K" | "2K" | "4K",
    removeBackground: false,
    subjectType: "Character" as "Character" | "Sticker" | "Logo",
  });

  // Paywall
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallType, setPaywallType] = useState<"auth" | "credits">("auth");
  const [paywallCreditsRequired, setPaywallCreditsRequired] = useState(0);

  const requireAuth = (): boolean => {
    if (status === "loading") return false;
    if (!session?.user) { setPaywallType("auth"); setPaywallOpen(true); return false; }
    return true;
  };

  const handleApiError = (res: Response, data: { error?: string; creditsRequired?: number }): boolean => {
    if (res.status === 401) { setPaywallType("auth"); setPaywallOpen(true); return false; }
    if (res.status === 402) { setPaywallType("credits"); setPaywallCreditsRequired(data.creditsRequired || 0); setPaywallOpen(true); return false; }
    return true;
  };

  const handleCreditsUpdate = async () => { await updateSession(); };

  const handleMascotGenerated = (images: string[], newAnalysis?: string, options?: any) => {
    setMascotImages(images);
    setMascotBase64(images[0]);
    if (newAnalysis) setAnalysis(newAnalysis);
    if (options) setCreateOptions(prev => ({ ...prev, ...options }));
    setAnimations([]);
    setMascotStep("refine");
  };

  const handleMascotUpdate = (imageBase64: string, newAnalysis?: string) => {
    setMascotBase64(imageBase64);
    setMascotImages([imageBase64]);
    if (newAnalysis) setAnalysis(newAnalysis);
    setAnimations([]);
  };

  const handleStartOver = () => {
    setPendingStep("create");
    setConfirmReset(true);
  };

  const confirmStepChange = () => {
    if (pendingStep === "create") {
      setMascotBase64(null); setMascotImages([]); setAnalysis(null);
      setAnimations([]);
      setMascotStep("create");
    } else if (pendingStep === "refine") {
      setAnimations([]);
      setMascotStep("refine");
    }
    setConfirmReset(false);
    setPendingStep(null);
  };

  const getCurrentSteps = () => {
    if (createOptions.subjectType === "Character") return ALL_MASCOT_STEPS;
    return ALL_MASCOT_STEPS.filter(s => s.key !== "animate");
  };

  const canGoToStep = (step: MascotStep) => {
    if (step === "create") return true;
    if (!mascotBase64) return false;
    if (step === "animate" && createOptions.subjectType !== "Character") return false;
    return true;
  };

  const handleStepClick = (targetStep: MascotStep) => {
    if (!canGoToStep(targetStep)) return;

    // Going backward to create clears everything
    if (targetStep === "create" && mascotBase64) {
      setPendingStep("create");
      setConfirmReset(true);
      return;
    }

    // Going backward to refine clears animations
    if (targetStep === "refine" && mascotStep === "animate" && animations.length > 0) {
      setPendingStep("refine");
      setConfirmReset(true);
      return;
    }

    setMascotStep(targetStep);
  };

  const sharedProps = { requireAuth, onApiError: handleApiError, onCreditsUpdate: handleCreditsUpdate };

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 md:px-6 md:py-10 mb-16 md:mb-0">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-10">

        {/* ── RIGHT (now Top on mobile): Studio Panel ── */}
        <div className="h-full">
          <div className="rounded-[2rem] border border-white/10 glass-dark p-6 md:p-8 shadow-2xl flex-1 h-full flex flex-col relative overflow-hidden">
            {/* Subtle glow background inside panel */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-candy-pink/5 blur-[80px] pointer-events-none" />

            {/* MASCOT */}
            {activeTab === "mascot" && (
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-8 flex items-center justify-center">
                  <div className="flex items-center gap-1 rounded-full glass-dark border border-white/10 p-1.5 shadow-xl backdrop-blur-xl">
                    {getCurrentSteps().map((step, idx) => {
                      const isActive = mascotStep === step.key;
                      const isAccessible = canGoToStep(step.key);
                      return (
                        <button key={step.key} onClick={() => isAccessible && handleStepClick(step.key)}
                          disabled={!isAccessible}
                          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-300 ${isActive
                            ? "bg-candy-pink text-white shadow-[0_0_15px_rgba(255,77,28,0.4)]"
                            : isAccessible ? "text-white/60 hover:bg-white/5 hover:text-white" : "text-white/20 cursor-not-allowed"}`}>
                          <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${isActive ? "bg-white/20" : "bg-white/10"}`}>
                            {idx + 1}
                          </span>
                          {step.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {mascotStep === "create" && (
                  <StudioMascot onGenerated={handleMascotGenerated} onLoadingChange={setMascotLoading} {...sharedProps} />
                )}
                {mascotStep === "refine" && mascotBase64 && (
                  <ChatRefiner mascotBase64={mascotBase64} analysis={analysis}
                    aspectRatio={createOptions.aspectRatio} imageSize={createOptions.imageSize}
                    removeBackground={createOptions.removeBackground}
                    subjectType={createOptions.subjectType}
                    onMascotUpdate={handleMascotUpdate} onLoadingChange={setMascotLoading}
                    onDone={() => {
                      if (createOptions.subjectType === "Character") {
                        setMascotStep("animate");
                      }
                    }} {...sharedProps} />
                )}

                {mascotStep === "animate" && mascotBase64 && (
                  <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                    <AnimationPicker mascotBase64={mascotBase64} description={analysis || undefined}
                      removeBackground={createOptions.removeBackground}
                      subjectType={createOptions.subjectType}
                      onAnimationGenerated={(anim) => setAnimations(prev => [...prev, anim])}
                      onLoadingChange={setMascotLoading} {...sharedProps} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── LEFT (now Bottom on mobile): Preview Panel ── */}
        <div className="order-last lg:order-first flex flex-col gap-5">
          {activeTab === "mascot" && (
            <>
              <MascotPreview
                mascotBase64={mascotBase64}
                images={mascotImages}
                animations={animations}
                analysis={analysis}
                setAnimations={setAnimations}
                loading={mascotLoading && mascotStep !== "animate"}
                removeBackground={createOptions.removeBackground}
                subjectType={createOptions.subjectType}
              />
              {mascotBase64 && mascotStep !== "create" && (
                <button onClick={handleStartOver}
                  className="self-center text-[11px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-candy-pink hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300">
                  ← Start over with a new mascot
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} type={paywallType}
        creditsRequired={paywallCreditsRequired} creditsRemaining={session?.user?.credits ?? 0} />
      <ConfirmDialog open={confirmReset} onOpenChange={(open) => { setConfirmReset(open); if (!open) setPendingStep(null); }}
        title={pendingStep === "create" ? "Start Over?" : "Clear Animations?"}
        description={pendingStep === "create" ? "Discard current mascot and all generated animations completely?" : "Going back to refine will discard your current animations because it modifies the mascot. Continue?"}
        confirmText={pendingStep === "create" ? "Start Over" : "Clear & Go Back"}
        variant="destructive" onConfirm={confirmStepChange} />
    </div>
  );
}
