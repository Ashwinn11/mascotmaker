"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Icon3D } from "@/components/ui/icon-3d";
import { PLANS } from "@/lib/pricing";

interface Transaction {
    id: number;
    type: string;
    amount: number;
    balance_after: number;
    description: string | null;
    created_at: string;
}

interface SubscriptionInfo {
    id: number;
    lsSubscriptionId: string;
    planName: string;
    credits: number;
    priceLabel: string;
    status: string;
    currentPeriodEnd: string | null;
    cancelAt: string | null;
    customerPortalUrl: string | null;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [txLoading, setTxLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [subLoading, setSubLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("success") === "true") {
                setShowSuccess(true);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    useEffect(() => {
        if (session?.user?.id) {
            fetch("/api/profile")
                .then((res) => res.json())
                .then((data) => {
                    setTransactions(data.transactions || []);
                })
                .catch(() => { })
                .finally(() => setTxLoading(false));

            fetch("/api/subscription")
                .then((res) => res.json())
                .then((data) => {
                    setSubscription(data.subscription || null);
                })
                .catch(() => { })
                .finally(() => setSubLoading(false));
        }
    }, [session]);

    const handleBuyCredits = async (variantId: string, credits: number) => {
        // Confirm plan change if user already has an active subscription
        if (subscription?.status === "active") {
            const targetPlan = PLANS.find(p => p.variantId === variantId);
            if (!targetPlan) return;
            const confirmed = confirm(
                `Switch to ${targetPlan.name} plan (${targetPlan.credits} credits/mo at ${targetPlan.priceLabel})? You'll be charged a prorated amount immediately.`
            );
            if (!confirmed) return;
        }

        setPurchaseLoading(credits);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ variantId, credits }),
            });
            const data = await res.json();
            if (data.updated) {
                toast.success("Plan updated!");
                // Refresh subscription info
                const subRes = await fetch("/api/subscription");
                const subData = await subRes.json();
                setSubscription(subData.subscription || null);
            } else if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to create checkout");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setPurchaseLoading(null);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel your subscription? You'll keep access until the end of your billing period.")) return;
        setCancelLoading(true);
        try {
            const res = await fetch("/api/subscription/cancel", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                toast.success("Subscription cancelled. You'll keep access until the end of your billing period.");
                const subRes = await fetch("/api/subscription");
                const subData = await subRes.json();
                setSubscription(subData.subscription || null);
            } else {
                toast.error(data.error || "Failed to cancel");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setCancelLoading(false);
        }
    };

    const handleManageBilling = async () => {
        try {
            const res = await fetch("/api/subscription/portal");
            const data = await res.json();
            if (data.url) {
                window.open(data.url, "_blank");
            } else {
                toast.error("Could not open billing portal");
            }
        } catch {
            toast.error("An error occurred.");
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-dotted flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-candy-pink/20 border-t-candy-pink" />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-dotted flex flex-col items-center justify-center gap-4">
                <Icon3D name="warning" size="2xl" animated />
                <h1 className="font-display text-2xl text-foreground">Sign in to view your profile</h1>
            </div>
        );
    }

    const credits = session.user.credits ?? 0;

    const statusBadge = (s: string) => {
        const styles: Record<string, string> = {
            active: "bg-candy-green/10 text-candy-green border-candy-green/20",
            cancelled: "bg-amber-100 text-amber-700 border-amber-200",
            past_due: "bg-red-100 text-red-600 border-red-200",
            paused: "bg-muted text-muted-foreground border-border",
            expired: "bg-muted text-muted-foreground border-border",
        };
        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${styles[s] ?? styles.expired}`}>
                {s.replace("_", " ")}
            </span>
        );
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-dotted">
            {showSuccess && (
                <div className="bg-candy-green/10 border-b border-candy-green/20 py-3 text-center transition-all animate-in fade-in slide-in-from-top-4">
                    <p className="text-sm font-bold text-candy-green flex items-center justify-center gap-2">
                        <Icon3D name="party-popper" size="sm" />
                        Purchase successful! Your credits have been updated.
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="ml-4 rounded-full hover:bg-candy-green/20 p-1"
                        >
                            ✕
                        </button>
                    </p>
                </div>
            )}
            <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-candy-purple/5 via-candy-pink/5 to-transparent">
                <div className="mx-auto max-w-4xl px-6 pt-12 pb-8">
                    <div className="flex items-center gap-6">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                width={80}
                                height={80}
                                className="rounded-2xl shadow-lg border-2 border-white"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-candy-pink to-candy-orange text-2xl font-bold text-white shadow-lg">
                                {session.user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div>
                            <h1 className="font-display text-3xl text-foreground">
                                {session.user.name}
                            </h1>
                            <p className="text-muted-foreground">{session.user.email}</p>
                        </div>
                    </div>
                </div>
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-candy-pink/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
                {/* Current Balance + Subscription */}
                <div className="rounded-3xl border-2 border-border bg-white p-6 shadow-sm overflow-hidden relative">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-2xl text-foreground">Current Balance</h2>
                        <div className="flex items-center gap-3 rounded-2xl bg-muted px-5 py-3 border-2 border-border/50">
                            <Icon3D name="high-voltage" size="sm" />
                            <span className="font-display text-4xl text-foreground">{credits}</span>
                        </div>
                    </div>

                    {/* Subscription Status */}
                    {subLoading ? (
                        <div className="h-20 animate-pulse rounded-xl bg-muted mb-6" />
                    ) : subscription ? (
                        <div className="rounded-2xl border-2 border-border p-5 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-display text-lg text-foreground">
                                        {subscription.planName} Plan
                                    </h3>
                                    {statusBadge(subscription.status)}
                                </div>
                                <span className="text-sm font-bold text-muted-foreground">
                                    {subscription.priceLabel}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {subscription.status === "cancelled" && subscription.cancelAt
                                        ? `Access until ${new Date(subscription.cancelAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                                        : subscription.currentPeriodEnd
                                            ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                                            : `${subscription.credits} credits/mo`}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleManageBilling}
                                        className="rounded-xl border-2 border-border bg-white px-4 py-2 text-sm font-bold text-foreground hover:border-candy-pink/30 transition-all active:scale-95"
                                    >
                                        Manage Billing
                                    </button>
                                    {subscription.status === "active" && (
                                        <button
                                            onClick={handleCancel}
                                            disabled={cancelLoading}
                                            className="rounded-xl border-2 border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {cancelLoading ? "Cancelling..." : "Cancel"}
                                        </button>
                                    )}
                                    {subscription.status === "cancelled" && (
                                        <button
                                            onClick={() => handleBuyCredits(
                                                PLANS.find(p => p.name === subscription.planName)?.variantId ?? PLANS[0].variantId,
                                                PLANS.find(p => p.name === subscription.planName)?.credits ?? PLANS[0].credits
                                            )}
                                            className="rounded-xl bg-gradient-to-r from-candy-pink to-candy-orange px-4 py-2 text-sm font-bold text-white shadow-md transition-all active:scale-95"
                                        >
                                            Resubscribe
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Buy / Change Plan */}
                    <div className="space-y-4">
                        <h3 className="font-display text-lg text-foreground">
                            {subscription?.status === "active" ? "Change Plan" : "Buy More Credits"}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {PLANS.map((plan) => (
                                <button
                                    key={plan.credits}
                                    disabled={purchaseLoading !== null || (subscription?.status === "active" && subscription?.planName === plan.name)}
                                    onClick={() => handleBuyCredits(plan.variantId, plan.credits)}
                                    className={`relative flex flex-col items-center justify-center rounded-2xl p-5 transition-all active:scale-95 disabled:opacity-50 ${plan.popular
                                        ? "bg-gradient-to-br from-candy-pink to-candy-orange text-white shadow-lg ring-4 ring-candy-pink/20 border-0"
                                        : "bg-white border-2 border-border hover:border-candy-pink/50 text-foreground"
                                        }`}
                                >
                                    {subscription?.status === "active" && subscription?.planName === plan.name ? (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-candy-green text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border-2 border-white">
                                            Current
                                        </span>
                                    ) : plan.popular ? (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border-2 border-white">
                                            Most Popular
                                        </span>
                                    ) : null}
                                    <span className="text-sm font-bold opacity-80 mb-1 leading-none">{plan.credits} Credits</span>
                                    <span className="font-display text-3xl mb-3 leading-none">{plan.priceLabel}</span>
                                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                                        {purchaseLoading === plan.credits ? "Processing..." :
                                            subscription?.status === "active" && subscription?.planName === plan.name ? "Current Plan" :
                                                subscription?.status === "active" ? "Switch Plan" : "Buy Now"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Usage history */}
                <div className="rounded-3xl border-2 border-border bg-white p-6 shadow-sm">
                    <h2 className="font-display text-xl text-foreground mb-4">Activity history</h2>
                    {txLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-sm">No usage yet. Create your first mascot!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {tx.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(tx.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-sm font-bold ${tx.amount < 0 ? "text-red-500" : "text-candy-green"
                                                }`}
                                        >
                                            {tx.amount > 0 ? "+" : ""}
                                            {tx.amount}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            bal: {tx.balance_after}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
