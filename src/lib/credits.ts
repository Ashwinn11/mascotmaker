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
    animate: 8,
};

/**
 * Check auth + credits for an API route.
 * We use the fixed costs as a minimum buffer check.
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

    const minBuffer = CREDIT_COSTS[route] || 1;
    const currentCredits = getUserCredits(session.user.id);

    if (currentCredits < minBuffer) {
        return new Response(
            JSON.stringify({
                error: "Insufficient credits",
                creditsRemaining: currentCredits,
                creditsRequired: minBuffer,
            }),
            { status: 402, headers: { "Content-Type": "application/json" } }
        );
    }

    return { userId: session.user.id, credits: currentCredits };
}

/**
 * Deduct credits based on actual token usage.
 */
export function deductCredits(
    userId: string,
    route: string,
    tokensUsed: number = 0
): number {
    // If tokensUsed is 0, fallback to fixed cost
    const cost = tokensUsed > 0
        ? Math.max(1, Math.ceil(tokensUsed / TOKENS_PER_CREDIT))
        : (CREDIT_COSTS[route] || 1);

    const currentCredits = getUserCredits(userId);
    const newBalance = currentCredits - cost;

    updateUserCredits(userId, newBalance);
    addTransaction({
        userId,
        type: "deduction",
        amount: -cost,
        balanceAfter: newBalance,
        description: `Used ${route} (${tokensUsed} tokens)`,
    });
    logUsage({
        userId,
        apiRoute: route,
        creditsCharged: cost,
    });

    return newBalance;
}
