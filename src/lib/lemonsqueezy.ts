import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * Initialize Lemon Squeezy with the API key from environment variables.
 */
export function initLemonSqueezy() {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) {
        throw new Error("LEMONSQUEEZY_API_KEY is not defined in environment variables.");
    }

    lemonSqueezySetup({ apiKey });
}
