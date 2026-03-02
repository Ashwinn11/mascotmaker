"use client";

import { useSession } from "next-auth/react";
import { Icon3DInline } from "@/components/ui/icon-3d";

export function CreditsDisplay() {
    const { data: session, status } = useSession();

    if (status !== "authenticated" || !session?.user) return null;

    const credits = session.user.credits ?? 0;
    const isLow = credits <= 10;

    return (
        <div
            className={`flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-sm font-bold transition-colors ${isLow
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-border bg-white text-warm-gray"
                }`}
        >
            <Icon3DInline name="high-voltage" size={16} />
            <span>{credits}</span>
        </div>
    );
}
