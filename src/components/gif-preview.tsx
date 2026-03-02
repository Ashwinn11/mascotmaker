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

interface GifItem {
  spriteUrl: string;
  gifUrl: string;
  action: string;
}

interface GifPreviewProps {
  gifs: GifItem[];
  mascotImageUrl: string;
}

export function GifPreview({ gifs, mascotImageUrl }: GifPreviewProps) {
  const [publishOpen, setPublishOpen] = useState(false);
  const [selectedGif, setSelectedGif] = useState<GifItem | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    if (!name.trim() || !selectedGif) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          imageUrl: mascotImageUrl,
          gifUrl: selectedGif.gifUrl,
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

  if (gifs.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg text-foreground">Your Animations</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gifs.map((gif, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border-2 border-border bg-white shadow-sm transition-all hover:shadow-md animate-pop-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={gif.gifUrl}
                alt={`${gif.action} animation`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="p-2.5">
              <p className="text-xs font-bold text-warm-gray capitalize mb-2">{gif.action}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => downloadFile(gif.gifUrl, `mascot-${gif.action}.gif`)}
                  className="flex-1 rounded-lg bg-muted py-1.5 text-center text-xs font-bold text-warm-gray transition-colors hover:bg-border"
                >
                  Download
                </button>
                <button
                  onClick={() => {
                    setSelectedGif(gif);
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
