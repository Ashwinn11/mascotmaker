import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { initLemonSqueezy } from "@/lib/lemonsqueezy";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * Handle POST request to create a Lemon Squeezy checkout.
 */
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { variantId, credits } = await req.json();
        if (!variantId) {
            return NextResponse.json({ error: "Variant ID is required" }, { status: 400 });
        }

        initLemonSqueezy();

        const storeId = process.env.LEMONSQUEEZY_STORE_ID;
        if (!storeId) {
            return NextResponse.json({ error: "Store ID is not configured" }, { status: 500 });
        }

        const { data, error } = await createCheckout(storeId, variantId, {
            checkoutData: {
                email: session.user.email ?? "",
                custom: {
                    user_id: session.user.id,
                    credits: credits.toString(),
                },
            },
            productOptions: {
                redirectUrl: `${process.env.AUTH_URL}/profile?success=true`,
            },
        });

        if (error) {
            console.error("Lemon Squeezy error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ url: data?.data.attributes.url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
    }
}
