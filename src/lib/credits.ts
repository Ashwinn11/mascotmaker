import { auth } from "@/lib/auth";
import {
    getUserCredits,
    updateUserCredits,
    addTransaction,
    logUsage,
} from "@/lib/db";

export const TOKENS_PER_CREDIT = 100;

export const CREDIT_COSTS: Record<string, number> = {
    generate: 5,
    chat: 3,
    stylize: 5,
    animate: 10, // Increased to account for higher processing/storage
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
    const currentCredits = getUserCredits(session.user.id);

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
 * Deduct fixed credits based on the route.
 */
export function deductCredits(
    userId: string,
    route: string
): number {
    const cost = CREDIT_COSTS[route] || 1;
    const currentCredits = getUserCredits(userId);
    const newBalance = currentCredits - cost;

    updateUserCredits(userId, newBalance);
    addTransaction({
        userId,
        type: "deduction",
        amount: -cost,
        balanceAfter: newBalance,
        description: `Used ${route}`,
    });
    logUsage({
        userId,
        apiRoute: route,
        creditsCharged: cost,
    });

    return newBalance;
}

