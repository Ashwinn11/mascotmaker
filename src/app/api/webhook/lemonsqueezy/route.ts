import { NextResponse } from "next/server";
import crypto from "crypto";
import {
    getUserCredits,
    updateUserCredits,
    addTransaction,
    createSubscription,
    updateSubscriptionByLsId,
    getSubscriptionByLsId,
} from "@/lib/db";
import { getPlanByVariantId, getPlanCredits } from "@/lib/pricing";

function resolveUserId(payload: Record<string, unknown>): string | null {
    // Try custom_data first
    const meta = payload.meta as Record<string, unknown> | undefined;
    const customData = meta?.custom_data as Record<string, string> | undefined;
    if (customData?.user_id) return customData.user_id;

    // Fall back to DB lookup by ls_subscription_id
    const data = payload.data as Record<string, unknown> | undefined;
    const lsSubId = String((data as Record<string, unknown>)?.id ?? "");
    if (lsSubId) {
        const sub = getSubscriptionByLsId(lsSubId);
        if (sub) return sub.user_id;
    }

    return null;
}

function resolveCredits(payload: Record<string, unknown>, variantId: string): number {
    // Primary: credits from checkout custom_data (set at checkout time)
    const meta = payload.meta as Record<string, unknown> | undefined;
    const customData = meta?.custom_data as Record<string, string> | undefined;
    const customCredits = parseInt(customData?.credits ?? "", 10);
    if (customCredits > 0) return customCredits;

    // Fallback: lookup by variant ID
    const planCredits = getPlanCredits(variantId);
    if (planCredits > 0) return planCredits;

    console.error(`[LS] Could not resolve credits for variant ${variantId}`);
    return 0;
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-signature") || "";
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

        if (!secret || !signature) {
            return NextResponse.json({ error: "Missing secret or signature" }, { status: 400 });
        }

        const hmac = crypto.createHmac("sha256", secret);
        const digest = hmac.update(rawBody).digest("hex");

        if (digest !== signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name as string;
        const attrs = payload.data.attributes;
        const lsSubId = String(payload.data.id);
        const variantId = String(attrs.variant_id ?? "");
        const userId = resolveUserId(payload);

        console.log(`[LS] ${eventName} — sub ${lsSubId}, user ${userId ?? "unknown"}`);

        switch (eventName) {
            case "subscription_created": {
                if (!userId) {
                    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
                }
                const plan = getPlanByVariantId(variantId);
                createSubscription({
                    userId,
                    lsSubscriptionId: lsSubId,
                    lsCustomerId: String(attrs.customer_id ?? ""),
                    variantId,
                    planName: plan?.name ?? "Unknown",
                    status: String(attrs.status ?? "active"),
                    currentPeriodEnd: attrs.renews_at ?? null,
                    customerPortalUrl: attrs.urls?.customer_portal ?? null,
                    updatePaymentUrl: attrs.urls?.update_payment_method ?? null,
                });
                // NO credits here — credits granted only on subscription_payment_success
                break;
            }

            case "subscription_payment_success": {
                if (!userId) {
                    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
                }

                // Check if this is a proration payment from a plan change (not a renewal).
                // LemonSqueezy sends subscription_updated + subscription_payment_success
                // on upgrades. We handle credits in subscription_updated to give only
                // the difference, so skip crediting here for non-renewal payments.
                const existingSubForPayment = getSubscriptionByLsId(lsSubId);
                const isRenewal = !existingSubForPayment ||
                    existingSubForPayment.variant_id === variantId;

                if (isRenewal) {
                    const creditsToAdd = resolveCredits(payload, variantId);
                    const currentCredits = getUserCredits(userId);
                    const newBalance = currentCredits + creditsToAdd;

                    updateUserCredits(userId, newBalance);
                    addTransaction({
                        userId,
                        type: "purchase",
                        amount: creditsToAdd,
                        balanceAfter: newBalance,
                        description: `Subscription renewal: ${creditsToAdd} credits added`,
                    });

                    console.log(`[LS] renewal user ${userId} +${creditsToAdd} → ${newBalance}`);
                } else {
                    console.log(`[LS] skipping proration payment for user ${userId} (credits handled in subscription_updated)`);
                }

                // Update subscription status/period
                updateSubscriptionByLsId(lsSubId, {
                    status: "active",
                    currentPeriodEnd: attrs.renews_at ?? undefined,
                });

                break;
            }

            case "subscription_updated": {
                const existingSub = getSubscriptionByLsId(lsSubId);
                const plan = getPlanByVariantId(variantId);

                // If plan changed, grant or revoke the credit difference
                if (existingSub && userId && existingSub.variant_id !== variantId) {
                    const oldCredits = getPlanCredits(existingSub.variant_id);
                    const newCredits = getPlanCredits(variantId);
                    const diff = newCredits - oldCredits;

                    if (diff > 0) {
                        // Upgrade: grant the difference
                        const currentCredits = getUserCredits(userId);
                        const newBalance = currentCredits + diff;
                        updateUserCredits(userId, newBalance);
                        addTransaction({
                            userId,
                            type: "purchase",
                            amount: diff,
                            balanceAfter: newBalance,
                            description: `Plan upgrade (${existingSub.plan_name} → ${plan?.name ?? "Unknown"}): +${diff} credits`,
                        });
                        console.log(`[LS] upgrade user ${userId} +${diff} → ${newBalance}`);
                    }
                    // Downgrade: don't claw back — user already paid for current period
                }

                updateSubscriptionByLsId(lsSubId, {
                    variantId,
                    planName: plan?.name ?? "Unknown",
                    status: String(attrs.status ?? "active"),
                    currentPeriodEnd: attrs.renews_at ?? undefined,
                    customerPortalUrl: attrs.urls?.customer_portal ?? undefined,
                    updatePaymentUrl: attrs.urls?.update_payment_method ?? undefined,
                });

                break;
            }

            case "subscription_cancelled": {
                updateSubscriptionByLsId(lsSubId, {
                    status: "cancelled",
                    cancelAt: attrs.ends_at ?? undefined,
                });
                break;
            }

            case "subscription_expired": {
                updateSubscriptionByLsId(lsSubId, { status: "expired" });
                break;
            }

            case "subscription_paused": {
                updateSubscriptionByLsId(lsSubId, { status: "paused" });
                break;
            }

            case "subscription_resumed": {
                updateSubscriptionByLsId(lsSubId, { status: "active" });
                break;
            }

            case "subscription_payment_failed": {
                updateSubscriptionByLsId(lsSubId, { status: "past_due" });
                break;
            }

            case "subscription_payment_refunded": {
                if (userId) {
                    const creditsToDeduct = getPlanCredits(variantId);
                    const currentCredits = getUserCredits(userId);
                    const newBalance = Math.max(0, currentCredits - creditsToDeduct);
                    updateUserCredits(userId, newBalance);
                    addTransaction({
                        userId,
                        type: "deduction",
                        amount: -creditsToDeduct,
                        balanceAfter: newBalance,
                        description: `Refund: ${creditsToDeduct} credits deducted`,
                    });
                    console.log(`[LS] refund user ${userId} -${creditsToDeduct} → ${newBalance}`);
                }
                break;
            }

            default:
                console.log(`[LS] Unhandled event: ${eventName}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Failed to handle webhook" }, { status: 500 });
    }
}
