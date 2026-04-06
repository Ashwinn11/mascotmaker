"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export function CreditsDisplay() {
    const { data: session, status } = useSession();

    if (status !== "authenticated" || !session?.user) return null;

    const credits = session.user.credits ?? 0;
    const isZero = credits === 0;
    const isLow = credits > 0 && credits <= 3;

    const chipClass = isZero
        ? "credit-chip credit-chip-zero"
        : isLow
            ? "credit-chip credit-chip-low"
            : "credit-chip credit-chip-normal";

    const label = isZero
        ? "Buy Credits"
        : `${credits} credit${credits === 1 ? "" : "s"}`;

    return (
        <Link href="/profile" title="Manage credits" className={`${chipClass} select-none`}>
            {/* Lightning bolt SVG — crisper than emoji at small sizes */}
            <svg
                width="11"
                height="14"
                viewBox="0 0 11 14"
                fill="currentColor"
                className="flex-shrink-0"
                aria-hidden="true"
            >
                <path d="M6.5 0L0 8h4.5L3.5 14L11 5.5H6.5L8 0H6.5Z" />
            </svg>
            <span>{label}</span>
            {isZero && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                    <path d="M4 1v3.5M4 5.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="4" cy="4" r="3.25" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            )}
        </Link>
    );
}
