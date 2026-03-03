"use client";

import { useState } from "react";
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
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";

interface AnimationItem {
  spriteBase64: string;
  animationBase64: string;
  svgFrames: string[];
  svgAnimated: string;
  action: string;
}

interface AnimationPreviewProps {
  animations: AnimationItem[];
  mascotBase64: string;
}

function downloadSvg(svgContent: string, filename: string) {
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AnimationPreview({ animations, mascotBase64 }: AnimationPreviewProps) {
  const [publishOpen, setPublishOpen] = useState(false);
  const [selectedAnim, setSelectedAnim] = useState<AnimationItem | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    if (!name.trim() || !selectedAnim) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          imageBase64: mascotBase64,
          animationBase64: selectedAnim.animationBase64,
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

  if (animations.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg text-foreground">Your Animations</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {animations.map((anim, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border-2 border-border bg-white shadow-sm transition-all hover:shadow-md animate-pop-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={`data:image/webp;base64,${anim.animationBase64}`}
                alt={`${anim.action} animation`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="p-2.5">
              <p className="text-xs font-bold text-warm-gray capitalize mb-2">{anim.action}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => downloadFile(`data:image/webp;base64,${anim.animationBase64}`, `mascot-${anim.action}.webp`)}
                  className="flex-1 rounded-lg bg-muted py-1.5 text-center text-xs font-bold text-warm-gray transition-colors hover:bg-border"
                >
                  WebP
                </button>
                {anim.svgAnimated && (
                  <button
                    onClick={() => downloadSvg(anim.svgAnimated, `mascot-${anim.action}.svg`)}
                    className="flex-1 rounded-lg bg-gradient-to-r from-candy-blue to-candy-purple py-1.5 text-center text-xs font-bold text-white transition-all hover:brightness-105"
                  >
                    SVG
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedAnim(anim);
                    setPublishOpen(true);
                  }}
                  className="flex-1 rounded-lg bg-gradient-to-r from-candy-pink to-candy-orange py-1.5 text-center text-xs font-bold text-white transition-all hover:brightness-105"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="rounded-3xl border-2 border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Publish to Gallery</DialogTitle>
            <DialogDescription>
              Share your mascot with the world!
            </DialogDescription>
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
                {publishing ? (
                  "Publishing..."
                ) : (
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
    </div>
  );
}
