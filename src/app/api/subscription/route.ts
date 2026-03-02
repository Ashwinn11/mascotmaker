import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/db";
import { getPlanByVariantId } from "@/lib/pricing";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sub = getActiveSubscription(session.user.id);
        if (!sub) {
            return NextResponse.json({ subscription: null });
        }

        const plan = getPlanByVariantId(sub.variant_id);

        return NextResponse.json({
            subscription: {
                id: sub.id,
                lsSubscriptionId: sub.ls_subscription_id,
                planName: sub.plan_name,
                credits: plan?.credits ?? 0,
                priceLabel: plan?.priceLabel ?? "",
                status: sub.status,
                currentPeriodEnd: sub.current_period_end,
                cancelAt: sub.cancel_at,
                customerPortalUrl: sub.customer_portal_url,
            },
        });
    } catch (error) {
        console.error("Subscription fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
    }
}
