"use client";

import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!requireAuth()) return;
    onLoadingChange(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to generate mascot");
        return;
      }
      onCreditsUpdate(data.creditsRemaining);
      if (data.imageBase64) onGenerated(data.imageBase64);
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
    "A round panda DJ with headphones and turntables",
    "A cheerful cactus with sunglasses and sneakers",
    "A tiny dragon barista holding a latte",
    "A fluffy cloud cat floating on a rainbow",
  ];

  return (
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div className="flex gap-1 rounded-2xl bg-muted p-1">
        <button
          onClick={() => setMode("describe")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold transition-all ${mode === "describe"
            ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white shadow-md"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Icon3DInline name="pencil" size={16} className="md:w-[18px] md:h-[18px]" />
          Describe
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold transition-all ${mode === "upload"
            ? "bg-gradient-to-r from-candy-blue to-candy-purple text-white shadow-md"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Icon3DInline name="camera" size={16} className="md:w-[18px] md:h-[18px]" />
          Upload
        </button>
      </div>

      {mode === "describe" ? (
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your dream mascot..."
              className="min-h-[100px] md:min-h-[120px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-base placeholder:text-muted-foreground/60 focus:border-candy-pink focus:ring-candy-pink/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
            />
            <span className="absolute bottom-2 right-3 hidden md:block text-[10px] text-muted-foreground/50">
              {typeof window !== "undefined" && navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"}+Enter to generate
            </span>
          </div>
          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="rounded-full border-2 border-border bg-white px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold text-warm-gray transition-all hover:border-candy-pink/40 hover:bg-candy-pink/5 hover:text-foreground active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange py-6 text-base font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:shadow-candy-pink/30 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            <Icon3DInline name="sparkles" size={20} className="mr-1.5" />
            Generate Mascot
          </Button>
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
                  Drop an image or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            )}
          </div>
          <Textarea
            value={stylePrompt}
            onChange={(e) => setStylePrompt(e.target.value)}
            placeholder="Optional: describe the mascot style you want..."
            className="min-h-[80px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-candy-blue focus:ring-candy-blue/20"
          />
          <Button
            onClick={handleStylize}
            disabled={!file}
            className="w-full rounded-2xl bg-gradient-to-r from-candy-blue to-candy-purple py-6 text-base font-bold text-white shadow-lg shadow-candy-blue/25 transition-all hover:shadow-xl hover:shadow-candy-blue/30 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            <Icon3DInline name="magic-wand" size={20} className="mr-1.5" />
            Transform to Mascot
          </Button>
        </div>
      )}
    </div>
  );
}
