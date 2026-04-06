"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export function CreditsDisplay() {
    const { data: session, status } = useSession();

    if (status !== "authenticated" || !session?.user) return null;

    const credits = session.user.credits ?? 0;
    const isZero = credits === 0;
    const isLow = credits > 0 && credits <= 3;

    // Dark-mode tailored chip styles
    const chipBase = "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 border backdrop-blur-md select-none";
    
    // Using candy-pink for coral, candy-yellow for gold
    const chipClass = isZero
        ? `${chipBase} bg-candy-pink/10 border-candy-pink/30 text-candy-pink hover:bg-candy-pink/20 shadow-[0_0_15px_rgba(255,77,28,0.2)] animate-pulse`
        : isLow
            ? `${chipBase} bg-candy-yellow/10 border-candy-yellow/20 text-candy-yellow hover:bg-candy-yellow/20`
            : `${chipBase} bg-white/5 border-white/10 text-white hover:bg-white/10`;

    const label = isZero
        ? "Buy Credits"
        : `${credits} credit${credits === 1 ? "" : "s"}`;

    return (
        <Link href="/profile" title="Manage credits" className={chipClass}>
            <svg
                width="11"
                height="14"
                viewBox="0 0 11 14"
                fill="currentColor"
                className={`flex-shrink-0 ${isZero ? "animate-bounce" : ""}`}
                aria-hidden="true"
            >
                <path d="M6.5 0L0 8h4.5L3.5 14L11 5.5H6.5L8 0H6.5Z" />
            </svg>
            <span>{label}</span>
            {isZero && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true" className="ml-0.5">
                    <path d="M4 1v3.5M4 5.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="4" cy="4" r="3.25" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            )}
        </Link>
    );
}
