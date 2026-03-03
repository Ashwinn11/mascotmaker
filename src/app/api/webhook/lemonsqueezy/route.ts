import { NextResponse } from "next/server";
import crypto from "crypto";
import {
    getUserCredits,
    updateUserCredits,
    addTransaction,
    createSubscription,
    updateSubscriptionByLsId,
    getSubscriptionByLsId,
    isWebhookProcessed,
    markWebhookProcessed,
} from "@/lib/db";
import { getPlanByVariantId, getPlanCredits } from "@/lib/pricing";

async function resolveUserId(payload: Record<string, unknown>): Promise<string | null> {
    // Try custom_data first
    const meta = payload.meta as Record<string, unknown> | undefined;
    const customData = meta?.custom_data as Record<string, string> | undefined;
    if (customData?.user_id) return customData.user_id;

    // Fall back to DB lookup by ls_subscription_id
    const data = payload.data as Record<string, unknown> | undefined;
    const lsSubId = String((data as Record<string, unknown>)?.id ?? "");
    if (lsSubId) {
        const sub = await getSubscriptionByLsId(lsSubId);
        if (sub) return sub.user_id;
    }

    return null;
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
        const userId = await resolveUserId(payload);

        // Webhook idempotency: use event_name + subscription_id as unique key
        const eventId = `${eventName}_${lsSubId}_${attrs.updated_at ?? Date.now()}`;
        if (await isWebhookProcessed(eventId)) {
            console.log(`[LS] Skipping duplicate event: ${eventId}`);
            return NextResponse.json({ success: true, duplicate: true });
        }

        console.log(`[LS] ${eventName} — sub ${lsSubId}, user ${userId ?? "unknown"}, variantId: "${variantId}", attrs.variant_id: ${JSON.stringify(attrs.variant_id)}, attrs.subscription_id: ${JSON.stringify(attrs.subscription_id)}`);

        switch (eventName) {
            case "subscription_created": {
                if (!userId) {
                    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
                }
                const plan = getPlanByVariantId(variantId);
                await createSubscription({
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

                // Payment events send an invoice object — subscription_id is in attrs, not data.id
                const paymentSubId = String(attrs.subscription_id ?? lsSubId);
                const existingSubForPayment = await getSubscriptionByLsId(paymentSubId);
                const billingReason = attrs.billing_reason ?? "";

                if (existingSubForPayment) {
                    let creditsToAdd = 0;
                    let description = "";

                    if (billingReason === "initial" || billingReason === "renewal") {
                        // First purchase or monthly renewal — full plan credits
                        creditsToAdd = getPlanCredits(existingSubForPayment.variant_id);
                        description = `Subscription ${billingReason}: ${creditsToAdd} credits added`;
                    } else if (billingReason === "upgrade") {
                        // Upgrade proration — only grant the difference
                        const oldCredits = getPlanCredits(existingSubForPayment.variant_id);
                        const newVariant = variantId || existingSubForPayment.variant_id;
                        const newCredits = getPlanCredits(newVariant);
                        creditsToAdd = Math.max(0, newCredits - oldCredits);
                        description = `Plan upgrade: +${creditsToAdd} credits`;
                    }
                    // downgrade/other: creditsToAdd stays 0

                    if (creditsToAdd > 0) {
                        const currentCredits = await getUserCredits(userId);
                        const newBalance = currentCredits + creditsToAdd;
                        await updateUserCredits(userId, newBalance);
                        await addTransaction({
                            userId,
                            type: "purchase",
                            amount: creditsToAdd,
                            balanceAfter: newBalance,
                            description,
                        });
                        console.log(`[LS] ${billingReason} user ${userId} +${creditsToAdd} → ${newBalance}`);
                    } else {
                        console.log(`[LS] skipping payment for user ${userId} (billing_reason: ${billingReason}, no credits to add)`);
                    }
                }

                // Update subscription status/period
                await updateSubscriptionByLsId(paymentSubId, {
                    status: "active",
                    currentPeriodEnd: attrs.renews_at ?? undefined,
                });

                break;
            }

            case "subscription_updated": {
                // Only update subscription metadata — credits are handled solely in subscription_payment_success
                const plan = getPlanByVariantId(variantId);

                await updateSubscriptionByLsId(lsSubId, {
                    variantId,
                    planName: plan?.name ?? "Unknown",
                    status: String(attrs.status ?? "active"),
                    currentPeriodEnd: attrs.renews_at ?? undefined,
                    customerPortalUrl: attrs.urls?.customer_portal ?? undefined,
                    updatePaymentUrl: attrs.urls?.update_payment_method ?? undefined,
                });

                console.log(`[LS] updated sub ${lsSubId} → variant ${variantId}, status ${attrs.status}`);
                break;
            }

            case "subscription_cancelled": {
                await updateSubscriptionByLsId(lsSubId, {
                    status: "cancelled",
                    cancelAt: attrs.ends_at ?? undefined,
                });
                break;
            }

            case "subscription_expired": {
                await updateSubscriptionByLsId(lsSubId, { status: "expired" });
                break;
            }

            case "subscription_paused": {
                await updateSubscriptionByLsId(lsSubId, { status: "paused" });
                break;
            }

            case "subscription_resumed": {
                await updateSubscriptionByLsId(lsSubId, { status: "active" });
                break;
            }

            case "subscription_payment_failed": {
                await updateSubscriptionByLsId(lsSubId, { status: "past_due" });
                break;
            }

            case "subscription_payment_refunded": {
                if (userId) {
                    const refundSubId = String(attrs.subscription_id ?? lsSubId);
                    const refundSub = await getSubscriptionByLsId(refundSubId);
                    const refundVariantId = variantId || refundSub?.variant_id || "";
                    const creditsToDeduct = getPlanCredits(refundVariantId);
                    const currentCredits = await getUserCredits(userId);
                    const newBalance = Math.max(0, currentCredits - creditsToDeduct);
                    await updateUserCredits(userId, newBalance);
                    await addTransaction({
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

        // Mark event as processed after successful handling
        await markWebhookProcessed(eventId, eventName);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Failed to handle webhook" }, { status: 500 });
    }
}
