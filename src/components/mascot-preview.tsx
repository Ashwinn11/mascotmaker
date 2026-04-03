"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";
import { StickerGrid } from "@/components/sticker-grid";
import { downloadFile, downloadBase64, cropSticker } from "@/lib/download";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface MascotPreviewProps {
  mascotBase64: string | null;
  loading?: boolean;
  images?: string[];
  onImagesChange?: (imgs: string[]) => void;
  removeBackground: boolean;
  subjectType: "Character" | "Sticker" | "Logo";
  analysis: string | null;
  animations: { spriteBase64: string; animationBase64: string; action: string }[];
  setAnimations: React.Dispatch<React.SetStateAction<{ spriteBase64: string; animationBase64: string; action: string }[]>>;
}

const LOADING_MESSAGES = [
  "Sculpting with pixels...",
  "Applying digital paint...",
  "Consulting the AI muses...",
  "Perfecting the silhouette...",
  "Studio lighting in progress...",
];

export function MascotPreview({
  mascotBase64,
  loading,
  images,
  removeBackground,
  subjectType,
  analysis,
  animations,
  setAnimations,
}: MascotPreviewProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hoverState, setHoverState] = useState<"mascot" | "pack" | "gif" | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedId, setPublishedId] = useState<number | null>(null);

  const isSticker = subjectType === "Sticker";

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const handlePublish = async () => {
    if (!mascotBase64 || !name) return;
    setPublishing(true);
    try {
      const latestAnim = animations.length > 0 ? animations[animations.length - 1] : null;
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          imageBase64: mascotBase64,
          animationBase64: latestAnim?.animationBase64,
          spriteBase64: latestAnim?.spriteBase64,
          subjectType,
          analysis,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to publish");
        return;
      }
      setPublishedId(data.item.id);
      setPublished(true);
      toast.success("Published to the gallery!");
    } catch {
      toast.error("Failed to publish. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const handleShare = async (id: number) => {
    const url = `${window.location.origin}/mascot/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch (err) {
        if ((err as Error).name !== "AbortError") console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("URL copied!");
    }
  };

  if (loading) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-dashed border-candy-pink/30 bg-white shadow-sm">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-candy-pink/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-candy-pink" style={{ animationDuration: "1s" }} />
            </div>
            <p className="font-display text-sm text-warm-gray">{LOADING_MESSAGES[msgIndex]}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mascotBase64 && (!images || images.length === 0)) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-dashed border-border bg-white/50 text-center flex items-center justify-center p-8">
        <div className="space-y-4">
          <Icon3D name="artist-palette" size="2xl" animated />
          <p className="font-display text-lg text-warm-gray">Your canvas awaits</p>
          <p className="text-sm text-muted-foreground">Describe your vision or upload an image to get started</p>
        </div>
      </div>
    );
  }

  const latestAnim = animations.length > 0 ? animations[animations.length - 1] : null;
  const currentDisplayImage = latestAnim && hoverState !== "mascot" ? latestAnim.spriteBase64 : mascotBase64!;

  return (
    <div className="space-y-5">
      <div className="space-y-4 animate-pop-in">
        {/* Main Preview Frame */}
        <div className={`relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-candy-pink/10 ${removeBackground ? "bg-checkerboard" : "bg-white"}`}>
          {isSticker ? (
            <StickerGrid spriteBase64={currentDisplayImage} removeBackground={removeBackground} />
          ) : (
            <img
              src={
                latestAnim && hoverState === "gif"
                  ? `data:image/gif;base64,${latestAnim.animationBase64}`
                  : `data:image/png;base64,${currentDisplayImage}`
              }
              alt="Preview"
              className="w-full h-full object-contain"
            />
          )}
          
          {/* Action Labels */}
          <div className="absolute top-4 left-4">
            <div className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest backdrop-blur-md">
              {subjectType} {latestAnim && !isSticker ? `• ${latestAnim.action}` : ""}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Primary Download */}
            <button
              onClick={async () => {
                if (isSticker) {
                  const toastId = toast.loading("Preparing stickers...");
                  try {
                    for (let i = 0; i < 9; i++) {
                      const cropped = await cropSticker(`data:image/png;base64,${currentDisplayImage}`, i);
                      downloadBase64(cropped, `sticker-${i + 1}.png`);
                      await new Promise(r => setTimeout(r, 150));
                    }
                    toast.success("Success!", { id: toastId });
                  } catch (e) {
                    toast.error("Failed to crop", { id: toastId });
                  }
                } else {
                  downloadFile(`data:image/png;base64,${currentDisplayImage}`, `${subjectType.toLowerCase()}.png`);
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs font-bold text-warm-gray transition-all hover:border-candy-pink/30 hover:bg-candy-pink/5"
            >
              <Icon3DInline name="sparkles" size={16} />
              {isSticker ? "Download Pack" : `Download ${subjectType}`}
            </button>

            {/* Animation/Secondary Download */}
            {latestAnim && !isSticker && (
              <button
                onMouseEnter={() => setHoverState("gif")}
                onMouseLeave={() => setHoverState(null)}
                onClick={() => downloadFile(`data:image/gif;base64,${latestAnim.animationBase64}`, `mascot-${latestAnim.action}.gif`)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs font-bold text-warm-gray transition-all hover:border-candy-orange/30 hover:bg-candy-orange/5"
              >
                <Icon3DInline name="film-frames" size={16} />
                Download GIF
              </button>
            )}
          </div>

          <Button
            onClick={() => setPublishOpen(true)}
            className="w-full rounded-xl bg-gradient-to-r from-candy-pink to-candy-orange py-6 text-base font-bold text-white shadow-lg shadow-candy-pink/10 active:scale-95 transition-all"
          >
            <Icon3DInline name="sparkles" size={20} className="mr-2" />
            Publish to Gallery
          </Button>
        </div>
      </div>

      {/* Publish Dialog */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="rounded-3xl border-2 border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Publish to Gallery</DialogTitle>
            <DialogDescription>Share your {subjectType.toLowerCase()} with the world!</DialogDescription>
          </DialogHeader>
          
          {published ? (
            <div className="flex flex-col items-center py-6 text-center">
              <Icon3D name="party-popper" size="2xl" className="mb-4 animate-pop-in" />
              <h3 className="font-display text-2xl text-foreground">Live on Gallery!</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-8 max-w-[240px]">
                Your {subjectType.toLowerCase()} has been published.
              </p>
              
              <div className="w-full space-y-3">
                <Button
                  onClick={() => publishedId && handleShare(publishedId)}
                  className="w-full rounded-2xl bg-foreground py-6 font-bold text-white shadow-lg"
                >
                  Share {subjectType}
                </Button>
                <button
                  onClick={() => {
                    if (publishedId) {
                      navigator.clipboard.writeText(`${window.location.origin}/mascot/${publishedId}`);
                      toast.success("URL copied!");
                    }
                  }}
                  className="w-full text-xs font-black uppercase text-muted-foreground hover:text-foreground py-2"
                >
                  Copy Clean Link
                </button>
                <hr className="border-t-2 border-border my-4" />
                <Link
                  href={publishedId ? `/mascot/${publishedId}` : "/gallery"}
                  className="block w-full text-center text-sm font-bold text-candy-pink hover:underline"
                >
                  View on Gallery →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-warm-gray">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Mascot name...`}
                  className="rounded-xl border-2"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-warm-gray">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about it..."
                  className="min-h-[80px] rounded-xl border-2 resize-none"
                />
              </div>
              <DialogFooter className="mt-4">
                <Button
                  disabled={publishing || !name}
                  onClick={handlePublish}
                  className="w-full rounded-xl bg-gradient-to-r from-candy-pink to-candy-orange py-6 text-base font-bold text-white shadow-lg"
                >
                  {publishing ? "Publishing..." : "Publish Now"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
