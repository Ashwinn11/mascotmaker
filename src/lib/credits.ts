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

/**
 * Check auth + credits for an API route.
 */
export async function requireCredits(
    route: string
): Promise<{ userId: string; credits: number } | Response> {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response(
            JSON.stringify({ error: "Sign in to use this feature" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    const cost = CREDIT_COSTS[route] || 1;
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

    return { userId: session.user.id, credits: currentCredits };
}

/**
 * Atomically deduct fixed credits based on the route.
 * Returns new balance, or throws if insufficient credits (race condition protection).
 */
export async function deductCredits(
    userId: string,
    route: string
): Promise<number> {
    const cost = CREDIT_COSTS[route] || 1;
    const newBalance = await atomicDeductCredits(userId, cost);

    if (newBalance === null) {
        throw new Error("Insufficient credits");
    }

    await addTransaction({
        userId,
        type: "deduction",
        amount: -cost,
        balanceAfter: newBalance,
        description: `Used ${route}`,
    });
    await logUsage({
        userId,
        apiRoute: route,
        creditsCharged: cost,
    });

    return newBalance;
}
