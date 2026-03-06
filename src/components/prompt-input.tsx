"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icon3DInline } from "@/components/ui/icon-3d";

interface PromptInputProps {
  onGenerated: (imageUrl: string, analysis?: string) => void;
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
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");
  const [thinkingLevel, setThinkingLevel] = useState<"Minimal" | "High">("Minimal");
  const [useSearch, setUseSearch] = useState(false);
  const [subjectType, setSubjectType] = useState<"Character" | "Object" | "Logo" | "Scene">("Character");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedStyleId, setSelectedStyleId] = useState("chibi");

  const STYLES = [
    { id: "chibi", label: "Chibi", desc: "Cute & Cartoon", icon: "artist-palette" as const, prompt: "cute expressive mascot character in a cartoon/chibi style, vibrant colors" },
    { id: "pixar", label: "Pixar", desc: "3D Cinematic", icon: "sparkles" as const, prompt: "3D modeled cinematic mascot character, Disney Pixar style, soft studio lighting, high detail" },
    { id: "game", label: "Game", desc: "Isometric 3D", icon: "classical-building" as const, prompt: "isometric 3D game asset, high-quality game art, detailed isometric perspective" },
    { id: "retro", label: "Retro", desc: "80s Film", icon: "camera" as const, prompt: "mascot character as an 80s photograph, Kodak film grain, retro vibes, slightly faded colors" },
    { id: "pop", label: "Pop Art", desc: "Bold Comic", icon: "magic-wand" as const, prompt: "Pop Art style mascot, thick black outlines, vibrant primary colors, Ben-Day dots" },
    { id: "logo", label: "Logo", desc: "Minimalist", icon: "pencil" as const, prompt: "minimalist vector logo, clean lines, professional branding style, simplistic design" },
    { id: "clay", label: "Clay", desc: "Claymation", icon: "relieved-face" as const, prompt: "mascot character made of clay, claymation style, tactile texture, fingerprints visible, Aardman style" },
  ];

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
          aspectRatio,
          imageSize,
          thinkingLevel,
          useSearch,
          style: currentStyle.prompt,
          subjectType
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to generate mascot");
        return;
      }
      onCreditsUpdate(data.creditsRemaining);
      if (data.imageBase64) onGenerated(data.imageBase64, data.analysis);
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
      formData.append("aspectRatio", aspectRatio);
      formData.append("imageSize", imageSize);
      formData.append("thinkingLevel", thinkingLevel);
      formData.append("useSearch", useSearch.toString());
      formData.append("style", currentStyle.prompt);
      formData.append("subjectType", subjectType);
      const res = await fetch("/api/stylize", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to stylize image");
        return;
      }
      onCreditsUpdate(data.creditsRemaining);
      if (data.imageBase64) onGenerated(data.imageBase64, data.analysis);
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

  const suggestions = [
    "Panda DJ with turntables",
    "Cactus with sneakers",
    "Dragon barista",
    "Cloud cat on rainbow",
  ];

  return (
    <div className="space-y-5">
      {/* Style Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-candy-pink bg-candy-pink/10 px-3 py-1.5 rounded-full border border-candy-pink/20">Studio Style Selection</label>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide no-scrollbar" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyleId(style.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${selectedStyleId === style.id
                ? "border-candy-pink bg-candy-pink/5 shadow-inner scale-[1.02]"
                : "border-border bg-white hover:border-candy-pink/20"
                }`}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform ${selectedStyleId === style.id ? "scale-110" : "group-hover:scale-110"}`}>
                <Icon3DInline name={style.icon} size={32} />
              </div>
              <div className="text-center">
                <p className={`text-[11px] font-black uppercase leading-none transition-colors ${selectedStyleId === style.id ? "text-candy-pink" : "text-foreground"}`}>{style.label}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 font-medium">{style.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-1 rounded-2xl bg-muted p-1">
        <button
          onClick={() => setMode("describe")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold transition-all ${mode === "describe"
            ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-md"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Icon3DInline name="pencil" size={16} />
          Describe
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold transition-all ${mode === "upload"
            ? "bg-gradient-to-r from-candy-blue to-candy-purple text-white shadow-md"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Icon3DInline name="camera" size={16} />
          Upload
        </button>
      </div>

      {mode === "describe" ? (
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe your ${currentStyle.label.toLowerCase()}...`}
              className="min-h-[100px] md:min-h-[120px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-base placeholder:text-muted-foreground/60 focus:border-candy-pink focus:ring-candy-pink/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
            />
            <span className="absolute bottom-2 right-3 hidden md:block text-[10px] text-muted-foreground/50">
              {mounted && typeof navigator !== "undefined" && navigator.platform?.toLowerCase().includes("mac") ? "⌘" : "Ctrl"}+Enter to generate
            </span>
          </div>
          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="rounded-full border-2 border-border bg-white px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold text-warm-gray transition-all hover:border-candy-pink/40 hover:bg-candy-pink/5 hover:text-candy-pink active:scale-95 shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-bold text-warm-gray hover:text-foreground transition-all py-1 active:scale-95"
          >
            <Icon3DInline
              name={showAdvanced ? "counterclockwise" : "magic-wand"}
              size={14}
              className={showAdvanced ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"}
            />
            {showAdvanced ? "Hide Advanced" : "Show Advanced"}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border-2 border-border bg-muted/30 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-candy-pink bg-candy-pink/10 px-2 py-1 rounded-md mb-1 inline-block">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full rounded-xl border-2 border-border bg-white px-3 py-2 text-sm font-semibold focus:border-candy-pink focus:outline-none focus:ring-2 focus:ring-candy-pink/10"
                >
                  {["1:1", "16:9", "9:16", "21:9", "4:3", "3:4", "5:4", "4:5", "3:2", "2:3"].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-candy-blue bg-candy-blue/10 px-2 py-1 rounded-md mb-1 inline-block">Resolution</label>
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full rounded-xl border-2 border-border bg-white px-3 py-2 text-sm font-semibold focus:border-candy-pink focus:outline-none focus:ring-2 focus:ring-candy-pink/10"
                >
                  <option value="512px">Low-Res</option>
                  <option value="1K">Standard (1K)</option>
                  <option value="2K">High-Res (2K)</option>
                  <option value="4K">Ultra-HD (4K)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-candy-purple bg-candy-purple/10 px-2 py-1 rounded-md mb-1 inline-block">Subject</label>
                <select
                  value={subjectType}
                  onChange={(e) => setSubjectType(e.target.value as any)}
                  className="w-full rounded-xl border-2 border-border bg-white px-3 py-2 text-sm font-semibold focus:border-candy-blue focus:outline-none focus:ring-2 focus:ring-candy-blue/10"
                >
                  <option value="Character">Character</option>
                  <option value="Object">Object/Product</option>
                  <option value="Logo">Logo/Icon</option>
                  <option value="Scene">Full Scene</option>
                </select>
              </div>

              <div
                onClick={() => setThinkingLevel(thinkingLevel === "High" ? "Minimal" : "High")}
                className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-3 py-1.5 transition-all ${thinkingLevel === "High"
                  ? "border-candy-pink/40 bg-candy-pink/5 shadow-inner"
                  : "border-border bg-white hover:bg-muted"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Icon3DInline name="high-voltage" size={16} />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold">Pro Mode</span>
                    <span className="text-[9px] text-muted-foreground leading-tight">Deep thinking</span>
                  </div>
                </div>
                <div className={`h-4 w-8 rounded-full p-0.5 transition-all ${thinkingLevel === "High" ? "bg-candy-pink" : "bg-muted-foreground/30"}`}>
                  <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-all ${thinkingLevel === "High" ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </div>

              <div
                onClick={() => setUseSearch(!useSearch)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-3 py-1.5 transition-all ${useSearch
                  ? "border-candy-blue/40 bg-candy-blue/5 shadow-inner"
                  : "border-border bg-white hover:bg-muted"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Icon3DInline name="globe" size={16} />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold">Search</span>
                    <span className="text-[9px] text-muted-foreground leading-tight">Accurate info</span>
                  </div>
                </div>
                <div className={`h-4 w-8 rounded-full p-0.5 transition-all ${useSearch ? "bg-candy-blue" : "bg-muted-foreground/30"}`}>
                  <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-all ${useSearch ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange py-6 text-base font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:shadow-candy-pink/30 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
            >
              <Icon3DInline name="sparkles" size={20} className="mr-1.5" />
              Generate
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>Cost:</span>
              <div className="flex items-center gap-0.5 text-candy-orange bg-candy-orange/10 px-2 py-0.5 rounded-full">
                <Icon3DInline name="high-voltage" size={10} />
                <span>
                  {5 + (imageSize === "2K" ? 5 : imageSize === "4K" ? 15 : imageSize === "512px" ? -2 : 0) + (thinkingLevel === "High" ? 5 : 0) + (useSearch ? 2 : 0)} Credits
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`flex min-h-[120px] md:min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-3 border-dashed transition-all ${dragOver
              ? "border-candy-blue bg-candy-blue/5 scale-[1.02]"
              : file
                ? "border-candy-green bg-candy-green/5"
                : "border-border bg-white hover:border-candy-pink/40 hover:bg-candy-pink/5"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <Icon3DInline name="check-mark" size={36} />
                <p className="text-sm font-semibold text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Icon3DInline name="open-folder" size={36} />
                <p className="text-sm font-semibold text-warm-gray">
                  Drop image or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP (10MB)
                </p>
              </div>
            )}
          </div>
          <Textarea
            value={stylePrompt}
            onChange={(e) => setStylePrompt(e.target.value)}
            placeholder="Style description (optional)..."
            className="min-h-[80px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-candy-blue focus:ring-candy-blue/20"
          />
          <Button
            onClick={handleStylize}
            disabled={!file}
            className="w-full rounded-2xl bg-gradient-to-r from-candy-blue to-candy-purple py-6 text-base font-bold text-white shadow-lg shadow-candy-blue/25 transition-all hover:shadow-xl hover:shadow-candy-blue/30 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            <Icon3DInline name="magic-wand" size={20} className="mr-1.5" />
            Stylize
          </Button>
        </div>
      )}
    </div>
  );
}
