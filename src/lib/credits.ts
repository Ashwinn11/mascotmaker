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
    subjectType?: string;
    studioMode?: string;
};

/**
 * Dynamically calculate credit cost based on requested features.
 */
export function calculateCost(route: string, options?: ImageOptions): number {
    let baseCost = CREDIT_COSTS[route] || 5;
    if (options?.studioMode === "Story") baseCost = 40;
    else if (options?.studioMode === "Composite") baseCost = 15;

    if (!options) return baseCost;

    let extras = 0;
    // Advanced Resolution Multipliers
    if (options.imageSize === "2K") extras += 5;
    else if (options.imageSize === "4K") extras += 15;
    else if (options.imageSize === "512px") extras = -2;

    // High Thinking / Pro Mode
    if (options.thinkingLevel === "High") extras += 5;

    // Search Grounding
    if (options.useSearch) extras += 10;

    // Subject Premium
    if (options.subjectType === "Sticker") extras += 3;

    return Math.max(1, baseCost + extras);
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
