"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { downloadFile } from "@/lib/download";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon3D } from "@/components/ui/icon-3d";

interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
  image_url: string;
  gif_url: string | null;
  created_at: string;
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
      .then((res) => res.json())
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
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {items.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} onDelete={setDeleteTarget} />
        ))}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="rounded-3xl border-2 border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Delete Mascot?</DialogTitle>
            <DialogDescription>
              &quot;{deleteTarget?.name}&quot; will be permanently removed from the gallery. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border-2"
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  const [hovered, setHovered] = useState(false);

  const downloadUrl = item.gif_url || item.image_url;
  const downloadName = `${item.name.replace(/\s+/g, "-").toLowerCase()}.${item.gif_url ? "gif" : "png"}`;

  return (
    <div
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border-2 border-border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-candy-pink/10 hover:-translate-y-1 animate-pop-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={hovered && item.gif_url ? item.gif_url : item.image_url}
          alt={item.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {item.gif_url && (
          <div className={`absolute top-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white transition-opacity ${hovered ? "opacity-100" : "opacity-0"}`}>
            GIF
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-display text-base text-foreground truncate">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}
        <div className="flex gap-1.5 mt-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(downloadUrl, downloadName);
            }}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-muted py-1.5 text-xs font-bold text-warm-gray transition-colors hover:bg-border"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-muted py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-red-50"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
