"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
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
                <DialogContent className="rounded-[1.75rem] border border-foreground/[0.08] bg-white p-0 overflow-hidden sm:max-w-sm">
                    {/* Top accent */}
                    <div className="h-1 w-full bg-gradient-to-r from-candy-pink via-candy-orange to-candy-yellow" />

                    <div className="px-8 pt-7 pb-8 space-y-6">
                        {/* Icon + headline */}
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-foreground/[0.06]">
                                <Image src="/app-icon.png" alt="Mascot Maker" fill className="object-cover" />
                            </div>
                            <div className="space-y-1.5">
                                <h2 className="font-display text-2xl text-foreground tracking-tight leading-none">
                                    Join Mascot Maker
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Get{" "}
                                    <span className="font-black text-candy-pink">5 free credits</span>
                                    {" "}the moment you sign in. No card required.
                                </p>
                            </div>
                        </div>

                        {/* What you get */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { icon: "✨", label: "Create" },
                                { icon: "🌐", label: "Publish" },
                                { icon: "⬇", label: "Download" },
                            ].map(({ icon, label }) => (
                                <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-muted/60 border border-foreground/[0.05]">
                                    <span className="text-xl leading-none">{icon}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Google sign-in */}
                        <button
                            onClick={() => signIn("google")}
                            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-foreground/[0.10] bg-white px-5 py-3.5 text-sm font-bold text-foreground shadow-sm hover:shadow-md hover:border-foreground/20 active:scale-[0.98] transition-all duration-200"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
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
            <DialogContent className="rounded-[1.75rem] border border-foreground/[0.08] bg-white p-0 overflow-hidden sm:max-w-sm">
                {/* Top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-candy-pink via-candy-orange to-candy-yellow" />

                <div className="px-8 pt-7 pb-8 space-y-5">
                    {/* Headline */}
                    <div className="text-center space-y-1.5">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-candy-pink/10 mb-1">
                            <svg width="22" height="22" viewBox="0 0 11 14" fill="#ff6b9d" aria-hidden="true">
                                <path d="M6.5 0L0 8h4.5L3.5 14L11 5.5H6.5L8 0H6.5Z" />
                            </svg>
                        </div>
                        <h2 className="font-display text-2xl text-foreground tracking-tight leading-none">
                            Top up your credits
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            You need <span className="font-black text-foreground">{creditsRequired} credit</span> to unlock this mascot.
                            {typeof creditsRemaining === "number" && creditsRemaining > 0 && (
                                <> You have <span className="font-black">{creditsRemaining}</span> left.</>
                            )}
                        </p>
                    </div>

                    {/* Plans */}
                    <div className="space-y-2">
                        {PLANS.map((plan) => (
                            <button
                                key={plan.credits}
                                disabled={loading !== null}
                                onClick={() => handleBuyCredits(plan.variantId, plan.credits)}
                                className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 disabled:opacity-50 active:scale-[0.98] ${
                                    plan.popular
                                        ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-md"
                                        : "border border-foreground/[0.10] bg-white text-foreground hover:border-foreground/20 hover:shadow-sm"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {plan.popular && (
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                                            Best Value
                                        </span>
                                    )}
                                    <span className={plan.popular ? "text-white/90" : "text-foreground/60"}>
                                        {plan.credits} credits
                                    </span>
                                </div>
                                <span className={`font-display text-xl ${plan.popular ? "text-white" : "text-foreground"}`}>
                                    {loading === plan.credits ? "…" : plan.priceLabel}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Trust footer */}
                    <p className="text-center text-[11px] text-muted-foreground/50 font-medium">
                        Credits never expire · Secure checkout · Cancel anytime
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
