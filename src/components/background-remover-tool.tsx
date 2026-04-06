"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Download, Loader2, X, RefreshCw, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { PaywallModal } from "@/components/paywall-modal";

export function BackgroundRemoverTool() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallMode, setPaywallMode] = useState<"auth" | "credits">("auth");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, update } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is too large! Please upload an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBg = async () => {
    if (!image) return;
    if (!session) {
      setPaywallMode("auth");
      setShowPaywall(true);
      return;
    }

    if (session.user.credits < 1) {
      setPaywallMode("credits");
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    try {
      const base64Content = image.split(",")[1];
      const res = await fetch("/api/background-remover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Content }),
      });

      if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to remove background");
      }

      const data = await res.json();
      setResult(`data:image/png;base64,${data.image}`);
      
      // Update session to reflect new credit balance
      await update();
      
      toast.success("Background removed successfully!");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "bg-removed-mascot.png";
    link.click();
  };

  const clear = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Upload/Preview Zone */}
      <div 
        className={`relative aspect-video rounded-[3rem] border-4 border-dashed border-foreground/10 bg-white/50 flex flex-col items-center justify-center transition-all ${!image ? 'hover:border-candy-pink/50 cursor-pointer' : ''}`}
        onClick={() => !image && !loading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />

        {!image && (
          <div className="flex flex-col items-center gap-4 py-10 opacity-60 group-hover:opacity-100">
            <div className="w-20 h-20 rounded-full bg-white border-4 border-foreground shadow-[6px_6px_0_#2d2420] flex items-center justify-center">
              <Upload size={32} className="text-candy-pink" />
            </div>
            <div>
              <p className="text-xl font-black uppercase">Drop your mascot here</p>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">Max 2MB • JPG, PNG, WebP</p>
            </div>
          </div>
        )}

        {image && (
          <div className="absolute inset-0 p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden border-4 border-foreground bg-slate-100 checkers">
               <Image 
                src={result || image} 
                alt="Original background to remove" 
                fill 
                className={`object-contain ${loading ? 'blur-sm opacity-50' : ''}`}
                unoptimized
               />
               
               {loading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-candy-pink animate-spin" />
                        <p className="font-black text-foreground uppercase animate-pulse">Running AI Magic...</p>
                    </div>
                 </div>
               )}

               {!loading && !result && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); clear(); }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
                  >
                    <X size={20} />
                  </button>
               )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {image && !result && !loading && (
          <>
              <button
                onClick={removeBg}
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-10 py-5 text-xl font-black text-white shadow-[6px_6px_0_#ff6b9d] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-[0.95]"
              >
                <WandSparkles size={24} className="text-candy-yellow" />
                REMOVE BACKGROUND
              </button>
          </>
        )}

        {result && (
          <>
            <button
              onClick={downloadImage}
              className="inline-flex items-center justify-center gap-3 rounded-full border-4 border-foreground bg-white px-10 py-5 text-xl font-black text-foreground shadow-[6px_6px_0_#2d2420] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
            >
              <Download size={24} className="text-candy-green" />
              DOWNLOAD PNG
            </button>
            <button
              onClick={clear}
              className="px-8 py-5 text-lg font-black uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              TRY ANOTHER
            </button>
          </>
        )}
      </div>
      
      {!session && !image && (
         <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest bg-red-50/50 p-4 border-2 border-red-100 rounded-2xl w-fit mx-auto">
            Please sign in to claim your 5 free credits
         </p>
      )}

      <PaywallModal 
        open={showPaywall}
        onOpenChange={setShowPaywall}
        type={paywallMode}
      />
    </div>
  );
}
