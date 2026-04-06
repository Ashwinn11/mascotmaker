"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
            <div className="h-9 w-20 animate-pulse rounded-full bg-white/10" />
        );
    }

    if (!session) {
        return (
            <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 rounded-full border border-candy-pink bg-candy-pink/10 px-4 py-2 text-sm font-bold text-candy-pink transition-all duration-300 hover:bg-candy-pink hover:text-white hover:shadow-[0_0_20px_rgba(255,77,28,0.4)] active:scale-[0.98]"
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
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-1.5 pr-3 py-1.5 transition-all duration-300 hover:border-candy-pink/50 hover:bg-white/10"
            >
                {session.user?.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={26}
                        height={26}
                        className="rounded-full shadow-sm"
                    />
                ) : (
                    <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-candy-pink text-xs font-bold text-white shadow-sm">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                )}
                <span className="hidden sm:block text-sm font-semibold text-white max-w-[100px] truncate">
                    {session.user?.name?.split(" ")[0] || "User"}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#141210] p-2 shadow-2xl shadow-black origin-top-right z-50 backdrop-blur-xl"
                    >
                        <div className="px-3 py-2 mb-1">
                            <p className="text-sm font-bold text-white truncate">{session.user?.name}</p>
                            <p className="text-xs text-white/50 truncate">{session.user?.email}</p>
                        </div>
                        <div className="h-px bg-white/5 mx-2 my-1" />
                        <Link
                            href="/profile"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Profile
                        </Link>
                        <button
                            onClick={() => { setMenuOpen(false); signOut(); }}
                            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
