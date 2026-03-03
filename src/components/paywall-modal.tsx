"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Icon3D } from "@/components/ui/icon-3d";
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
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    if (type === "auth") {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="rounded-3xl border-2 border-border sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl text-center">
                            Sign in to create
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Join to generate and animate your mascot.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-6 py-6">
                        <Icon3D name="warning" size="2xl" animated />
                        <button
                            onClick={() => signIn("google")}
                            className="flex items-center gap-3 rounded-2xl border-2 border-border bg-white px-6 py-3.5 text-base font-bold text-foreground shadow-sm transition-all hover:shadow-md hover:border-candy-pink/30 active:scale-[0.98]"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                        <p className="text-xs text-muted-foreground text-center max-w-sm">
                            Free account includes 25 credits. No card required.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-3xl border-2 border-border sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-center">
                        Out of credits
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Need {creditsRequired} credits ({creditsRemaining} left).
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6 py-6">
                    <Icon3D name="warning" size="2xl" animated />
                    <div className="w-full rounded-2xl border-2 border-border p-5">
                        <h3 className="font-display text-lg text-foreground mb-3 text-center">
                            Get More Credits
                        </h3>
                        <div className="space-y-2">
                            {PLANS.map((plan) => (
                                <button
                                    key={plan.credits}
                                    disabled={loading !== null}
                                    onClick={() => handleBuyCredits(plan.variantId, plan.credits)}
                                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all disabled:opacity-50 ${plan.popular
                                        ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-md active:scale-95"
                                        : "border-2 border-border bg-white text-foreground hover:border-candy-pink/30 active:scale-95"
                                        }`}
                                >
                                    <span>{plan.credits} credits</span>
                                    <span>{loading === plan.credits ? "Loading..." : plan.priceLabel}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
