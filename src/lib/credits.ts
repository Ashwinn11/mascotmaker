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
    imageSize?: "1K";
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

    return Math.max(1, baseCost);
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

    const description = `Used ${route}`;

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
