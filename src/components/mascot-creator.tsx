"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { StudioMascot } from "./studio-mascot";
import { StudioStory } from "./studio-story";
import { StudioMix } from "./studio-mix";
import { MascotPreview } from "./mascot-preview";
import { ChatRefiner } from "./chat-refiner";
import { AnimationPicker } from "./animation-picker";
import { AnimationPreview } from "./animation-preview";
import { PaywallModal } from "./paywall-modal";
import { Icon3DInline } from "@/components/ui/icon-3d";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { downloadFile } from "@/lib/download";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type StudioTab = "mascot" | "story" | "mix";
type MascotStep = "create" | "refine" | "animate";

interface AnimationItem {
  spriteBase64: string;
  animationBase64: string;
  action: string;
}

const STUDIO_TABS = [
  { key: "mascot" as StudioTab, label: "Mascot", icon: "artist-palette" as const, desc: "Create a single asset" },
  { key: "story" as StudioTab, label: "Story", icon: "clapper-board" as const, desc: "Generate 8 frames" },
  { key: "mix" as StudioTab, label: "Mix", icon: "sparkles" as const, desc: "Combine 2 images" },
];

const MASCOT_STEPS = [
  { key: "create" as MascotStep, label: "Create", num: 1 },
  { key: "refine" as MascotStep, label: "Refine", num: 2 },
  { key: "animate" as MascotStep, label: "Animate", num: 3 },
];

const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// ── Shared left-panel placeholder shown before any result exists ──────────────
function EmptyPreview({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border-4 border-dashed border-border bg-white/50 p-8 text-center">
      <Icon3DInline name={icon as any} size={48} className="opacity-40" />
      <div>
        <p className="text-sm font-black text-muted-foreground">{title}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Story left panel ──────────────────────────────────────────────────────────
function StoryPreview({ frames, loading }: { frames: string[]; loading: boolean }) {
  const [activeFrame, setActiveFrame] = useState(0);

  if (loading) return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border-4 border-dashed border-candy-blue/30 bg-candy-blue/5 p-8">
      <span className="text-4xl animate-spin">⏳</span>
      <p className="text-sm font-black text-candy-blue">Generating 8 frames…</p>
    </div>
  );

  if (frames.length === 0) return (
    <EmptyPreview icon="clapper-board" title="Your story will appear here"
      subtitle="Fill in the details on the right and hit Generate" />
  );

  const isStoryboard = frames.length === 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          {isStoryboard ? "Story · Complete Storyboard" : `Story · ${frames.length} Frames`}
        </p>
        <button onClick={() => frames.forEach((f, i) => setTimeout(() =>
          downloadFile(`data:image/png;base64,${f}`, isStoryboard ? "story_storyboard.png" : `story_frame_${i + 1}.png`), i * 200))}
          className="text-[10px] font-black uppercase text-candy-blue hover:underline">
          {isStoryboard ? "Download Storyboard" : "Download All"}
        </button>
      </div>

      <div className="relative w-full overflow-hidden rounded-3xl border-4 border-white bg-checkerboard shadow-xl">
        <img src={`data:image/png;base64,${frames[activeFrame]}`} alt={`Frame ${activeFrame + 1}`} className="w-full h-auto block" />
        {frames.length > 1 && (
          <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-black text-white backdrop-blur-md">
            Frame {activeFrame + 1} / {frames.length}
          </div>
        )}
        {frames.length > 1 && (<>
          <button onClick={() => setActiveFrame(i => Math.max(0, i - 1))} disabled={activeFrame === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center hover:bg-black/80 disabled:opacity-30">‹</button>
          <button onClick={() => setActiveFrame(i => Math.min(frames.length - 1, i + 1))} disabled={activeFrame === frames.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center hover:bg-black/80 disabled:opacity-30">›</button>
        </>)}
        <button onClick={() => downloadFile(`data:image/png;base64,${frames[activeFrame]}`, `story_frame_${activeFrame + 1}.png`)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-warm-gray shadow-lg backdrop-blur-sm hover:bg-white">
          <DownloadIcon /> {isStoryboard ? "Save" : "Save Frame"}
        </button>
      </div>

      {frames.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {frames.map((frame, idx) => (
            <button key={idx} onClick={() => setActiveFrame(idx)}
              className={`relative flex-shrink-0 h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${activeFrame === idx ? "border-candy-blue scale-110 shadow-md" : "border-border hover:border-candy-blue/40"}`}>
              <img src={`data:image/png;base64,${frame}`} alt={`Frame ${idx + 1}`} className="h-full w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-[8px] font-black text-white">{idx + 1}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mix left panel ────────────────────────────────────────────────────────────
function MixPreview({ result, loading }: { result: string | null; loading: boolean }) {
  if (loading) return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border-4 border-dashed border-candy-green/30 bg-candy-green/5 p-8">
      <span className="text-4xl animate-spin">⏳</span>
      <p className="text-sm font-black text-candy-green">Compositing your images…</p>
    </div>
  );

  if (!result) return (
    <EmptyPreview icon="sparkles" title="Your composite will appear here"
      subtitle="Upload 2 images and describe how to combine them" />
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Result</p>
        <button onClick={() => downloadFile(`data:image/png;base64,${result}`, "composite.png")}
          className="text-[10px] font-black uppercase text-candy-green hover:underline">Download</button>
      </div>
      <div className="relative w-full overflow-hidden rounded-3xl border-4 border-white bg-checkerboard shadow-xl">
        <img src={`data:image/png;base64,${result}`} alt="Composite result" className="w-full h-auto block" />
        <button onClick={() => downloadFile(`data:image/png;base64,${result}`, "composite.png")}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-warm-gray shadow-lg backdrop-blur-sm hover:bg-white">
          <DownloadIcon /> Save
        </button>
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
    imageSize: "1K" as "512px" | "1K" | "2K" | "4K",
    removeBackground: false,
  });

  // Story workflow
  const [storyFrames, setStoryFrames] = useState<string[]>([]);
  const [storyLoading, setStoryLoading] = useState(false);

  // Mix workflow
  const [mixResult, setMixResult] = useState<string | null>(null);
  const [mixLoading, setMixLoading] = useState(false);

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
    setStoryFrames([]);
    setMixResult(null);
    setMascotStep("refine");
  };

  const handleMascotUpdate = (imageBase64: string, newAnalysis?: string) => {
    setMascotBase64(imageBase64);
    setMascotImages([imageBase64]);
    if (newAnalysis) setAnalysis(newAnalysis);
    setAnimations([]);
    setStoryFrames([]);
    setMixResult(null);
  };

  const handleStartOver = () => {
    setPendingStep("create");
    setConfirmReset(true);
  };

  const confirmStepChange = () => {
    if (pendingStep === "create") {
      setMascotBase64(null); setMascotImages([]); setAnalysis(null);
      setAnimations([]);
      setStoryFrames([]);
      setMixResult(null);
      setMascotStep("create");
    } else if (pendingStep === "refine") {
      setAnimations([]);
      setStoryFrames([]);
      setMixResult(null);
      setMascotStep("refine");
    }
    setConfirmReset(false);
    setPendingStep(null);
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

  const canGoToStep = (step: MascotStep) => step === "create" || !!mascotBase64;

  // Shared props
  const sharedProps = { requireAuth, onApiError: handleApiError, onCreditsUpdate: handleCreditsUpdate };

  return (
    <div className="mx-auto max-w-6xl px-3 py-4 md:px-6 md:py-8 mb-16 md:mb-0">

      {/* Top-Level Tab Selector */}
      <div className="mb-6 grid grid-cols-3 gap-2 md:gap-3">
        {STUDIO_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-1 rounded-xl md:rounded-2xl border-2 p-2 md:p-3 transition-all duration-200 ${isActive
                ? "border-foreground bg-foreground text-white shadow-[3px_3px_0_#2d2420] md:shadow-[4px_4px_0_#2d2420] -translate-y-0.5"
                : "border-border bg-white text-muted-foreground hover:border-foreground/20"}`}>
              <Icon3DInline name={tab.icon} size={20} className="md:w-6 md:h-6" />
              <span className="text-[10px] md:text-sm font-black uppercase tracking-tight leading-none text-center">{tab.label}</span>
              <span className="hidden md:block text-[9px] font-semibold opacity-60 leading-none">{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content: Reordered for mobile: Form top, Preview bottom */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8">

        {/* ── RIGHT (now Top on mobile): Studio Panel ── */}
        <div className={`order-first lg:order-last flex flex-col ${activeTab !== "mascot" ? "w-full lg:max-w-2xl lg:ml-auto" : "h-full"}`}>
          <div className="rounded-3xl border-2 border-border bg-white/90 p-4 md:p-6 shadow-sm backdrop-blur-md flex-1 h-full flex flex-col">

            {/* MASCOT */}
            {activeTab === "mascot" && (
              <>
                <div className="mb-5 flex items-center justify-center">
                  <div className="flex items-center gap-1 rounded-2xl bg-white border-2 border-border p-1 shadow-sm">
                    {MASCOT_STEPS.map((step) => {
                      const isActive = mascotStep === step.key;
                      const isAccessible = canGoToStep(step.key);
                      return (
                        <button key={step.key} onClick={() => isAccessible && handleStepClick(step.key)}
                          disabled={!isAccessible}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${isActive
                            ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-md"
                            : isAccessible ? "text-muted-foreground hover:bg-muted" : "text-muted-foreground/30 cursor-not-allowed"}`}>
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${isActive ? "bg-white/20" : "bg-muted"}`}>
                            {step.num}
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
                    onMascotUpdate={handleMascotUpdate} onLoadingChange={setMascotLoading}
                    onDone={() => setMascotStep("animate")} {...sharedProps} />
                )}

                {mascotStep === "animate" && mascotBase64 && (
                  <div className="space-y-4 md:space-y-6">
                    <AnimationPicker mascotBase64={mascotBase64} description={analysis || undefined}
                      removeBackground={createOptions.removeBackground}
                      onAnimationGenerated={(anim) => setAnimations(prev => [...prev, anim])}
                      onLoadingChange={setMascotLoading} {...sharedProps} />
                    <AnimationPreview animations={animations} mascotBase64={mascotBase64} />
                  </div>
                )}
              </>
            )}

            {/* STORY */}
            {activeTab === "story" && (
              <StudioStory existingMascotBase64={mascotBase64} existingAnalysis={analysis}
                onFramesChange={(frames) => { setStoryFrames(frames); }}
                onLoadingChange={setStoryLoading}
                {...sharedProps} />
            )}

            {/* MIX */}
            {activeTab === "mix" && (
              <StudioMix existingMascotBase64={mascotBase64}
                onResultChange={setMixResult}
                onLoadingChange={setMixLoading}
                {...sharedProps} />
            )}
          </div>
        </div>

        {/* ── LEFT (now Bottom on mobile): Preview Panel ── */}
        <div className="order-last lg:order-first flex flex-col gap-3 md:gap-4">
          {activeTab === "mascot" && (
            <>
              <MascotPreview
                mascotBase64={mascotBase64}
                images={mascotImages}
                animations={animations}
                loading={mascotLoading && mascotStep !== "animate"}
                removeBackground={createOptions.removeBackground}
              />
              {mascotBase64 && mascotStep !== "create" && (
                <button onClick={handleStartOver}
                  className="self-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  ← Start over with a new mascot
                </button>
              )}
            </>
          )}
          {activeTab === "story" && (
            <StoryPreview frames={storyFrames} loading={storyLoading} />
          )}
          {activeTab === "mix" && (
            <MixPreview result={mixResult} loading={mixLoading} />
          )}
        </div>
      </div>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} type={paywallType}
        creditsRequired={paywallCreditsRequired} creditsRemaining={session?.user?.credits ?? 0} />
      <ConfirmDialog open={confirmReset} onOpenChange={(open) => { setConfirmReset(open); if (!open) setPendingStep(null); }}
        title={pendingStep === "create" ? "Start Over?" : "Clear Animations?"}
        description={pendingStep === "create" ? "Discard current mascot and all generated animations, stories, and mixes completely?" : "Going back to refine will discard your current animations and mode results because it modifies the mascot. Continue?"}
        confirmText={pendingStep === "create" ? "Start Over" : "Clear & Go Back"}
        variant="destructive" onConfirm={confirmStepChange} />
    </div>
  );
}
