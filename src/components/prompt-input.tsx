"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icon3DInline } from "@/components/ui/icon-3d";
import { STYLES } from "@/lib/prompts";

interface PromptInputProps {
  onGenerated: (images: string[], analysis?: string) => void;
  onLoadingChange: (loading: boolean) => void;
  requireAuth: () => boolean;
  onApiError: (res: Response, data: Record<string, unknown>) => boolean;
  onCreditsUpdate: (creditsRemaining?: number) => void;
}

export function PromptInput({ onGenerated, onLoadingChange, requireAuth, onApiError, onCreditsUpdate }: PromptInputProps) {
  const [mode, setMode] = useState<"describe" | "upload">("describe");
  const [prompt, setPrompt] = useState("");
  const [stylePrompt, setStylePrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [subjectType, setSubjectType] = useState<"Character" | "Sticker" | "Logo">("Character");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [studioMode, setStudioMode] = useState<"Single" | "Story" | "Composite">("Single");
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedStyleId, setSelectedStyleId] = useState("chibi");



  const currentStyle = STYLES.find(s => s.id === selectedStyleId) || STYLES[0];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!requireAuth()) return;
    onLoadingChange(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio: studioMode === "Single" ? "1:1" : aspectRatio,
          imageSize: "1K",
          style: currentStyle.prompt,
          subjectType,
          studioMode,
          removeBackground: subjectType === "Sticker"
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to generate mascot");
        return;
      }
      onCreditsUpdate(data.creditsRemaining);
      if (data.images) onGenerated(data.images, data.analysis);
      else if (data.imageBase64) onGenerated([data.imageBase64], data.analysis);
    } catch {
      toast.error("Failed to generate mascot. Please try again.");
    } finally {
      onLoadingChange(false);
    }
  };

  const handleStylize = async () => {
    if (!file) return;
    if (!requireAuth()) return;
    onLoadingChange(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", stylePrompt);
      formData.append("aspectRatio", studioMode === "Single" ? "1:1" : aspectRatio);
      formData.append("imageSize", "1K");
      formData.append("style", currentStyle.prompt);
      formData.append("subjectType", subjectType);
      formData.append("removeBackground", (subjectType === "Sticker").toString());
      const res = await fetch("/api/stylize", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to stylize image");
        return;
      }
      onCreditsUpdate(data.creditsRemaining);
      if (data.images) onGenerated(data.images, data.analysis);
      else if (data.imageBase64) onGenerated([data.imageBase64], data.analysis);
    } catch {
      toast.error("Failed to stylize image. Please try again.");
    } finally {
      onLoadingChange(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type.startsWith("image/")) setFile(dropped);
  };


  // Cost calculator based on all options
  const calculateCost = () => {
    let baseCost = 5;
    if (studioMode === "Story") baseCost = 40;
    else if (studioMode === "Composite") baseCost = 15;

    return baseCost;
  };

  return (
    <div className="space-y-6">
      {/* Studio Mode Selector (Vibrant Cards) */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: "Single", label: "Single", icon: "sparkles", color: "bg-candy-pink", desc: "1 Asset" },
          { id: "Story", label: "Story", icon: "clapper-board", color: "bg-candy-blue", desc: "8 Frames" },
          { id: "Composite", label: "Mix", icon: "artist-palette", color: "bg-candy-green", desc: "Pro Mesh" }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setStudioMode(m.id as any)}
            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-300 ${studioMode === m.id
              ? `border-foreground ${m.color} text-white shadow-[4px_4px_0_#2d2420] -translate-y-1`
              : "border-border bg-white hover:border-foreground/20 text-muted-foreground"
              }`}
          >
            <div className={`p-1.5 rounded-lg ${studioMode === m.id ? "bg-white/20" : "bg-muted"}`}>
              <Icon3DInline name={m.icon as any} size={20} />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-tighter leading-none">{m.label}</p>
              <p className="text-[8px] opacity-70 font-bold uppercase mt-0.5">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Style Gallery */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-candy-pink bg-candy-pink/10 px-3 py-1.5 rounded-full border border-candy-pink/20">Studio Style</label>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 no-scrollbar">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyleId(style.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${selectedStyleId === style.id
                ? "border-candy-pink bg-candy-pink/5 shadow-inner scale-[1.02]"
                : "border-border bg-white hover:border-candy-pink/20"
                }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform ${selectedStyleId === style.id ? "scale-110" : "group-hover:scale-110"}`}>
                <Icon3DInline name={style.icon} size={28} />
              </div>
              <p className={`text-[10px] font-black uppercase leading-none ${selectedStyleId === style.id ? "text-candy-pink" : "text-foreground"}`}>{style.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle & Input */}
      <div className="space-y-4">
        <div className="flex gap-1 rounded-2xl bg-muted p-1">
          <button
            onClick={() => setMode("describe")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${mode === "describe"
              ? "bg-foreground text-white shadow-md font-black"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Describe
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${mode === "upload"
              ? "bg-foreground text-white shadow-md font-black"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Upload
          </button>
        </div>

        {mode === "describe" ? (
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe your ${currentStyle.label.toLowerCase()}...`}
              className="min-h-[100px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-base placeholder:text-muted-foreground/60 focus:border-candy-pink focus:ring-candy-pink/20"
            />
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-2xl border-3 border-dashed transition-all ${dragOver
              ? "border-candy-blue bg-candy-blue/5 scale-[1.02]"
              : file ? "border-candy-green bg-candy-green/5" : "border-border bg-white hover:border-candy-pink/40"
              }`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {file ? <p className="text-xs font-bold">{file.name}</p> : <div className="text-center"><Icon3DInline name="open-folder" size={24} className="mx-auto mb-1 text-muted-foreground" /><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Drop Image</p></div>}
          </div>
        )}
      </div>

      {/* Dashboard Controls (Always Exposed) */}
      <div className={`grid gap-4 rounded-[2rem] border-2 border-border bg-muted/20 p-5 ${studioMode === "Single" ? "grid-cols-1 max-w-xs mx-auto text-center" : "grid-cols-2"}`}>
        {studioMode !== "Single" && (
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-black uppercase tracking-wider text-candy-pink bg-candy-pink/10 px-2 py-1 rounded-md mb-1 inline-block">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full rounded-xl border-2 border-border bg-white px-3 py-1.5 text-xs font-bold focus:border-candy-pink focus:outline-none"
            >
              {["1:1", "16:9", "9:16", "21:9", "4:3", "3:4", "3:2", "2:3"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        )}

        <div className={`space-y-1.5 ${studioMode === "Single" ? "" : "text-left"}`}>
          <label className="text-[9px] font-black uppercase tracking-wider text-candy-purple bg-candy-purple/10 px-2 py-1 rounded-md mb-1 inline-block">Subject</label>
          <select
            value={subjectType}
            onChange={(e) => setSubjectType(e.target.value as any)}
            className="w-full rounded-xl border-2 border-border bg-white px-3 py-1.5 text-xs font-bold focus:border-candy-purple focus:outline-none"
          >
            <option value="Character">Character</option>
            <option value="Sticker">Pro Sticker</option>
            <option value="Logo">Logo/Icon</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim()}
          className="w-full rounded-[2rem] bg-foreground py-8 text-xl font-black text-white shadow-xl hover:bg-candy-pink transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Icon3DInline name="sparkles" size={24} className="mr-2" />
          GENERATE {studioMode === "Story" ? "STORY" : studioMode === "Composite" ? "MIX" : "ASSET"}
        </Button>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          <span>Cost:</span>
          <span className="text-candy-orange">{calculateCost()} Credits</span>
        </div>
      </div>
    </div>
  );
}
