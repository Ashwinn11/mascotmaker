"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function AuthButton() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (status === "loading") {
        return (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-muted" />
        );
    }

    if (!session) {
        return (
            <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-candy-pink to-candy-orange px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                </svg>
                Sign In
            </button>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-xl border-2 border-border bg-white px-2 py-1.5 transition-all hover:border-candy-pink/30 hover:shadow-sm"
            >
                {session.user?.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={28}
                        height={28}
                        className="rounded-lg"
                    />
                ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-candy-pink to-candy-orange text-xs font-bold text-white">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                )}
                <span className="hidden sm:block text-sm font-semibold text-warm-gray max-w-[100px] truncate">
                    {session.user?.name?.split(" ")[0] || "User"}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border-2 border-border bg-white p-2 shadow-xl shadow-black/5 animate-pop-in z-50">
                    <div className="px-3 py-2 mb-1">
                        <p className="text-sm font-bold text-foreground truncate">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                    <div className="h-px bg-border mx-2 my-1" />
                    <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-warm-gray transition-colors hover:bg-muted"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                    </Link>
                    <button
                        onClick={() => { setMenuOpen(false); signOut(); }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-red-50"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
