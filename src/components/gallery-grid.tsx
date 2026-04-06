"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { downloadFile } from "@/lib/download";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";
import { Search, Globe, Lock, Trash2, Eye, Download } from "lucide-react";
import { PaywallModal } from "@/components/paywall-modal";

interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
  image_url: string;
  gif_url: string | null;
  sticker_url: string | null;
  subject_type: string;
  user_id: string | null;
  published: number;
  created_at: string;
}

interface GalleryGridProps {
  currentUserId?: string;
  purchasedIds?: number[];
  initialScope?: "public" | "mine" | "purchased";
  hideTabs?: boolean;
  hideSearch?: boolean;
  variant?: "full" | "compact";
}

export function GalleryGrid({ 
  currentUserId, 
  purchasedIds = [], 
  initialScope = "public",
  hideTabs = false,
  hideSearch = false,
  variant = "full"
}: GalleryGridProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [scope, setScope] = useState<"public" | "mine" | "purchased">(initialScope);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Paywall Modal State
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallType, setPaywallType] = useState<"auth" | "credits">("auth");
  const [paywallCredits, setPaywallCredits] = useState({ required: 1, remaining: 0 });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchItems = () => {
    setLoading(true);
    setError(false);
    const searchParams = new URLSearchParams({
      scope,
      ...(debouncedQuery && { q: debouncedQuery }),
    });

    fetch(`/api/gallery?${searchParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load gallery");
        return res.json();
      })
      .then((data) => setItems(data.items || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [scope, debouncedQuery]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) {
        toast.error("Failed to delete mascot");
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.name}" has been deleted`);
    } catch {
      toast.error("Failed to delete mascot. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleTogglePublished = async (id: number) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const { item: updated } = await res.json();
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success(updated.published ? "Minted to Community Showcase ✓" : "Set to Private");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handlePurchaseAndDownload = async (item: GalleryItem) => {
    if (!currentUserId) {
      setPaywallType("auth");
      setPaywallOpen(true);
      return;
    }

    if (item.user_id === currentUserId) {
      // Direct Download for owner
      downloadFile(item.image_url, `${item.name.toLowerCase().replace(/\s+/g, '-')}.png`);
      return;
    }

    setPurchasing(item.id);
    const toastId = toast.loading(`Unlocking "${item.name}" (1 credit)...`);
    
    try {
      const res = await fetch("/api/gallery/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402 || data.error === "INSUFFICIENT_CREDITS") {
          toast.dismiss(toastId);
          setPaywallCredits({ required: 1, remaining: data.remaining || 0 });
          setPaywallType("credits");
          setPaywallOpen(true);
        } else {
          toast.error(data.error || "Failed to purchase", { id: toastId });
        }
        return;
      }

      toast.success("Unlocked! Downloading now...", { id: toastId });
      downloadFile(item.image_url, `${item.name.toLowerCase().replace(/\s+/g, '-')}.png`);
    } catch {
      toast.error("Failed to process download", { id: toastId });
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Controls: Tabs & Search */}
      {(!hideTabs || !hideSearch) && (
        <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between">
          {!hideTabs && (
            <div className="flex p-1.5 rounded-full glass-dark border border-white/10 shadow-xl backdrop-blur-xl">
              {(["public", ...(currentUserId ? ["mine", "purchased"] : [])] as const).map((s) => {
                const labels: Record<string, string> = {
                  public: "Community",
                  mine: "My Studio",
                  purchased: "My Collection",
                };
                return (
                  <button
                    key={s}
                    onClick={() => setScope(s as "public" | "mine" | "purchased")}
                    className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                      scope === s
                        ? "bg-candy-pink text-[#0c0a09] shadow-glow-coral"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {labels[s]}
                  </button>
                );
              })}
            </div>
          )}

          {!hideSearch && (
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-candy-pink transition-colors duration-300" size={18} />
              <input
                type="text"
                placeholder="Search mascots, styles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-dark border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-candy-pink/50 focus:ring-1 focus:ring-candy-pink/50 transition-all duration-300 shadow-inner"
              />
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-white/5 border border-white/5"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 text-center rounded-[2rem] glass-dark border border-white/10">
          <Icon3D name="dizzy-face" size="2xl" animated className="mb-6 opacity-80" />
          <h2 className="font-display text-3xl text-white mb-2">Failed to Load Gallery</h2>
          <p className="text-white/50 mb-8 max-w-sm">Something went wrong while connecting to the studio network.</p>
          <button onClick={fetchItems} className="px-8 py-3 bg-white text-[#0c0a09] font-black tracking-wide rounded-xl hover:bg-candy-pink transition-all duration-300 shadow-lg">
            Retry Connection
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center glass-dark rounded-[2.5rem] border border-dashed border-white/20">
          <Icon3D name="classical-building" size="2xl" animated className="mb-6 opacity-40 grayscale" />
          <h2 className="font-display text-3xl text-white mb-3">
            {scope === "purchased" ? "No Purchases Yet" : "No Characters Found"}
          </h2>
          <p className="text-white/40 max-w-sm mb-10 text-[11px] font-black tracking-widest uppercase">
            {scope === "purchased"
              ? "Browse the community and unlock a mascot you love."
              : query
                ? `Nothing matched "${query}"`
                : "The showcase is waiting for its first masterpiece."}
          </p>
          <Link
            href={scope === "purchased" ? "/gallery" : "/create"}
            className="px-8 py-3.5 bg-candy-pink text-[#0c0a09] font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 shadow-glow-coral transition-all duration-300 transform hover:scale-105"
          >
            {scope === "purchased" ? "Browse Gallery" : "Create Now"}
          </Link>
        </div>
      ) : (
        <div className={
          variant === "compact"
            ? "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
            : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        }>
          {items.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              onDelete={setDeleteTarget}
              isOwner={item.user_id === currentUserId}
              isPurchased={purchasedIds.includes(item.id)}
              isLoggedIn={!!currentUserId}
              onTogglePublished={handleTogglePublished}
              onDownload={() => handlePurchaseAndDownload(item)}
              isPurchasing={purchasing === item.id}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Mascot?"
        description={`"${deleteTarget?.name}" will be permanently removed. This can't be undone.`}
        confirmText="Delete permanently"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />

      <PaywallModal
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        type={paywallType}
        creditsRequired={paywallCredits.required}
        creditsRemaining={paywallCredits.remaining}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   GalleryCard — status-aware, journey-mapped card
   ───────────────────────────────────────────────────────────────── */
function GalleryCard({
  item,
  index,
  onDelete,
  isOwner,
  isPurchased,
  isLoggedIn,
  onTogglePublished,
  onDownload,
  isPurchasing,
}: {
  item: GalleryItem;
  index: number;
  onDelete: (item: GalleryItem) => void;
  isOwner: boolean;
  isPurchased: boolean;
  isLoggedIn: boolean;
  onTogglePublished: (id: number) => void;
  onDownload: () => void;
  isPurchasing: boolean;
}) {
  const [previewMode, setPreviewMode] = useState<"image" | "gif" | "sticker">("image");

  // Derive the card's current "state" for styling
  const cardState: "public-owner" | "private-owner" | "owned" | "locked" =
    isOwner && item.published
      ? "public-owner"
      : isOwner && !item.published
        ? "private-owner"
        : isPurchased
          ? "owned"
          : "locked";

  const showPriceOverlay = cardState === "locked";
  const downloadLabel = isOwner || isPurchased ? "Download" : "1 Credit";
  
  const downloadButtonClass =
    isOwner || isPurchased
      ? "flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95"
      : "flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-candy-pink text-[#0c0a09] text-[10px] font-black uppercase tracking-[0.2em] shadow-glow-coral hover:brightness-110 transition-all duration-300 active:scale-95";

  return (
    <div
      className={`group relative mb-6 break-inside-avoid overflow-hidden rounded-[1.5rem] bg-[#141210] border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl hover:shadow-candy-pink/5 block`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseLeave={() => setPreviewMode("image")}
    >
      {/* ── Image area ── */}
      <Link href={`/mascot/${item.id}`} className="relative aspect-square flex items-center justify-center overflow-hidden bg-[#1c1916]">
        {/* Checkerboard subtle background for alpha */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]" />
        
        <img
          src={
            previewMode === "gif" && item.gif_url
              ? item.gif_url
              : previewMode === "sticker" && item.sticker_url
                ? item.sticker_url
                : `/api/mascot/${item.id}/preview?v=${Date.now()}`
          }
          alt={item.name}
          className={`h-full w-full object-contain p-4 relative z-10 drop-shadow-2xl transition-all duration-700 ease-out ${
            previewMode === "sticker" ? "scale-90 rotate-3" : "scale-100 group-hover:scale-[1.05]"
          }`}
        />

        {/* ── State badge — always visible, prominent ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none z-20">
          {cardState === "public-owner" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#5cd85c]/20 border border-[#5cd85c]/30 text-[#5cd85c] text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
              <Globe size={10} /> Minted
            </div>
          )}
          {cardState === "private-owner" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white/80 text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
              <Lock size={10} /> Private
            </div>
          )}
          {cardState === "owned" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-candy-yellow/20 border border-candy-yellow/30 text-candy-yellow text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
              ✓ Owned
            </div>
          )}
        </div>

        {/* ── Media type badges ── */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 xl:flex">
          {item.gif_url && (
            <div className="rounded-lg bg-black/80 border border-white/10 px-2 py-1 text-[8px] font-black text-white backdrop-blur-md tracking-widest shadow-lg">ANIM</div>
          )}
          {item.sticker_url && (
            <div className="rounded-lg bg-black/80 border border-white/10 px-2 py-1 text-[8px] font-black text-white backdrop-blur-md tracking-widest shadow-lg">PACK</div>
          )}
        </div>

        {/* ── Price overlay — slides up on hover for locked items ── */}
        {showPriceOverlay && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none z-20">
            <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-4 text-center">
              <p className="text-candy-pink text-[10px] font-black uppercase tracking-[0.2em] leading-none drop-shadow-md flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-candy-pink animate-pulse" />
                Unlock for 1 Credit
              </p>
            </div>
          </div>
        )}
      </Link>

      {/* ── Card footer ── */}
      <div className="p-4 space-y-4">
        {/* Name + type */}
        <div>
          <Link href={`/mascot/${item.id}`}>
            <h3 className="font-display text-lg text-white truncate group-hover:text-candy-pink transition-colors duration-300 capitalize leading-tight">
              {item.name}
            </h3>
          </Link>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">
            {item.subject_type}
          </p>
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-2">
          {/* View detail */}
          <Link
            href={`/mascot/${item.id}`}
            className="flex items-center justify-center h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-95 group/btn"
            title="View Details"
          >
            <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
          </Link>

          {/* Download / Purchase — the money button */}
          <button
            onClick={onDownload}
            disabled={isPurchasing}
            className={`flex-1 ${downloadButtonClass} ${isPurchasing ? "opacity-50" : ""}`}
            title={downloadLabel}
          >
            {isPurchasing ? (
              <span className="animate-pulse flex items-center gap-2"><Icon3DInline name="sparkles" size={14} /> Processing…</span>
            ) : (
              <>
                {isOwner || isPurchased ? <Download size={14} /> : <Icon3DInline name="sparkles" size={14} />}
                {downloadLabel}
              </>
            )}
          </button>

          {/* Owner controls */}
          {isOwner && (
            <div className="flex gap-2 shrink-0">
              {/* Publish toggle */}
              <button
                onClick={() => onTogglePublished(item.id)}
                title={item.published ? "Make Private" : "Mint to Community"}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 active:scale-95 group/pub ${
                  item.published
                    ? "bg-[#5cd85c]/10 text-[#5cd85c] border border-[#5cd85c]/20 hover:bg-[#5cd85c]/20 hover:border-[#5cd85c]/40"
                    : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                <Globe size={16} className="group-hover/pub:scale-110 transition-transform" />
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(item)}
                title="Delete"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-all duration-300 active:scale-95 group/del"
              >
                <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
