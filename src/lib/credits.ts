import { auth } from "@/lib/auth";
import {
    getUserCredits,
    atomicDeductCredits,
    addTransaction,
    logUsage,
} from "@/lib/db";

export const TOKENS_PER_CREDIT = 100;

export const CREDIT_COSTS: Record<string, number> = {
    generate: 5,
    chat: 5,
    stylize: 5,
    animate: 10,
};

export type ImageOptions = {
    aspectRatio?: string;
    imageSize?: "512px" | "1K" | "2K" | "4K";
    thinkingLevel?: "Minimal" | "High";
    useSearch?: boolean;
};

/**
 * Dynamically calculate credit cost based on requested features.
 */
export function calculateCost(route: string, options?: ImageOptions): number {
    let cost = CREDIT_COSTS[route] || 1;

    if (!options) return cost;

    // Advanced Resolution Multipliers
    if (options.imageSize === "2K") cost += 5;
    if (options.imageSize === "4K") cost += 15;
    if (options.imageSize === "512px") cost = Math.max(1, cost - 2);

    // High Thinking / Pro Mode
    if (options.thinkingLevel === "High") cost += 5;

    // Search Grounding
    if (options.useSearch) cost += 2;

    return cost;
}

/**
 * Check auth + credits for an API route.
 */
export async function requireCredits(
    route: string,
    options?: ImageOptions
): Promise<{ userId: string; credits: number; cost: number } | Response> {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response(
            JSON.stringify({ error: "Sign in to use this feature" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    const cost = calculateCost(route, options);
    const currentCredits = await getUserCredits(session.user.id);

    if (currentCredits < cost) {
        return new Response(
            JSON.stringify({
                error: "Insufficient credits",
                creditsRemaining: currentCredits,
                creditsRequired: cost,
            }),
            { status: 402, headers: { "Content-Type": "application/json" } }
        );
    }

    return { userId: session.user.id, credits: currentCredits, cost };
}

/**
 * Atomically deduct fixed credits based on the route.
 * Returns new balance, or throws if insufficient credits (race condition protection).
 */
export async function deductCredits(
    userId: string,
    route: string,
    options?: ImageOptions
): Promise<number> {
    const cost = calculateCost(route, options);
    const newBalance = await atomicDeductCredits(userId, cost);

    if (newBalance === null) {
        throw new Error("Insufficient credits");
    }

    let description = `Used ${route}`;
    if (options?.imageSize === "4K") description += " (4K)";
    if (options?.thinkingLevel === "High") description += " (Pro)";
    if (options?.useSearch) description += " (Search)";

    await addTransaction({
        userId,
        type: "deduction",
        amount: -cost,
        balanceAfter: newBalance,
        description,
    });
    await logUsage({
        userId,
        apiRoute: route,
        creditsCharged: cost,
    });

    return newBalance;
}
