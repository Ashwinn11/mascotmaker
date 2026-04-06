"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { PaywallModal } from "@/components/paywall-modal";
import { Download, Sparkles, Loader2, Scissors, Share2, CheckCircle } from "lucide-react";
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
  user_id: string | null;
}

export function MascotActions({ item, isOwner = false, isPurchased = false }: { item: MascotItem, isOwner?: boolean, isPurchased?: boolean }) {
  const { data: session } = useSession();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Paywall Modal State
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallType, setPaywallType] = useState<"auth" | "credits">("auth");
  const [paywallCredits, setPaywallCredits] = useState({ required: 1, remaining: 0 });
  
  const isSticker = item.subject_type === "Sticker";
  const isLogo = item.subject_type === "Logo";
  const downloadName = `${item.name.replace(/\s+/g, "-").toLowerCase()}`;

  const handleDownloadWithCheck = async (type: 'image' | 'gif' | 'sticker') => {
    if (!session) {
      setPaywallType("auth");
      setPaywallOpen(true);
      return;
    }

    const canDownloadFree = isOwner || isPurchased;
    if (canDownloadFree) {
      if (type === 'image') downloadFile(item.image_url, `${downloadName}.png`);
      if (type === 'gif' && item.gif_url) downloadFile(item.gif_url, `${downloadName}.gif`);
      if (type === 'sticker' && item.sticker_url) handleStickerBatch(item.sticker_url);
      return;
    }

    setDownloading(true);
    const toastId = toast.loading(`Unlocking ${item.name}...`);
    try {
      const res = await fetch("/api/gallery/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          toast.dismiss(toastId);
          setPaywallCredits({ required: 1, remaining: data.current || 0 });
          setPaywallType("credits");
          setPaywallOpen(true);
        } else {
          toast.error(data.error || "failed to unlock", { id: toastId });
        }
        return;
      }

      toast.success("Ready to download!", { id: toastId });
      if (type === 'image') downloadFile(data.imageUrl || item.image_url, `${downloadName}.png`);
      if (type === 'gif') downloadFile(data.gifUrl || item.gif_url!, `${downloadName}.gif`);
      if (type === 'sticker') handleStickerBatch(data.stickerUrl || item.sticker_url);
    } catch {
      toast.error("Failed to process unlock", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const handleStickerBatch = async (customUrl?: string | null) => {
    const stickerUrl = customUrl || item.sticker_url;
    if (!stickerUrl) return;
    setDownloading(true);
    const toastId = toast.loading("Extracting individual stickers...");
    try {
      for (let i = 0; i < 9; i++) {
        const cropped = await cropSticker(stickerUrl, i);
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
    if (sharing) return; // Prevent concurrent shares
    const url = window.location.href;
    const title = `Check out this ${item.name} ${item.subject_type || "Mascot"}!`;

    setSharing(true);
    try {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                setSharing(false);
                return;
            } catch (err) {
                if ((err as Error).name === 'AbortError') {
                    setSharing(false);
                    return;
                }
                console.error("Native share failed, falling back:", err);
            }
        }
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
    } catch (err) {
        console.error("Clipboard fallback failed:", err);
        toast.error("Failed to share link");
    } finally {
        setSharing(false);
    }
  };

  return (
    <div className="space-y-6">
      {(isOwner || isPurchased) && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-candy-green/10 border-2 border-candy-green/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
          <CheckCircle size={14} className="text-candy-green" />
          <span className="text-xs font-black uppercase tracking-widest text-candy-green">
            {isOwner ? "Direct Access (Author)" : "Unlocked Lifetime Access"}
          </span>
        </div>
      )}
      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleDownloadWithCheck('image')}
          disabled={downloading}
          className="flex items-center justify-center gap-3 rounded-2xl bg-foreground text-white px-8 py-4 font-black uppercase text-sm hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-foreground/10 disabled:opacity-50"
        >
          {downloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          {isSticker ? "Download Sprite Sheet" : isLogo ? "Download Logo" : "Download PNG"}
        </button>

        {isSticker && item.sticker_url ? (
          <button
            onClick={() => handleDownloadWithCheck('sticker')}
            disabled={downloading}
            className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-candy-blue to-candy-purple text-white px-8 py-4 font-black uppercase text-sm hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
          >
            {downloading ? <Loader2 className="animate-spin" size={18} /> : <Scissors size={18} />}
            {downloading ? "Extracting..." : "Individual Stickers"}
          </button>
        ) : item.gif_url ? (
          <button
            onClick={() => handleDownloadWithCheck('gif')}
            disabled={downloading}
            className="flex items-center justify-center gap-3 rounded-2xl border-2 border-foreground px-8 py-4 font-black uppercase text-sm hover:bg-foreground/5 transition-all active:scale-95 disabled:opacity-50"
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
