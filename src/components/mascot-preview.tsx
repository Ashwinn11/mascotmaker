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
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/10 glass-dark bg-[#141210] shadow-2xl flex items-center justify-center">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-candy-pink/10 to-transparent opacity-50" />
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-candy-pink animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-candy-pink animate-spin" style={{ animationDuration: "1s" }} />
            <div className="absolute inset-2 rounded-full border border-transparent border-b-candy-pink/50 animate-spin-slow" />
          </div>
          <div className="space-y-1 text-center">
            <p className="font-display text-base text-white tracking-wide">{LOADING_MESSAGES[msgIndex]}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Engine V2.5 Active</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mascotBase64 && (!images || images.length === 0)) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-dashed border-white/10 bg-[#1c1916] text-center flex items-center justify-center p-8">
        <div className="space-y-4 opacity-50">
          <Icon3D name="artist-palette" size="2xl" animated />
          <p className="font-display text-xl text-white">Your canvas awaits</p>
          <p className="text-sm text-white/50 font-medium">Describe your vision or upload an image to get started</p>
        </div>
      </div>
    );
  }

  const latestAnim = animations.length > 0 ? animations[animations.length - 1] : null;
  const currentDisplayImage = latestAnim && hoverState !== "mascot" ? latestAnim.spriteBase64 : mascotBase64!;

  return (
    <div className="space-y-5">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="space-y-4"
      >
        {/* Main Preview Frame */}
        <div className={`relative aspect-square w-full overflow-hidden rounded-[2rem] border-2 border-white/5 shadow-2xl glass-dark ${removeBackground ? "bg-checkerboard" : "bg-[#141210]"}`}>
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
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-lg">
              {subjectType}
            </div>
            {latestAnim && !isSticker && (
              <div className="rounded-full bg-candy-pink/20 px-3 py-1.5 text-[10px] font-black text-candy-pink uppercase tracking-widest backdrop-blur-md border border-candy-pink/30 shadow-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-candy-pink animate-pulse" />
                {latestAnim.action}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#1c1916] px-4 py-4 text-xs font-bold text-white/70 transition-all duration-300 hover:text-white hover:border-candy-pink/50 hover:bg-candy-pink/10 shadow-lg shadow-black/20"
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
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#1c1916] px-4 py-4 text-xs font-bold text-white/70 transition-all duration-300 hover:text-candy-yellow hover:border-candy-yellow/50 hover:bg-candy-yellow/10 shadow-lg shadow-black/20"
              >
                <Icon3DInline name="film-frames" size={16} />
                Download GIF
              </button>
            )}
          </div>

          <Button
            onClick={() => setPublishOpen(true)}
            className="w-full rounded-2xl border border-white/10 bg-candy-pink hover:brightness-110 py-6 text-base font-black tracking-wide text-white shadow-glow-coral transition-all duration-300 transform active:scale-[0.98]"
          >
            <Icon3DInline name="sparkles" size={20} className="mr-2" />
            Publish to Gallery
          </Button>
        </div>
      </motion.div>

      {/* Publish Dialog */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="rounded-3xl border border-white/10 bg-[#141210] sm:max-w-md shadow-2xl glass-dark">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-white">Publish to Gallery</DialogTitle>
            <DialogDescription className="text-white/50">Share your {subjectType.toLowerCase()} with the world!</DialogDescription>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            {published ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <Icon3D name="party-popper" size="2xl" className="mb-4" animated />
                <h3 className="font-display text-3xl text-white">Live on Gallery!</h3>
                <p className="text-sm text-white/50 mt-2 mb-8 max-w-[240px]">
                  Your {subjectType.toLowerCase()} has been published.
                </p>
                
                <div className="w-full space-y-3">
                  <Button
                    onClick={() => publishedId && handleShare(publishedId)}
                    className="w-full rounded-xl bg-candy-pink hover:brightness-110 py-6 font-black text-white shadow-glow-coral"
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
                    className="w-full text-xs font-black uppercase text-white/30 hover:text-white py-3 transition-colors"
                  >
                    Copy Clean Link
                  </button>
                  <div className="h-px bg-white/10 w-full my-4" />
                  <Link
                    href={publishedId ? `/mascot/${publishedId}` : "/gallery"}
                    className="block w-full text-center text-sm font-bold text-candy-pink hover:text-white transition-colors"
                  >
                    View on Gallery →
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5 py-2"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/50">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Mascot name...`}
                    className="rounded-xl border border-white/10 bg-[#1c1916] text-white placeholder:text-white/20 focus-visible:ring-candy-pink focus-visible:border-candy-pink"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/50">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about it..."
                    className="min-h-[100px] rounded-xl border border-white/10 bg-[#1c1916] text-white placeholder:text-white/20 resize-none focus-visible:ring-candy-pink focus-visible:border-candy-pink"
                  />
                </div>
                <DialogFooter className="mt-6 sm:justify-center border-t border-white/5 pt-6">
                  <Button
                    disabled={publishing || !name}
                    onClick={handlePublish}
                    className="w-full rounded-xl bg-white text-[#141210] hover:bg-candy-pink hover:text-white hover:shadow-glow-coral py-6 text-base font-black transition-all duration-300"
                  >
                    {publishing ? "Publishing..." : "Publish Now"}
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
