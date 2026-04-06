"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CheckCircle, CreditCard, Palette, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { PLANS } from "@/lib/pricing";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GalleryGrid } from "@/components/gallery-grid";

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
    const [howOpen, setHowOpen] = useState(false);

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
                toast.success("Subscription cancelled. Access continues until end of period.");
                const subRes = await fetch("/api/subscription");
                const subData = await subRes.json();
                setSubscription(subData.subscription || null);
            } else {
                toast.error(data.error || "Failed to cancel");
            }
        } catch {
            toast.error("An error occurred.");
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
            <div className="min-h-[calc(100vh-4rem)] bg-dotted flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-candy-pink/20 border-t-candy-pink" />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-dotted flex flex-col items-center justify-center gap-5">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-foreground/[0.08]">
                    <Image src="/app-icon.png" alt="Mascot Maker" fill className="object-cover" />
                </div>
                <h1 className="font-display text-2xl text-foreground text-center">Sign in to view your profile</h1>
            </div>
        );
    }

    const credits = session.user.credits ?? 0;
    const isLow = credits <= 3;

    const statusBadge = (s: string) => {
        const styles: Record<string, string> = {
            active: "bg-candy-green/10 text-candy-green border-candy-green/20",
            cancelled: "bg-amber-50 text-amber-600 border-amber-200",
            past_due: "bg-red-50 text-red-500 border-red-200",
            paused: "bg-muted text-muted-foreground border-border",
            expired: "bg-muted text-muted-foreground border-border",
        };
        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${styles[s] ?? styles.expired}`}>
                {s.replace("_", " ")}
            </span>
        );
    };

    const tabs: { id: "billing" | "creations" | "purchased"; icon: React.ReactNode; label: string; sublabel: string }[] = [
        { id: "billing", icon: <CreditCard size={14} />, label: "Billing", sublabel: "Credits & plans" },
        { id: "creations", icon: <Palette size={14} />, label: "My Studio", sublabel: "Your creations" },
        { id: "purchased", icon: <ShoppingBag size={14} />, label: "My Collection", sublabel: "Lifetime access" },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-dotted">
            {/* Success banner */}
            {showSuccess && (
                <div className="bg-candy-green/10 border-b border-candy-green/15 py-3 text-center animate-slide-up">
                    <p className="text-sm font-bold text-candy-green flex items-center justify-center gap-2">
                        <CheckCircle size={15} />
                        Purchase successful! Your credits have been added.
                        <button onClick={() => setShowSuccess(false)} className="ml-3 rounded-full hover:bg-candy-green/15 p-1 leading-none">
                            ✕
                        </button>
                    </p>
                </div>
            )}

            {/* ── Profile header ── */}
            <div className="relative overflow-hidden border-b border-foreground/[0.06] bg-gradient-to-b from-candy-pink/[0.04] to-transparent">
                <div className="mx-auto max-w-3xl px-5 md:px-6 pt-8 pb-6 animate-pop-in">
                    <div className="flex items-center gap-4">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                width={56}
                                height={56}
                                className="rounded-xl shadow-sm border border-foreground/[0.08] w-12 h-12 md:w-14 md:h-14 flex-shrink-0"
                            />
                        ) : (
                            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-candy-pink to-candy-orange text-xl font-bold text-white shadow-sm flex-shrink-0">
                                {session.user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div>
                            <h1 className="font-display text-xl md:text-2xl text-foreground leading-tight">
                                {session.user.name}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">{session.user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="mx-auto max-w-3xl px-5 md:px-6 pt-4">
                <div className="flex p-1 bg-foreground/[0.04] rounded-2xl border border-foreground/[0.06]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center py-2.5 px-2 rounded-xl transition-all duration-200 ${
                                activeTab === tab.id
                                    ? "bg-white text-foreground shadow-sm"
                                    : "text-foreground/40 hover:text-foreground/60"
                            }`}
                        >
                            <div className="flex items-center gap-1.5">
                                {tab.icon}
                                <span className="text-[11px] font-black uppercase tracking-wider hidden sm:inline">{tab.label}</span>
                                <span className="text-[11px] font-black uppercase tracking-wider sm:hidden">{tab.label.split(" ")[0]}</span>
                            </div>
                            <span className="text-[9px] font-semibold text-foreground/30 tracking-wider mt-0.5 hidden md:inline">
                                {tab.sublabel}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab content ── */}
            <div className="mx-auto max-w-3xl px-5 md:px-6 py-6 space-y-5">

                {/* ── BILLING tab ── */}
                {activeTab === "billing" && (
                    <div className="space-y-5 animate-slide-up">

                        {/* Credit balance card */}
                        <div className="rounded-2xl border border-foreground/[0.08] bg-white overflow-hidden">
                            <div className="px-6 py-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Credit Balance</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-display text-5xl text-foreground leading-none">{credits}</span>
                                        <span className="text-sm font-semibold text-muted-foreground">credits</span>
                                    </div>
                                    {isLow && credits > 0 && (
                                        <p className="text-[11px] font-bold text-amber-500 mt-1.5">Running low — top up to keep creating</p>
                                    )}
                                    {credits === 0 && (
                                        <p className="text-[11px] font-bold text-red-500 mt-1.5">No credits — add some to continue</p>
                                    )}
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-candy-pink/10 flex items-center justify-center flex-shrink-0">
                                    <svg width="24" height="30" viewBox="0 0 11 14" fill="#ff6b9d" aria-hidden="true">
                                        <path d="M6.5 0L0 8h4.5L3.5 14L11 5.5H6.5L8 0H6.5Z" />
                                    </svg>
                                </div>
                            </div>

                            {/* "How credits work" collapsible explainer */}
                            <div className="border-t border-foreground/[0.06]">
                                <button
                                    onClick={() => setHowOpen(!howOpen)}
                                    className="w-full flex items-center justify-between px-6 py-3 text-[11px] font-bold text-foreground/40 hover:text-foreground/60 transition-colors"
                                >
                                    <span>How credits work</span>
                                    {howOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                {howOpen && (
                                    <div className="px-6 pb-5 pt-1 space-y-2 animate-slide-up">
                                        {[
                                            { step: "1", label: "Create", desc: "Each mascot, logo, sticker pack, or background removal costs 1 credit." },
                                            { step: "2", label: "Publish", desc: "Mint your creation to the Community Showcase. Others can discover it." },
                                            { step: "3", label: "Others buy", desc: "A visitor unlocks your mascot for 1 credit. You retain full IP ownership." },
                                        ].map(({ step, label, desc }) => (
                                            <div key={step} className="flex gap-3">
                                                <div className="w-5 h-5 rounded-full bg-candy-pink/10 text-candy-pink text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    {step}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-foreground">{label}</p>
                                                    <p className="text-[11px] text-foreground/40 leading-relaxed">{desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Subscription status */}
                        {subLoading ? (
                            <div className="h-16 animate-pulse rounded-2xl bg-foreground/[0.04]" />
                        ) : subscription ? (
                            <div className="rounded-2xl border border-foreground/[0.08] bg-white px-5 py-4">
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-display text-base text-foreground">{subscription.planName} Plan</h3>
                                        {statusBadge(subscription.status)}
                                    </div>
                                    <span className="text-sm font-bold text-muted-foreground">{subscription.priceLabel}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-2">
                                    {subscription.status === "cancelled" && subscription.cancelAt
                                        ? `Access until ${new Date(subscription.cancelAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                                        : subscription.currentPeriodEnd
                                            ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                                            : `${subscription.credits} credits/mo`}
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={handleManageBilling}
                                        className="flex-1 sm:flex-none rounded-xl border border-foreground/[0.10] bg-white px-4 py-2 text-[11px] font-bold text-foreground hover:border-foreground/20 transition-all"
                                    >
                                        Manage Billing
                                    </button>
                                    {subscription.status === "active" && (
                                        <button
                                            onClick={() => setConfirmCancelOpen(true)}
                                            disabled={cancelLoading}
                                            className="flex-1 sm:flex-none rounded-xl border border-red-200 bg-white px-4 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                                        >
                                            {cancelLoading ? "Cancelling…" : "Cancel Plan"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {/* Plans */}
                        <div className="rounded-2xl border border-foreground/[0.08] bg-white px-5 py-5">
                            <h3 className="font-display text-base text-foreground mb-4">
                                {subscription?.status === "active" ? "Change Plan" : "Get More Credits"}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {PLANS.map((plan) => (
                                    <button
                                        key={plan.credits}
                                        disabled={purchaseLoading !== null || (subscription?.status === "active" && subscription?.planName === plan.name)}
                                        onClick={() => handleBuyCredits(plan.variantId, plan.credits)}
                                        className={`relative flex flex-col items-center rounded-2xl p-5 transition-all active:scale-95 disabled:opacity-50 ${
                                            plan.popular
                                                ? "bg-gradient-to-br from-candy-pink to-candy-orange text-white shadow-md"
                                                : "bg-white border border-foreground/[0.10] hover:border-foreground/20 text-foreground"
                                        }`}
                                    >
                                        {plan.popular && (
                                            <span className="absolute -top-2.5 text-[9px] font-black uppercase tracking-widest bg-candy-orange text-white px-3 py-0.5 rounded-full">
                                                Best Value
                                            </span>
                                        )}
                                        <span className={`text-xs font-bold mb-1 ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}>
                                            {plan.credits} Credits
                                        </span>
                                        <span className="font-display text-3xl leading-none mb-3">{plan.priceLabel}</span>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${plan.popular ? "bg-white/20 text-white" : "bg-foreground/[0.05] text-foreground/60"}`}>
                                            {purchaseLoading === plan.credits ? "Processing…" : "Buy Now"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Activity history */}
                        <div className="rounded-2xl border border-foreground/[0.08] bg-white px-5 py-5">
                            <h2 className="font-display text-base text-foreground mb-4">Activity History</h2>
                            {txLoading ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-11 animate-pulse rounded-xl bg-foreground/[0.04]" />
                                    ))}
                                </div>
                            ) : transactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No activity yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between rounded-xl border border-foreground/[0.06] px-4 py-3">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{tx.description}</p>
                                                <p className="text-[11px] text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <p className={`text-sm font-bold ${tx.amount < 0 ? "text-foreground/50" : "text-candy-green"}`}>
                                                {tx.amount > 0 ? "+" : ""}{tx.amount}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── MY STUDIO tab ── */}
                {activeTab === "creations" && (
                    <div className="animate-slide-up">
                        <div className="mb-5 flex items-center gap-3">
                            <div>
                                <h2 className="font-display text-lg text-foreground leading-tight">My Studio</h2>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    Toggle <span className="font-bold text-foreground/60">Private → Minted</span> to publish to the Community Showcase. Others download for 1 credit.
                                </p>
                            </div>
                        </div>
                        <GalleryGrid currentUserId={session.user.id} initialScope="mine" variant="compact" hideTabs hideSearch />
                    </div>
                )}

                {/* ── MY COLLECTION tab ── */}
                {activeTab === "purchased" && (
                    <div className="animate-slide-up">
                        <div className="mb-5 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4 flex items-center gap-3" style={{ borderColor: "rgba(245,185,66,0.3)", background: "rgba(245,185,66,0.05)" }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gold/15 flex-shrink-0" style={{ background: "rgba(245,185,66,0.15)" }}>
                                <span className="text-lg leading-none">💎</span>
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-foreground/50">Lifetime Access</p>
                                <p className="text-[12px] font-semibold text-foreground/60 mt-0.5">These mascots are yours forever. Download anytime — no additional charges.</p>
                            </div>
                        </div>
                        <GalleryGrid currentUserId={session.user.id} initialScope="purchased" variant="compact" hideTabs hideSearch />
                    </div>
                )}

                {/* Dialogs */}
                <ConfirmDialog
                    open={!!confirmPlanChange}
                    onOpenChange={(open) => !open && setConfirmPlanChange(null)}
                    title="Change Subscription Plan?"
                    description={
                        confirmPlanChange
                            ? `Switch to ${PLANS.find(p => p.variantId === confirmPlanChange.variantId)?.name} plan? You'll be charged a prorated amount immediately.`
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
                    description="You'll keep access until the end of your billing period. No charges after that."
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
