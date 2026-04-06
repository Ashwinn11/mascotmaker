"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Zap, CheckCircle } from "lucide-react";
import { PLANS } from "@/lib/pricing";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GalleryGrid } from "@/components/gallery-grid";
import { CreditCard, Palette, ShoppingBag } from "lucide-react";

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
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const [confirmPlanChange, setConfirmPlanChange] = useState<{ variantId: string; credits: number } | null>(null);
    const [activeTab, setActiveTab] = useState<"billing" | "creations" | "purchased">("billing");

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
        if (subscription?.status === "active" && !confirmPlanChange) {
            const targetPlan = PLANS.find(p => p.variantId === variantId);
            if (!targetPlan) return;
            setConfirmPlanChange({ variantId, credits });
            return;
        }

        setPurchaseLoading(credits);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ variantId }),
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
            <div className="min-h-[calc(100vh-5rem)] bg-dotted flex flex-col items-center justify-center gap-6">
                <Image src="/app-icon.png" alt="Mascot Maker" width={80} height={80} className="rounded-3xl shadow-lg" />
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
                        <CheckCircle size={16} className="text-candy-green" />
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
                <div className="mx-auto max-w-4xl px-4 md:px-6 pt-8 md:pt-12 pb-6 md:pb-8 animate-pop-in stagger-1">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                width={80}
                                height={80}
                                className="rounded-2xl shadow-lg border-2 border-white w-16 h-16 md:w-20 md:h-20"
                            />
                        ) : (
                            <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-candy-pink to-candy-orange text-xl md:text-2xl font-bold text-white shadow-lg">
                                {session.user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div>
                            <h1 className="font-display text-2xl md:text-3xl text-foreground">
                                {session.user.name}
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground">{session.user.email}</p>
                        </div>
                    </div>
                </div>
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-candy-pink/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-4xl px-4 md:px-6 py-4">
                <div className="flex p-1 bg-muted rounded-2xl border-2 border-border/50">
                    <button
                        onClick={() => setActiveTab("billing")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === "billing" ? "bg-white text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground/60"
                        }`}
                    >
                        <CreditCard size={14} /> Billing
                    </button>
                    <button
                        onClick={() => setActiveTab("creations")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === "creations" ? "bg-white text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground/60"
                        }`}
                    >
                        <Palette size={14} /> My Creations
                    </button>
                    <button
                        onClick={() => setActiveTab("purchased")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === "purchased" ? "bg-white text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground/60"
                        }`}
                    >
                        <ShoppingBag size={14} /> Purchased
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
                {activeTab === "billing" ? (
                    <>
                        {/* Current Balance + Subscription */}
                        <div className="rounded-3xl border-2 border-border bg-white p-5 md:p-6 shadow-sm overflow-hidden relative animate-pop-in stagger-2">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                <h2 className="font-display text-xl md:text-2xl text-foreground">Current Balance</h2>
                                <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-2 md:px-5 md:py-3 border-2 border-border/50">
                                    <Zap size={20} className="text-candy-orange fill-candy-orange" />
                                    <span className="font-display text-3xl md:text-4xl text-foreground">{credits}</span>
                                </div>
                            </div>

                            {/* ... (Existing subscription and planes logic) ... */}
                            {subLoading ? (
                                <div className="h-20 animate-pulse rounded-xl bg-muted mb-6" />
                            ) : subscription ? (
                                <div className="rounded-2xl border-2 border-border p-4 md:p-5 mb-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                            <h3 className="font-display text-base md:text-lg text-foreground">
                                                {subscription.planName} Plan
                                            </h3>
                                            {statusBadge(subscription.status)}
                                        </div>
                                        <span className="text-sm font-bold text-muted-foreground">
                                            {subscription.priceLabel}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                                        <p className="text-xs md:text-sm text-muted-foreground">
                                            {subscription.status === "cancelled" && subscription.cancelAt
                                                ? `Access until ${new Date(subscription.cancelAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                                                : subscription.currentPeriodEnd
                                                    ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                                                    : `${subscription.credits} credits/mo`}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={handleManageBilling}
                                                className="flex-1 sm:flex-none rounded-xl border-2 border-border bg-white px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-bold text-foreground hover:border-candy-pink/30 transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                Manage
                                            </button>
                                            {subscription.status === "active" && (
                                                <button
                                                    onClick={() => setConfirmCancelOpen(true)}
                                                    disabled={cancelLoading}
                                                    className="flex-1 sm:flex-none rounded-xl border-2 border-red-200 bg-white px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-bold text-red-500 hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
                                                >
                                                    {cancelLoading ? "..." : "Cancel"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

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
                                            <span className="text-sm font-bold opacity-80 mb-1 leading-none">{plan.credits} Credits</span>
                                            <span className="font-display text-3xl mb-3 leading-none">{plan.priceLabel}</span>
                                            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                                                {purchaseLoading === plan.credits ? "Processing..." : "Buy Now"}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Activity history */}
                        <div className="rounded-3xl border-2 border-border bg-white p-6 shadow-sm animate-pop-in stagger-3">
                            <h2 className="font-display text-xl text-foreground mb-4">Activity history</h2>
                            {txLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
                                    ))}
                                </div>
                            ) : transactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No activity yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{tx.description}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-bold ${tx.amount < 0 ? "text-red-500" : "text-candy-green"}`}>{tx.amount > 0 ? "+" : ""}{tx.amount}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : activeTab === "creations" ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <GalleryGrid currentUserId={session.user.id} initialScope="mine" variant="compact" hideTabs hideSearch />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <GalleryGrid currentUserId={session.user.id} initialScope="purchased" variant="compact" hideTabs hideSearch />
                    </div>
                )}
                <ConfirmDialog
                    open={!!confirmPlanChange}
                    onOpenChange={(open) => !open && setConfirmPlanChange(null)}
                    title="Change Subscription Plan?"
                    description={
                        confirmPlanChange
                            ? `Switch to ${PLANS.find(p => p.variantId === confirmPlanChange.variantId)?.name} plan (${PLANS.find(p => p.variantId === confirmPlanChange.variantId)?.credits} credits/mo at ${PLANS.find(p => p.variantId === confirmPlanChange.variantId)?.priceLabel})? You'll be charged a prorated amount immediately.`
                            : ""
                    }
                    confirmText="Switch Plan"
                    onConfirm={() => {
                        if (confirmPlanChange) {
                            const { variantId, credits } = confirmPlanChange;
                            setConfirmPlanChange(null);
                            handleBuyCredits(variantId, credits);
                        }
                    }}
                />

                <ConfirmDialog
                    open={confirmCancelOpen}
                    onOpenChange={setConfirmCancelOpen}
                    title="Cancel Subscription?"
                    description="Are you sure you want to cancel your subscription? You'll keep access until the end of your billing period."
                    confirmText="Cancel Subscription"
                    variant="destructive"
                    loading={cancelLoading}
                    onConfirm={async () => {
                        await handleCancel();
                        setConfirmCancelOpen(false);
                    }}
                />
            </div>
        </div>
    );
}
