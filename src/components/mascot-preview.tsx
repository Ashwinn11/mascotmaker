"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";
import { downloadFile } from "@/lib/download";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AnimationItem {
  spriteBase64: string;
  animationBase64: string;
  action: string;
}

interface MascotPreviewProps {
  mascotBase64: string | null;
  animations: AnimationItem[];
  loading: boolean;
}

function downloadBase64(base64: string, filename: string, mimeType: string = "image/png") {
  const byteCharacters = atob(base64);
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

const LOADING_MESSAGES = [
  "Sketching your character...",
  "Adding colors and details...",
  "Polishing the final look...",
  "Almost there...",
];

export function MascotPreview({ mascotBase64, animations, loading }: MascotPreviewProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [hoverState, setHoverState] = useState<"gif" | "pack" | "mascot" | null>(null);

  // Publish state
  const [publishOpen, setPublishOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!loading) {
      setMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const handlePublish = async () => {
    if (!name.trim() || !animations.length || !mascotBase64) return;
    const latest = animations[animations.length - 1];
    setPublishing(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          imageBase64: mascotBase64,
          animationBase64: latest.animationBase64,
          spriteBase64: latest.spriteBase64,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to publish");
        return;
      }
      setPublished(true);
      toast.success("Mascot published to the gallery!");
      setTimeout(() => {
        setPublishOpen(false);
        setPublished(false);
        setName("");
        setDescription("");
      }, 1500);
    } catch {
      toast.error("Failed to publish. Please try again.");
    } finally {
      setPublishing(false);
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
            <p className="font-display text-sm text-warm-gray transition-opacity duration-300">
              {LOADING_MESSAGES[msgIndex]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!mascotBase64) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-dashed border-border bg-white/50">
        <div className="absolute inset-0 flex items-center justify-center bg-dotted">
          <div className="flex flex-col items-center gap-4 text-center px-8 text-warm-gray">
            <Icon3D name="artist-palette" size="2xl" animated />
            <p className="font-display text-lg">Your canvas awaits</p>
            <p className="text-sm text-muted-foreground">Describe a character or upload an image to get started</p>
          </div>
        </div>
      </div>
    );
  }

  // If we have an animation, show the special 3-in-1 featured block
  if (animations.length > 0) {
    const latest = animations[animations.length - 1];
    return (
      <>
        <div className="rounded-3xl border-2 border-candy-pink/20 bg-gradient-to-br from-white to-candy-pink/5 p-5 shadow-sm animate-pop-in">
          <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
            <Icon3DInline name="clapper-board" size={20} />
            Latest Animation
          </h3>

          <div className="space-y-5 flex flex-col items-center">
            {/* Large Preview */}
            <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md">
              <img
                src={
                  hoverState === "pack"
                    ? `data:image/png;base64,${latest.spriteBase64}`
                    : hoverState === "mascot"
                      ? `data:image/png;base64,${mascotBase64}`
                      : `data:image/webp;base64,${latest.animationBase64}`
                }
                alt={`${latest.action} preview`}
                className={`h-full w-full object-contain transition-all duration-300 ${hoverState === "pack" || hoverState === "mascot" ? "scale-95" : "scale-100"}`}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <div className={`rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white transition-opacity ${hoverState === "mascot" ? "opacity-100" : "opacity-40"}`}>
                  MASCOT
                </div>
                <div className={`rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white transition-opacity ${hoverState === "pack" || hoverState === "mascot" ? "opacity-40" : "opacity-100"}`}>
                  GIF
                </div>
                <div className={`rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white transition-opacity ${hoverState === "pack" ? "opacity-100" : "opacity-40"}`}>
                  STICKERS
                </div>
              </div>
            </div>

            {/* 3-in-1 Actions Area */}
            <div className="w-full space-y-3">
              <p className="text-xs font-bold text-warm-gray text-center uppercase tracking-wider">
                Download as:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onMouseEnter={() => setHoverState("mascot")}
                  onMouseLeave={() => setHoverState(null)}
                  onClick={() => downloadFile(`data:image/png;base64,${mascotBase64}`, `mascot-high-res.png`)}
                  className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs font-bold text-warm-gray shadow-sm transition-all hover:border-candy-pink/30 hover:bg-candy-pink/5 active:scale-95"
                >
                  <Icon3DInline name="sparkles" size={16} />
                  Mascot
                </button>
                <button
                  onMouseEnter={() => setHoverState("pack")}
                  onMouseLeave={() => setHoverState(null)}
                  onClick={() => downloadBase64(latest.spriteBase64, `mascot-${latest.action}-pack.png`)}
                  className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs font-bold text-warm-gray shadow-sm transition-all hover:border-candy-blue/30 hover:bg-candy-blue/5 active:scale-95"
                >
                  <Icon3DInline name="artist-palette" size={16} />
                  Stickers
                </button>
                <button
                  onMouseEnter={() => setHoverState("gif")}
                  onMouseLeave={() => setHoverState(null)}
                  onClick={() => downloadFile(`data:image/webp;base64,${latest.animationBase64}`, `mascot-${latest.action}.webp`)}
                  className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-xs font-bold text-warm-gray shadow-sm transition-all hover:border-candy-orange/30 hover:bg-candy-orange/5 active:scale-95"
                >
                  <Icon3DInline name="film-frames" size={16} />
                  Animated
                </button>
              </div>

              <Button
                onClick={() => setPublishOpen(true)}
                className="w-full rounded-xl bg-gradient-to-r from-candy-pink to-candy-orange py-6 text-base font-bold text-white shadow-lg shadow-candy-pink/20 hover:brightness-105 hover:shadow-candy-pink/30 active:scale-[0.98] mt-2"
              >
                <Icon3DInline name="sparkles" size={20} className="mr-2" />
                Publish to Gallery
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
          <DialogContent className="rounded-3xl border-2 border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Publish to Gallery</DialogTitle>
              <DialogDescription>Share your mascot with the world!</DialogDescription>
            </DialogHeader>
            {published ? (
              <div className="flex flex-col items-center py-8">
                <Icon3D name="party-popper" size="2xl" className="mb-3 animate-pop-in" />
                <p className="font-display text-lg text-foreground">Published!</p>
                <p className="text-sm text-muted-foreground mt-1">Your mascot is now in the gallery</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-bold text-warm-gray mb-1 block">Mascot Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Give your mascot a name..."
                    className="rounded-xl border-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-warm-gray mb-1 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your mascot..."
                    className="min-h-[80px] rounded-xl border-2 resize-none"
                  />
                </div>
              </div>
            )}
            {!published && (
              <DialogFooter>
                <Button
                  onClick={handlePublish}
                  disabled={!name.trim() || publishing}
                  className="w-full rounded-xl bg-gradient-to-r from-candy-pink to-candy-orange py-5 text-base font-bold text-white"
                >
                  {publishing ? "Publishing..." : (
                    <>
                      <Icon3DInline name="sparkles" size={18} className="mr-1.5" />
                      Publish
                    </>
                  )}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Default static mascot preview
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-white bg-checkerboard shadow-xl shadow-candy-pink/10 animate-pop-in">
      <img
        src={`data:image/png;base64,${mascotBase64}`}
        alt="Your mascot"
        className="h-full w-full object-contain"
      />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
      <button
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-warm-gray shadow-lg backdrop-blur-sm transition-all hover:bg-white"
        onClick={(e) => {
          e.stopPropagation();
          downloadFile(`data:image/png;base64,${mascotBase64}`, "mascot.png");
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </button>
    </div>
  );
}
