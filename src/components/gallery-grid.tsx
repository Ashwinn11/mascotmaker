"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { downloadFile } from "@/lib/download";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Icon3D } from "@/components/ui/icon-3d";
import { Search, Globe, Lock, Trash2, Eye, Share2, Copy, Download } from "lucide-react";
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
}

export function GalleryGrid({ currentUserId }: GalleryGridProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [scope, setScope] = useState<"public" | "mine">("public");
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
      toast.success(updated.published ? "Mascot is now public" : "Mascot is now private");
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

      toast.success("Mascot Unlocked!", { id: toastId });
      downloadFile(item.image_url, `${item.name.toLowerCase().replace(/\s+/g, '-')}.png`);
    } catch {
      toast.error("Failed to process download", { id: toastId });
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* 🛠️ Controls: Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex p-1.5 bg-foreground/5 rounded-2xl border border-foreground/5 backdrop-blur-sm">
          <button
            onClick={() => setScope("public")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              scope === "public" ? "bg-white text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            Showcase
          </button>
          {currentUserId && (
            <button
              onClick={() => setScope("mine")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                scope === "mine" ? "bg-white text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground/60"
              }`}
            >
              My Mascots
            </button>
          )}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-candy-pink transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search mascots, styles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border-2 border-foreground/5 rounded-2xl text-sm focus:outline-none focus:border-candy-pink/50 focus:ring-4 focus:ring-candy-pink/5 transition-all shadow-premium"
          />
        </div>
      </div>

      {/* 🖼️ Grid View */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 animate-in fade-in duration-500">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-3xl bg-foreground/5" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Icon3D name="dizzy-face" size="2xl" animated className="mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-2">Failed to Load Gallery</h2>
          <button onClick={fetchItems} className="mt-4 px-6 py-2.5 bg-candy-pink text-white font-bold rounded-xl shadow-lg shadow-candy-pink/25 hover:scale-105 active:scale-95 transition-all">Retry</button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-foreground/10 animate-in zoom-in duration-500">
          <Icon3D name="classical-building" size="2xl" animated className="mb-6 opacity-40 grayscale" />
          <h2 className="font-display text-3xl text-foreground/30 mb-2">No Mascots Found</h2>
          <p className="text-muted-foreground/50 max-w-sm mb-10 uppercase text-[10px] font-black tracking-widest">
            {query ? `Try a different term for "${query}"` : "The showcase is waiting for its first shared masterpiece"}
          </p>
          <Link href="/create" className="px-8 py-3.5 bg-foreground text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-candy-pink transition-colors shadow-premium">
            Create Now
          </Link>
        </div>
      ) : (
        <div className="columns-2 gap-4 sm:gap-6 sm:columns-3 lg:columns-4 xl:columns-5 space-y-6">
          {items.map((item, i) => (
            <GalleryCard 
              key={item.id} 
              item={item} 
              index={i} 
              onDelete={setDeleteTarget} 
              isOwner={item.user_id === currentUserId}
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
        description={`"${deleteTarget?.name}" will be permanently removed. This action is irreversible.`}
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

function GalleryCard({
  item,
  index,
  onDelete,
  isOwner,
  onTogglePublished,
  onDownload,
  isPurchasing
}: {
  item: GalleryItem;
  index: number;
  onDelete: (item: GalleryItem) => void;
  isOwner: boolean;
  onTogglePublished: (id: number) => void;
  onDownload: () => void;
  isPurchasing: boolean;
}) {
  const [previewMode, setPreviewMode] = useState<"image" | "gif" | "sticker">("image");

  return (
    <div
      className="group relative mb-6 break-inside-avoid overflow-hidden rounded-[2.5rem] border-2 border-foreground/5 bg-white shadow-premium transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-candy-pink/10 animate-in slide-in-from-bottom-8 stagger-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseLeave={() => setPreviewMode("image")}
    >
      <Link href={`/mascot/${item.id}`} className="relative aspect-[1/1] block overflow-hidden bg-white">
        <img
          src={previewMode === "gif" && item.gif_url ? item.gif_url : previewMode === "sticker" && item.sticker_url ? item.sticker_url : `/api/mascot/${item.id}/preview?v=${Date.now()}`}
          alt={item.name}
          className={`h-full w-full object-contain p-4 transition-all duration-700 ${previewMode === "sticker" ? "scale-90 rotate-3" : "scale-100 group-hover:scale-110"}`}
        />

        {/* State Badges - Micro-labels to prevent overlap */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 pointer-events-none z-10">
          {item.published ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-candy-green/90 text-white text-[7px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm">
              <Globe size={8} /> Published
            </div>
          ) : isOwner ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-foreground/60 text-white text-[7px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm">
              <Lock size={8} /> Private
            </div>
          ) : null}
        </div>

        {/* Media Badges */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.gif_url && <div className="rounded-md bg-black/60 px-1.5 py-0.5 text-[7px] font-bold text-white backdrop-blur-md">ANIM</div>}
          {item.sticker_url && <div className="rounded-md bg-black/60 px-1.5 py-0.5 text-[7px] font-bold text-white backdrop-blur-md">SPRITE</div>}
        </div>
      </Link>

      <div className="p-3.5 pt-1 space-y-2.5">
        <div className="space-y-0.5">
          <Link href={`/mascot/${item.id}`}>
            <h3 className="font-display text-base text-foreground truncate group-hover:text-candy-pink transition-colors duration-300 capitalize">{item.name}</h3>
          </Link>
          <div className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.2em]">
            {item.subject_type}
          </div>
        </div>

        <div className="flex items-center gap-1 pt-0.5">
          <Link 
            href={`/mascot/${item.id}`}
            className="flex-1 flex items-center justify-center gap-1 h-9 px-2 rounded-lg bg-foreground text-white text-[8px] font-black uppercase tracking-widest hover:bg-candy-pink transition-all shadow-md active:scale-95"
          >
            <Eye size={10} /> Checkout
          </Link>

          <div className="flex gap-1">
            <button
                onClick={onDownload}
                disabled={isPurchasing}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all border ${
                    isOwner 
                    ? "bg-foreground/5 border-transparent text-foreground/40 hover:bg-foreground/10" 
                    : "bg-candy-pink/5 border-candy-pink/20 text-candy-pink hover:bg-candy-pink/10 shadow-sm"
                } ${isPurchasing ? "animate-pulse" : "active:scale-95"}`}
                title={isOwner ? "Download Design" : "Download for 1 Credit"}
                >
                <Download size={14} />
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => onTogglePublished(item.id)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all border ${
                    item.published ? "bg-candy-green/5 border-candy-green/10 text-candy-green hover:bg-candy-green/10" : "bg-foreground/5 border-transparent text-foreground/40 hover:bg-foreground/10"
                  }`}
                  title={item.published ? "Make Private" : "Publish to Showcase"}
                >
                  <Globe size={14} />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 border border-transparent hover:bg-red-100 transition-all active:scale-95"
                  title="Delete Mascot"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
