import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getActiveSubscription, updateSubscriptionByLsId } from "@/lib/db";
import { initLemonSqueezy } from "@/lib/lemonsqueezy";
import { cancelSubscription } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sub = getActiveSubscription(session.user.id);
        if (!sub || sub.status !== "active") {
            return NextResponse.json({ error: "No active subscription" }, { status: 400 });
        }

        initLemonSqueezy();

        const { error } = await cancelSubscription(sub.ls_subscription_id);
        if (error) {
            console.error("LemonSqueezy cancel error:", error);
            return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
        }

        // Update DB immediately for instant UI feedback
        updateSubscriptionByLsId(sub.ls_subscription_id, { status: "cancelled" });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cancel error:", error);
        return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }
}
