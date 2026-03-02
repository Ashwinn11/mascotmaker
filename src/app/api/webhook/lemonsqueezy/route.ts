import { NextResponse } from "next/server";
import crypto from "crypto";
import { getUserCredits, updateUserCredits, addTransaction } from "@/lib/db";

/**
 * Handle POST request to handle Lemon Squeezy webhooks.
 * This route is used to update the user's balance when a payment is successful.
 */
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

        if (eventName === "order_created") {
            const {
                custom: { user_id, credits },
            } = payload.meta.custom_data;

            if (!user_id || !credits) {
                return NextResponse.json({ error: "Missing user_id or credits in custom data" }, { status: 400 });
            }

            const userId = user_id;
            const creditsToAdd = parseInt(credits);
            const currentCredits = getUserCredits(userId);
            const newBalance = currentCredits + creditsToAdd;

            updateUserCredits(userId, newBalance);
            addTransaction({
                userId,
                type: "purchase",
                amount: creditsToAdd,
                balanceAfter: newBalance,
                description: `Purchased ${creditsToAdd} credits`,
            });

            console.log(`Updated credits for user ${userId}: ${newBalance}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Failed to handle webhook" }, { status: 500 });
    }
}
