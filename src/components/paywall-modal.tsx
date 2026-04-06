"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Sparkles, Globe, ArrowDownToLine } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { PLANS } from "@/lib/pricing";

interface PaywallModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: "auth" | "credits";
    creditsRequired?: number;
    creditsRemaining?: number;
}

export function PaywallModal({
    open,
    onOpenChange,
    type,
    creditsRequired,
    creditsRemaining,
}: PaywallModalProps) {
    const [loading, setLoading] = useState<number | null>(null);

    const handleBuyCredits = async (variantId: string, credits: number) => {
        setLoading(credits);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ variantId, credits }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to create checkout");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    /* ── Step 1 Gate: Not signed in ── */
    if (type === "auth") {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="rounded-[2rem] border border-white/10 bg-[#141210] p-0 overflow-hidden sm:max-w-sm shadow-2xl">
                    {/* Top accent */}
                    <div className="h-1.5 w-full bg-candy-pink shadow-[0_0_15px_rgba(255,77,28,0.5)]" />

                    <div className="px-8 pt-8 pb-10 space-y-8">
                        {/* Icon + headline */}
                        <div className="flex flex-col items-center text-center gap-5">
                            <div className="relative w-16 h-16 rounded-[1.25rem] overflow-hidden shadow-xl border border-white/10 bg-[#1c1916]">
                                <Image src="/app-icon.png" alt="Mascot Maker" fill className="object-cover" />
                            </div>
                            <div className="space-y-2">
                                <DialogTitle className="font-display text-3xl text-white tracking-tight leading-none">
                                    Join Mascot Maker
                                </DialogTitle>
                                <DialogDescription className="text-sm text-white/50 leading-relaxed font-medium">
                                    Get{" "}
                                    <span className="font-black text-candy-pink">5 free credits</span>
                                    {" "}the moment you sign in. No card required.
                                </DialogDescription>
                            </div>
                        </div>

                        {/* What you get */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Sparkles, label: "Create", color: "text-candy-pink", bg: "bg-candy-pink/10", border: "border-candy-pink/20" },
                                { icon: Globe, label: "Publish", color: "text-candy-blue", bg: "bg-candy-blue/10", border: "border-candy-blue/20" },
                                { icon: ArrowDownToLine, label: "Download", color: "text-[#5cd85c]", bg: "bg-[#5cd85c]/10", border: "border-[#5cd85c]/20" },
                            ].map(({ icon: Icon, label, color, bg, border }) => (
                                <div key={label} className={`group/item flex flex-col items-center gap-2 py-5 rounded-2xl ${bg} border ${border} hover:scale-[1.02] hover:brightness-110 transition-all duration-300 shadow-lg relative overflow-hidden`}>
                                    {/* Subtle animated shine */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    
                                    <Icon className={`w-6 h-6 ${color} transition-transform duration-300 group-hover/item:rotate-12`} strokeWidth={2.5} />
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${color} transition-colors uppercase`}>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Google sign-in */}
                        <button
                            onClick={() => signIn("google")}
                            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#0c0a09] px-5 py-4 text-sm font-black tracking-wide text-white shadow-lg hover:bg-white/5 hover:border-white/20 active:scale-[0.98] transition-all duration-300"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    /* ── Step 4 Gate: Insufficient credits ── */
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[2rem] border border-white/10 bg-[#141210] p-0 overflow-hidden sm:max-w-sm shadow-2xl">
                {/* Top accent */}
                <div className="h-1.5 w-full bg-candy-pink shadow-[0_0_15px_rgba(255,77,28,0.5)]" />

                <div className="px-8 pt-8 pb-10 space-y-6">
                    {/* Headline */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-[1.25rem] bg-candy-pink/10 border border-candy-pink/20 mb-2 shadow-inner">
                                <svg width="24" height="24" viewBox="0 0 11 14" fill="#FF4D1C" aria-hidden="true" className="drop-shadow-[0_0_8px_rgba(255,77,28,0.5)]">
                                    <path d="M6.5 0L0 8h4.5L3.5 14L11 5.5H6.5L8 0H6.5Z" />
                                </svg>
                            </div>
                            <DialogTitle className="font-display text-3xl text-white tracking-tight leading-none">
                                Top up your studio
                            </DialogTitle>
                            <DialogDescription className="text-sm text-white/50 leading-relaxed font-medium">
                                You need <span className="font-black text-white">{creditsRequired} credit</span> to unlock this mascot.
                                {typeof creditsRemaining === "number" && creditsRemaining > 0 && (
                                    <> You have <span className="font-black text-white">{creditsRemaining}</span> left.</>
                                )}
                            </DialogDescription>
                        </div>

                    {/* Plans */}
                    <div className="space-y-3 pt-2">
                        {PLANS.map((plan) => (
                            <button
                                key={plan.credits}
                                disabled={loading !== null}
                                onClick={() => handleBuyCredits(plan.variantId, plan.credits)}
                                className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 disabled:opacity-50 active:scale-[0.98] ${
                                    plan.popular
                                        ? "bg-candy-pink text-white shadow-glow-coral hover:brightness-110"
                                        : "border border-white/5 bg-[#1c1916] text-white hover:border-white/20 hover:bg-white/5"
                                }`}
                            >
                                <div className="flex flex-col items-start gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-black text-lg ${plan.popular ? "text-[#0c0a09]" : "text-white"}`}>
                                            {plan.credits} credits
                                        </span>
                                        {plan.popular && (
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-[#0c0a09]/20 px-2 py-0.5 rounded-full text-[#0c0a09]">
                                                Best Value
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`font-display text-2xl tracking-tight ${plan.popular ? "text-white" : "text-white/80"}`}>
                                    {loading === plan.credits ? "…" : plan.priceLabel}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Trust footer */}
                    <div className="pt-2">
                        <p className="text-center text-[10px] uppercase font-black tracking-widest text-white/30">
                            Credits never expire • Secure checkout
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
