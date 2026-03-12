"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { downloadFile } from "@/lib/download";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Icon3D } from "@/components/ui/icon-3d";

interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
  image_url: string;
  gif_url: string | null;
  sticker_url: string | null;
  subject_type: string;
  created_at: string;
}

function downloadBase64(base64: string, filename: string, mimeType: string = "image/png") {
  const byteCharacters = atob(base64.includes(",") ? base64.split(",")[1] : base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function cropSticker(spriteUrl: string, index: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = img.width / 3;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      const x = (index % 3) * size;
      const y = Math.floor(index / 3) * size;
      ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = spriteUrl;
  });
}

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    setError(false);
    fetch("/api/gallery")
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
  }, []);

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

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-3xl bg-muted"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Icon3D name="dizzy-face" size="2xl" animated className="mb-4" />
        <h2 className="font-display text-2xl text-foreground mb-2">Failed to Load Gallery</h2>
        <p className="text-muted-foreground max-w-sm mb-6">
          Something went wrong while fetching mascots. Give it another try!
        </p>
        <button
          onClick={fetchItems}
          className="rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:brightness-105 active:scale-[0.98]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Icon3D name="classical-building" size="2xl" animated className="mb-4" />
        <h2 className="font-display text-2xl text-foreground mb-2">No Mascots Yet</h2>
        <p className="text-muted-foreground max-w-sm mb-6">
          The gallery is waiting for its first mascot. Create one and be the first to share!
        </p>
        <Link
          href="/create"
          className="rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:brightness-105 active:scale-[0.98]"
        >
          Create a Mascot
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 sm:columns-3 lg:columns-4">
        {items.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} onDelete={setDeleteTarget} />
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Mascot?"
        description={`"${deleteTarget?.name}" will be permanently removed from the gallery. This cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

function GalleryCard({
  item,
  index,
  onDelete,
}: {
  item: GalleryItem;
  index: number;
  onDelete: (item: GalleryItem) => void;
}) {
  const [previewMode, setPreviewMode] = useState<"image" | "gif" | "sticker">("image");
  const [downloading, setDownloading] = useState(false);

  const isSticker = item.subject_type === "Sticker";
  const isLogo = item.subject_type === "Logo";
  const downloadName = `${item.name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border-2 border-border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-candy-pink/10 hover:-translate-y-1 animate-pop-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseLeave={() => setPreviewMode("image")}
    >
      <div className="relative aspect-square overflow-hidden bg-white hover:cursor-pointer">
        <img
          src={previewMode === "gif" && item.gif_url ? item.gif_url : previewMode === "sticker" && item.sticker_url ? item.sticker_url : item.image_url}
          alt={item.name}
          className={`h-full w-full object-contain transition-all duration-300 ${previewMode === "sticker" ? "scale-95" : "scale-100"}`}
        />
        {(item.gif_url || item.sticker_url) && (
          <div className="absolute top-3 right-3 flex gap-1">
            {item.gif_url && (
              <div className={`rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white transition-opacity ${previewMode === "gif" ? "opacity-100" : "opacity-40"}`}>
                ANIM
              </div>
            )}
            {item.sticker_url && (
              <div className={`rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white transition-opacity ${previewMode === "sticker" ? "opacity-100" : "opacity-40"}`}>
                STICKERS
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-3 md:p-3.5">
        <h3 className="font-display text-sm md:text-base text-foreground truncate">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 text-[10px] md:text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {!isSticker && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(item.image_url, `${downloadName}.png`);
              }}
              className="flex-1 min-w-[60px] flex items-center justify-center gap-1 rounded-lg bg-muted py-1.5 text-[9px] font-bold text-warm-gray transition-colors hover:bg-border"
            >
              {isLogo ? "Logo" : "Mascot"}
            </button>
          )}
          {item.gif_url && !isSticker && (
            <button
              onMouseEnter={() => setPreviewMode("gif")}
              onMouseLeave={() => setPreviewMode("image")}
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(item.gif_url!, `${downloadName}.gif`);
              }}
              className="flex-1 min-w-[60px] flex items-center justify-center gap-1 rounded-lg bg-muted py-1.5 text-[9px] font-bold text-warm-gray transition-colors hover:bg-border"
            >
              Animated
            </button>
          )}
          {isSticker && item.sticker_url && (
            <button
              onMouseEnter={() => setPreviewMode("sticker")}
              onMouseLeave={() => setPreviewMode("image")}
              disabled={downloading}
              onClick={async (e) => {
                e.stopPropagation();
                setDownloading(true);
                const toastId = toast.loading("Preparing stickers...");
                try {
                  for (let i = 0; i < 9; i++) {
                    const cropped = await cropSticker(item.sticker_url!, i);
                    downloadBase64(cropped, `${downloadName}-${i + 1}.png`);
                    await new Promise(r => setTimeout(r, 150));
                  }
                  toast.success("Downloaded!", { id: toastId });
                } catch (err) {
                  toast.error("Failed to extract stickers", { id: toastId });
                  console.error(err);
                } finally {
                  setDownloading(false);
                }
              }}
              className="flex-1 min-w-[60px] flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-candy-blue/80 to-candy-purple/80 py-1.5 text-[9px] font-bold text-white transition-all hover:brightness-105 disabled:opacity-50"
            >
              <span className="truncate">{downloading ? "Working..." : "Download Individual Stickers"}</span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-destructive transition-colors hover:bg-red-100"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
