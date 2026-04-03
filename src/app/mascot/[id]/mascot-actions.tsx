"use client";

import { useState } from "react";
import { Download, Sparkles, Loader2, Scissors, Share2 } from "lucide-react";
import { toast } from "sonner";
import { downloadFile, downloadBase64, cropSticker } from "@/lib/download";
import Link from "next/link";

interface MascotItem {
  id: number;
  name: string;
  image_url: string;
  gif_url: string | null;
  sticker_url: string | null;
  subject_type: string;
}

export function MascotActions({ item }: { item: MascotItem }) {
  const [downloading, setDownloading] = useState(false);
  
  const isSticker = item.subject_type === "Sticker";
  const isLogo = item.subject_type === "Logo";
  const downloadName = `${item.name.replace(/\s+/g, "-").toLowerCase()}`;

  const handleStickerBatch = async () => {
    if (!item.sticker_url) return;
    setDownloading(true);
    const toastId = toast.loading("Extracting individual stickers...");
    try {
      for (let i = 0; i < 9; i++) {
        const cropped = await cropSticker(item.sticker_url, i);
        downloadBase64(cropped, `${downloadName}-sticker-${i + 1}.png`);
        await new Promise(r => setTimeout(r, 150));
      }
      toast.success("All stickers downloaded!", { id: toastId });
    } catch (err) {
      toast.error("Failed to extract stickers", { id: toastId });
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("URL copied!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => downloadFile(item.image_url, `${downloadName}.png`)}
          className="flex items-center justify-center gap-3 rounded-2xl bg-foreground text-white px-8 py-4 font-black uppercase text-sm hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-foreground/10"
        >
          <Download size={18} />
          {isSticker ? "Download Sprite Sheet" : isLogo ? "Download Logo" : "Download PNG"}
        </button>

        {isSticker && item.sticker_url ? (
          <button
            onClick={handleStickerBatch}
            disabled={downloading}
            className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-candy-blue to-candy-purple text-white px-8 py-4 font-black uppercase text-sm hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
          >
            {downloading ? <Loader2 className="animate-spin" size={18} /> : <Scissors size={18} />}
            {downloading ? "Extracting..." : "Individual Stickers"}
          </button>
        ) : item.gif_url ? (
          <button
            onClick={() => downloadFile(item.gif_url!, `${downloadName}.gif`)}
            className="flex items-center justify-center gap-3 rounded-2xl border-2 border-foreground px-8 py-4 font-black uppercase text-sm hover:bg-foreground/5 transition-all active:scale-95"
          >
            <Download size={18} />
            Download GIF
          </button>
        ) : null}
      </div>

      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-3 rounded-2xl bg-candy-pink/5 px-8 py-4 font-black uppercase text-xs text-candy-pink hover:bg-candy-pink/10 transition-all border-2 border-candy-pink/10"
      >
        <Share2 size={16} />
        Share this {item.subject_type || "Mascot"}
      </button>

      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("URL copied!");
        }}
        className="w-full flex items-center justify-center gap-3 py-2 font-black uppercase text-[10px] text-foreground/30 hover:text-foreground/60 transition-all"
      >
        Copy Direct Link
      </button>

      <hr className="border-t-2 border-foreground/5" />

      {/* Remix / Create CTA */}
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-candy-pink to-candy-orange text-white shadow-xl shadow-candy-pink/10">
        <h3 className="font-display text-2xl uppercase tracking-tight mb-2 italic">Want one like this?</h3>
        <p className="text-white/80 text-sm font-medium mb-6">
          Use our Identity Lock engine to generate consistent characters for your own brand. 
        </p>
        <Link 
          href="/create" 
          className="inline-flex items-center gap-3 rounded-full bg-white text-candy-pink px-8 py-3 text-sm font-black uppercase hover:shadow-xl transition-all active:scale-95"
        >
          <Sparkles size={16} />
          Remix for Free
        </Link>
      </div>
    </div>
  );
}
