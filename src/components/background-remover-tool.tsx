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
    <div className="w-full max-w-2xl mx-auto space-y-10">
      {/* Upload/Preview Zone */}
      <div 
        className={`relative aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 bg-[#1c1916] flex flex-col items-center justify-center transition-all duration-300 ${!image ? 'hover:border-candy-pink/40 hover:bg-white/5 cursor-pointer group' : ''}`}
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
          <div className="flex flex-col items-center gap-5 opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-24 h-24 rounded-full bg-[#141210] border border-white/10 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-candy-pink/30 transition-all duration-500">
              <Upload size={32} className="text-candy-pink" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-display text-white tracking-wide">Drop your mascot here</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-3">Max 2MB • JPG, PNG, WebP</p>
            </div>
          </div>
        )}

        {image && (
          <div className="absolute inset-2 md:inset-4 p-0 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full h-full relative rounded-[2rem] overflow-hidden border border-white/10 glass-dark bg-checkerboard shadow-2xl">
               <Image 
                src={result || image} 
                alt="Original background to remove" 
                fill 
                className={`object-contain p-4 transition-all duration-500 ${loading ? 'blur-md opacity-40 scale-95' : 'scale-100'}`}
                unoptimized
               />
               
               {loading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-[#0c0a09]/60 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full border border-white/10" />
                            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-candy-pink animate-ping" />
                            <Loader2 className="w-16 h-16 text-candy-pink animate-spin" strokeWidth={1} />
                        </div>
                        <p className="font-display text-lg text-white uppercase tracking-widest animate-pulse">Running AI Magic...</p>
                    </div>
                 </div>
               )}

               {!loading && !result && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); clear(); }}
                    className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-[#141210]/80 border border-white/10 text-white/70 hover:text-white hover:bg-candy-pink hover:border-transparent transition-all duration-300 backdrop-blur-md z-10"
                  >
                    <X size={18} />
                  </button>
               )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {image && !result && !loading && (
          <button
            onClick={removeBg}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-candy-pink px-8 py-5 text-base md:text-lg font-black text-white shadow-glow-coral transition-all duration-300 hover:brightness-110 active:scale-95"
          >
            <WandSparkles size={20} className="text-white" />
            REMOVE BACKGROUND
          </button>
        )}

        {result && (
          <>
            <button
              onClick={downloadImage}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#1c1916] px-8 py-5 text-base md:text-lg font-black text-white shadow-xl transition-all duration-300 hover:bg-white/5 hover:border-candy-pink/50 active:scale-95"
            >
              <Download size={20} className="text-[#5cd85c]" />
              DOWNLOAD PNG
            </button>
            <button
              onClick={clear}
              className="w-full sm:w-auto px-8 py-5 text-sm font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
            >
              TRY ANOTHER
            </button>
          </>
        )}
      </div>
      
      {!session && !image && (
         <div className="flex justify-center">
             <p className="text-center text-[10px] sm:text-xs font-black text-white/40 uppercase tracking-[0.2em] bg-[#1c1916] py-3 px-6 border border-white/5 rounded-full shadow-inner">
                Please sign in to claim your 5 free credits
             </p>
         </div>
      )}

      <PaywallModal 
        open={showPaywall}
        onOpenChange={setShowPaywall}
        type={paywallMode}
        creditsRequired={1}
        creditsRemaining={session?.user?.credits || 0}
      />
    </div>
  );
}
