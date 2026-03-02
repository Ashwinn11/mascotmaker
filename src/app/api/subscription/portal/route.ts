import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/db";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sub = getActiveSubscription(session.user.id);
        if (!sub?.customer_portal_url) {
            return NextResponse.json({ error: "No subscription found" }, { status: 404 });
        }

        return NextResponse.json({ url: sub.customer_portal_url });
    } catch (error) {
        console.error("Portal error:", error);
        return NextResponse.json({ error: "Failed to get portal URL" }, { status: 500 });
    }
}
