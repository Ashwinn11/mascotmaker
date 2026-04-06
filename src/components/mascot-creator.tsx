"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { StudioMascot } from "./studio-mascot";
import { MascotPreview } from "./mascot-preview";
import { ChatRefiner } from "./chat-refiner";
import { AnimationPicker } from "./animation-picker";
import { PaywallModal } from "./paywall-modal";
import { Icon3DInline } from "@/components/ui/icon-3d";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

type StudioTab = "mascot";
type MascotStep = "create" | "refine" | "animate";

interface AnimationItem {
  spriteBase64: string;
  animationBase64: string;
  action: string;
}

const ALL_MASCOT_STEPS = [
  { key: "create" as MascotStep, label: "Create", num: 1 },
  { key: "refine" as MascotStep, label: "Refine", num: 2 },
  { key: "animate" as MascotStep, label: "Action Set", num: 3 },
];

export function MascotCreator() {
  const { data: session, status, update: updateSession } = useSession();
  const searchParams = useSearchParams();

  const [activeTab] = useState<StudioTab>("mascot");

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
    if (targetStep === "create" && mascotBase64) {
      setPendingStep("create");
      setConfirmReset(true);
      return;
    }
    if (targetStep === "refine" && mascotStep === "animate" && animations.length > 0) {
      setPendingStep("refine");
      setConfirmReset(true);
      return;
    }
    setMascotStep(targetStep);
  };

  const sharedProps = { requireAuth, onApiError: handleApiError, onCreditsUpdate: handleCreditsUpdate };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8 md:py-16 mb-24 md:mb-0">
      <div className="flex flex-col items-center gap-12">
        
        {/* ── Studio Stepper: Clean Floating Bar ── */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 rounded-full bg-[#141210]/80 border border-white/10 p-1.5 shadow-2xl backdrop-blur-2xl z-40 sticky top-24"
        >
          {getCurrentSteps().map((step, idx) => {
            const isActive = mascotStep === step.key;
            const isAccessible = canGoToStep(step.key);
            return (
              <button 
                key={step.key} 
                onClick={() => isAccessible && handleStepClick(step.key)}
                disabled={!isAccessible}
                className={`relative flex items-center gap-3 rounded-full px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden ${
                  isActive ? "text-white" : isAccessible ? "text-white/40 hover:text-white" : "text-white/10 cursor-not-allowed"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeStep"
                    className="absolute inset-0 bg-candy-pink shadow-[0_0_25px_rgba(255,77,28,0.5)] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] border ${isActive ? "border-white/30 bg-white/10" : "border-white/10"}`}>
                  {idx + 1}
                </span>
                {step.label}
              </button>
            );
          })}
        </motion.div>

        {/* ── Main Workspace Grid: Adobe Layout ── */}
        <div className="w-full grid lg:grid-cols-[1fr_420px] gap-12 items-start">
          
          {/* ── Left Side: The Canvas (Preview) ── */}
          <div className="w-full space-y-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={mascotStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
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
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {mascotBase64 && mascotStep !== "create" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-center"
                >
                  <button onClick={handleStartOver}
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-candy-pink transition-all duration-300 bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-candy-pink/30 shadow-lg">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Start over with a new mascot
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right Side: Obsidian Studio Deck (Subtle Clean) ── */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full lg:sticky lg:top-24"
          >
            <div className="rounded-[2.5rem] border border-white/[0.04] bg-[#141210] p-7 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col min-h-[600px] ring-1 ring-white/[0.02]">
              {/* Tool Accent */}
              <div className="absolute top-6 right-8 text-[9px] font-black text-white/10 uppercase tracking-[0.4em] pointer-events-none select-none italic">Studio Obsidian v2.5</div>
              
              <div className="mb-5 pb-5 border-b border-white/[0.04] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">Asset Creator</p>
                  <h2 className="text-xl font-black text-white tracking-tight italic uppercase">Creation Suite</h2>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                  <Sparkles size={16} className="text-[#F5C842]" />
                </div>
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={mascotStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
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
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Sub-panel Info */}
            <div className="mt-4 px-6 py-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#5cd85c] animate-pulse" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Engine Optimized</span>
              </div>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest uppercase">ID: 02-2026-STUDIO</span>
            </div>
          </motion.div>

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
