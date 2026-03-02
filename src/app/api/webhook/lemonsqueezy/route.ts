import { NextResponse } from "next/server";
import crypto from "crypto";
import { getUserCredits, updateUserCredits, addTransaction } from "@/lib/db";

function getPlanCredits(variantId: string): number {
    if (variantId === process.env.NEXT_PUBLIC_LS_VARIANT_100) return 100;
    if (variantId === process.env.NEXT_PUBLIC_LS_VARIANT_500) return 500;
    if (variantId === process.env.NEXT_PUBLIC_LS_VARIANT_1500) return 1500;
    return 100; // default fallback
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
        const eventName = payload.meta.event_name;

        if (eventName === "subscription_created" || eventName === "subscription_payment_success") {
            const userId = payload.meta.custom_data?.user_id;
            const variantId = String(payload.data.attributes.variant_id);

            if (!userId) {
                return NextResponse.json({ error: "Missing user_id in custom data" }, { status: 400 });
            }

            const creditsToAdd = getPlanCredits(variantId);
            const currentCredits = getUserCredits(userId);
            const newBalance = currentCredits + creditsToAdd;

            updateUserCredits(userId, newBalance);
            addTransaction({
                userId,
                type: "purchase",
                amount: creditsToAdd,
                balanceAfter: newBalance,
                description: `Subscription: ${creditsToAdd} credits added`,
            });

            console.log(`[LS] ${eventName} — user ${userId} +${creditsToAdd} → ${newBalance}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Failed to handle webhook" }, { status: 500 });
    }
}
