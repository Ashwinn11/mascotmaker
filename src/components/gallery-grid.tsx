"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { downloadFile } from "@/lib/download";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Icon3D } from "@/components/ui/icon-3d";
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
    <div className="space-y-8">
      {/* Controls: Tabs & Search */}
      {(!hideTabs || !hideSearch) && (
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {!hideTabs && (
            <div className="flex p-1 bg-foreground/[0.04] rounded-2xl border border-foreground/[0.06]">
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
                    className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                      scope === s
                        ? "bg-white text-foreground shadow-sm"
                        : "text-foreground/40 hover:text-foreground/60"
                    }`}
                  >
                    {labels[s]}
                  </button>
                );
              })}
            </div>
          )}

          {!hideSearch && (
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/25 group-focus-within:text-candy-pink transition-colors duration-200" size={16} />
              <input
                type="text"
                placeholder="Search mascots, styles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-foreground/[0.08] rounded-xl text-sm focus:outline-none focus:border-candy-pink/50 focus:ring-2 focus:ring-candy-pink/10 transition-all"
              />
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-3xl bg-foreground/[0.05]"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Icon3D name="dizzy-face" size="2xl" animated className="mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-2">Failed to Load Gallery</h2>
          <button onClick={fetchItems} className="mt-4 px-6 py-2.5 bg-candy-pink text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all">
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center bg-white/60 rounded-[2.5rem] border-2 border-dashed border-foreground/[0.08]">
          <Icon3D name="classical-building" size="2xl" animated className="mb-6 opacity-30 grayscale" />
          <h2 className="font-display text-2xl text-foreground/30 mb-2">
            {scope === "purchased" ? "No Purchases Yet" : "No Mascots Found"}
          </h2>
          <p className="text-muted-foreground/50 max-w-sm mb-8 text-[11px] font-black tracking-widest uppercase">
            {scope === "purchased"
              ? "Browse the community and unlock a mascot you love."
              : query
                ? `Nothing matched "${query}"`
                : "The showcase is waiting for its first masterpiece."}
          </p>
          <Link
            href={scope === "purchased" ? "/gallery" : "/create"}
            className="px-7 py-3 bg-foreground text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-candy-pink transition-colors duration-200"
          >
            {scope === "purchased" ? "Browse Gallery" : "Create Now"}
          </Link>
        </div>
      ) : (
        <div className={
          variant === "compact"
            ? "columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
            : "columns-2 gap-4 sm:gap-5 sm:columns-3 lg:columns-4 xl:columns-5 space-y-5"
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

  const cardShadowClass = {
    "public-owner": "card-status-public",
    "private-owner": "card-status-private",
    "owned": "card-status-owned",
    "locked": "card-status-locked",
  }[cardState];

  const showPriceOverlay = cardState === "locked";
  const downloadLabel = isOwner || isPurchased ? "Download" : "1 Credit";
  const downloadButtonClass =
    isOwner || isPurchased
      ? "flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-foreground/[0.05] border border-transparent text-foreground/50 hover:bg-foreground/[0.10] text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
      : "flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-candy-pink text-white text-[10px] font-black uppercase tracking-wider hover:brightness-110 shadow-sm transition-all active:scale-95";

  return (
    <div
      className={`group relative mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] bg-white border border-foreground/[0.06] transition-all duration-300 hover:-translate-y-1.5 ${cardShadowClass}`}
      style={{ animationDelay: `${index * 0.04}s` }}
      onMouseLeave={() => setPreviewMode("image")}
    >
      {/* ── Image area ── */}
      <Link href={`/mascot/${item.id}`} className="relative aspect-square block overflow-hidden bg-white">
        <img
          src={
            previewMode === "gif" && item.gif_url
              ? item.gif_url
              : previewMode === "sticker" && item.sticker_url
                ? item.sticker_url
                : `/api/mascot/${item.id}/preview?v=${Date.now()}`
          }
          alt={item.name}
          className={`h-full w-full object-contain p-3 transition-all duration-500 ${
            previewMode === "sticker" ? "scale-90 rotate-3" : "scale-100 group-hover:scale-[1.08]"
          }`}
        />

        {/* ── State badge — always visible, prominent ── */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
          {cardState === "public-owner" && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-candy-green text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
              <Globe size={9} /> Minted
            </div>
          )}
          {cardState === "private-owner" && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-foreground/70 text-white text-[9px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm">
              <Lock size={9} /> Private
            </div>
          )}
          {cardState === "owned" && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm" style={{ background: "#f5b942", color: "#0d0c0b" }}>
              ✓ Owned
            </div>
          )}
        </div>

        {/* ── Media type badges ── */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          {item.gif_url && (
            <div className="rounded-md bg-foreground/70 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-sm tracking-widest">ANIM</div>
          )}
          {item.sticker_url && (
            <div className="rounded-md bg-foreground/70 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-sm tracking-widest">PACK</div>
          )}
        </div>

        {/* ── Price overlay — slides up on hover for locked items ── */}
        {showPriceOverlay && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none">
            <div className="bg-candy-pink/95 backdrop-blur-sm px-4 py-2.5 text-center">
              <p className="text-white text-[10px] font-black uppercase tracking-widest leading-none">
                ⚡ Unlock for 1 Credit
              </p>
            </div>
          </div>
        )}
      </Link>

      {/* ── Card footer ── */}
      <div className="px-3 py-2.5 space-y-2">
        {/* Name + type */}
        <div>
          <Link href={`/mascot/${item.id}`}>
            <h3 className="font-display text-[13px] text-foreground truncate group-hover:text-candy-pink transition-colors duration-200 capitalize leading-tight">
              {item.name}
            </h3>
          </Link>
          <p className="text-[9px] font-bold text-foreground/25 uppercase tracking-[0.18em] mt-0.5">
            {item.subject_type}
          </p>
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-1.5">
          {/* View detail */}
          <Link
            href={`/mascot/${item.id}`}
            className="flex items-center justify-center gap-1 h-8 px-2.5 rounded-lg bg-foreground/[0.05] border border-transparent text-foreground/50 hover:bg-foreground/[0.10] text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
          >
            <Eye size={10} /> View
          </Link>

          {/* Download / Purchase — the money button */}
          <button
            onClick={onDownload}
            disabled={isPurchasing}
            className={`flex-1 ${downloadButtonClass} ${isPurchasing ? "opacity-60 animate-pulse" : ""}`}
            title={downloadLabel}
          >
            {isPurchasing ? (
              <>Processing…</>
            ) : (
              <>
                <Download size={10} />
                {downloadLabel}
              </>
            )}
          </button>

          {/* Owner controls */}
          {isOwner && (
            <>
              {/* Publish toggle */}
              <button
                onClick={() => onTogglePublished(item.id)}
                title={item.published ? "Make Private" : "Mint to Community"}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all active:scale-95 ${
                  item.published
                    ? "bg-candy-green/10 text-candy-green border border-candy-green/20 hover:bg-candy-green/20"
                    : "bg-foreground/[0.04] text-foreground/35 border border-transparent hover:bg-foreground/[0.08] hover:text-foreground/60"
                }`}
              >
                <Globe size={13} />
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(item)}
                title="Delete"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-400 border border-transparent hover:bg-red-100 hover:text-red-500 transition-all active:scale-95"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
