"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icon3DInline } from "@/components/ui/icon-3d";
import { downloadFile } from "@/lib/download";

const STYLES = [
    { id: "chibi", label: "Chibi", desc: "Cute & Cartoon", icon: "artist-palette" as const, prompt: "cute expressive mascot character in a cartoon/chibi style, vibrant colors" },
    { id: "pixar", label: "Pixar", desc: "3D Cinematic", icon: "sparkles" as const, prompt: "3D modeled cinematic mascot character, Disney Pixar style, soft studio lighting, high detail" },
    { id: "game", label: "Game", desc: "Isometric 3D", icon: "classical-building" as const, prompt: "isometric 3D game asset, high-quality game art, detailed isometric perspective" },
    { id: "retro", label: "Retro", desc: "80s Film", icon: "camera" as const, prompt: "mascot character as an 80s photograph, Kodak film grain, retro vibes, slightly faded colors" },
    { id: "pop", label: "Pop Art", desc: "Bold Comic", icon: "magic-wand" as const, prompt: "Pop Art style mascot, thick black outlines, vibrant primary colors, Ben-Day dots" },
    { id: "logo", label: "Logo", desc: "Minimalist", icon: "pencil" as const, prompt: "minimalist vector logo, clean lines, professional branding style, simplistic design" },
    { id: "clay", label: "Clay", desc: "Claymation", icon: "relieved-face" as const, prompt: "mascot character made of clay, claymation style, tactile texture, fingerprints visible, Aardman style" },
];

const SUBJECT_TYPES = [
    { value: "Character", label: "Character", desc: "Full body mascot, head to feet" },
    { value: "Sticker", label: "Sticker", desc: "Die-cut Pop Art sticker" },
    { value: "Logo", label: "Logo", desc: "Minimalist vector icon" },
    { value: "Object", label: "Object", desc: "A single product or item" },
    { value: "Scene", label: "Scene", desc: "A full illustrated scene" },
] as const;

type SubjectType = typeof SUBJECT_TYPES[number]["value"];

interface StudioMascotProps {
    onGenerated: (images: string[], analysis?: string) => void;
    onLoadingChange: (loading: boolean) => void;
    requireAuth: () => boolean;
    onApiError: (res: Response, data: Record<string, unknown>) => boolean;
    onCreditsUpdate: (creditsRemaining?: number) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{children}</p>
);

const DownloadIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export function StudioMascot({ onGenerated, onLoadingChange, requireAuth, onApiError, onCreditsUpdate }: StudioMascotProps) {
    const [inputMode, setInputMode] = useState<"describe" | "upload">("describe");
    const [prompt, setPrompt] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [selectedStyleId, setSelectedStyleId] = useState("chibi");
    const [subjectType, setSubjectType] = useState<SubjectType>("Character");
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [imageSize, setImageSize] = useState("1K");
    const [thinkingLevel, setThinkingLevel] = useState<"Minimal" | "High">("Minimal");
    const [useSearch, setUseSearch] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentStyle = STYLES.find(s => s.id === selectedStyleId) || STYLES[0];

    const calculateCost = () => {
        let cost = 5;
        if (imageSize === "2K") cost += 5;
        else if (imageSize === "4K") cost += 15;
        else if (imageSize === "512px") cost -= 2;
        if (thinkingLevel === "High") cost += 5;
        if (useSearch) cost += 10;
        if (subjectType === "Sticker") cost += 3;
        return Math.max(1, cost);
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && !file) return;
        if (!requireAuth()) return;
        onLoadingChange(true);
        setResult(null);
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    aspectRatio, imageSize, thinkingLevel, useSearch,
                    style: currentStyle.prompt,
                    subjectType,
                    studioMode: "Single",
                }),
            });
            const data = await res.json();
            if (!res.ok) { if (!onApiError(res, data)) return; toast.error(data.error || "Failed"); return; }
            onCreditsUpdate(data.creditsRemaining);
            const images = data.images || (data.imageBase64 ? [data.imageBase64] : []);
            if (images.length > 0) { setResult(images[0]); onGenerated(images, data.analysis); }
        } catch { toast.error("Failed to generate. Please try again."); }
        finally { onLoadingChange(false); }
    };

    const handleStylize = async () => {
        if (!file) return;
        if (!requireAuth()) return;
        onLoadingChange(true);
        setResult(null);
        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("prompt", prompt);
            formData.append("aspectRatio", aspectRatio);
            formData.append("imageSize", imageSize);
            formData.append("thinkingLevel", thinkingLevel);
            formData.append("useSearch", useSearch.toString());
            formData.append("style", currentStyle.prompt);
            formData.append("subjectType", subjectType);
            const res = await fetch("/api/stylize", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) { if (!onApiError(res, data)) return; toast.error(data.error || "Failed"); return; }
            onCreditsUpdate(data.creditsRemaining);
            if (data.imageBase64) { setResult(data.imageBase64); onGenerated([data.imageBase64], data.analysis); }
        } catch { toast.error("Failed to stylize. Please try again."); }
        finally { onLoadingChange(false); }
    };

    const canSubmit = inputMode === "describe" ? !!prompt.trim() : !!file;
    const ACCENT = "candy-pink";

    return (
        <div className="space-y-5">

            {/* Art Style */}
            <div className="space-y-2">
                <SectionLabel>Art Style</SectionLabel>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {STYLES.map((s) => (
                        <button key={s.id} onClick={() => setSelectedStyleId(s.id)}
                            className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all ${selectedStyleId === s.id
                                ? `border-${ACCENT} bg-${ACCENT}/5 shadow-sm`
                                : "border-border bg-white hover:border-candy-pink/20"}`}>
                            <Icon3DInline name={s.icon} size={26} />
                            <p className={`text-[9px] font-black uppercase ${selectedStyleId === s.id ? `text-${ACCENT}` : "text-foreground"}`}>{s.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* What are you creating? */}
            <div className="space-y-2">
                <SectionLabel>What are you creating?</SectionLabel>
                <div className="grid grid-cols-5 gap-1.5">
                    {SUBJECT_TYPES.map((s) => (
                        <button key={s.value} onClick={() => setSubjectType(s.value)} title={s.desc}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${subjectType === s.value
                                ? "border-candy-pink bg-candy-pink/5 text-candy-pink"
                                : "border-border bg-white text-muted-foreground hover:border-candy-pink/20"}`}>
                            <span className="text-[9px] font-black uppercase leading-none">{s.label}</span>
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-muted-foreground">{SUBJECT_TYPES.find(s => s.value === subjectType)?.desc}</p>
            </div>

            {/* Describe or Upload */}
            <div className="space-y-2">
                <div className="flex gap-1 rounded-2xl bg-muted p-1">
                    <button onClick={() => setInputMode("describe")}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${inputMode === "describe" ? "bg-foreground text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                        Describe
                    </button>
                    <button onClick={() => setInputMode("upload")}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${inputMode === "upload" ? "bg-foreground text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                        Upload Photo
                    </button>
                </div>

                {inputMode === "describe" ? (
                    <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Describe your ${currentStyle.label.toLowerCase()}...`}
                        className="min-h-[90px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-candy-pink" />
                ) : (
                    <div
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) setFile(f); }}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex min-h-[90px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${dragOver ? "border-candy-pink bg-candy-pink/5" : file ? "border-candy-green bg-candy-green/5" : "border-border bg-white hover:border-candy-pink/40"}`}>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        {file
                            ? <p className="text-xs font-bold text-candy-green">{file.name} ✓</p>
                            : <div className="text-center"><Icon3DInline name="open-folder" size={24} className="mx-auto mb-1" /><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Drop or click to upload</p></div>
                        }
                    </div>
                )}

                {inputMode === "upload" && file && (
                    <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Optional: describe how to style it..."
                        className="min-h-[60px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm focus:border-candy-pink" />
                )}
            </div>

            {/* Quality & Options */}
            <div className="rounded-2xl border-2 border-border overflow-hidden">
                <button onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white hover:bg-muted/30 transition-colors">
                    <SectionLabel>Quality & Options</SectionLabel>
                    <span className="text-[10px] text-muted-foreground font-black">{showAdvanced ? "▲" : "▼"}</span>
                </button>
                {showAdvanced && (
                    <div className="p-4 grid grid-cols-2 gap-3 bg-muted/20 border-t-2 border-border">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Aspect Ratio</label>
                            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-full rounded-xl border-2 border-border bg-white px-2 py-1.5 text-xs font-bold focus:border-candy-pink focus:outline-none">
                                {["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Resolution</label>
                            <select value={imageSize} onChange={(e) => setImageSize(e.target.value)}
                                className="w-full rounded-xl border-2 border-border bg-white px-2 py-1.5 text-xs font-bold focus:border-candy-pink focus:outline-none">
                                <option value="512px">Low (512px)</option>
                                <option value="1K">Standard (1K)</option>
                                <option value="2K">High (2K) +5cr</option>
                                <option value="4K">Ultra (4K) +15cr</option>
                            </select>
                        </div>
                        <div onClick={() => setThinkingLevel(thinkingLevel === "High" ? "Minimal" : "High")}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-3 py-2 transition-all ${thinkingLevel === "High" ? "border-candy-pink/40 bg-candy-pink/5" : "border-border bg-white hover:bg-muted/30"}`}>
                            <span className="text-[9px] font-black uppercase">Pro Mode <span className="text-muted-foreground">+5cr</span></span>
                            <div className={`h-4 w-7 rounded-full p-0.5 transition-all ${thinkingLevel === "High" ? "bg-candy-pink" : "bg-muted-foreground/30"}`}>
                                <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-all ${thinkingLevel === "High" ? "translate-x-3" : "translate-x-0"}`} />
                            </div>
                        </div>
                        <div onClick={() => setUseSearch(!useSearch)}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-3 py-2 transition-all ${useSearch ? "border-candy-blue/40 bg-candy-blue/5" : "border-border bg-white hover:bg-muted/30"}`}>
                            <span className="text-[9px] font-black uppercase">Search <span className="text-muted-foreground">+10cr</span></span>
                            <div className={`h-4 w-7 rounded-full p-0.5 transition-all ${useSearch ? "bg-candy-blue" : "bg-muted-foreground/30"}`}>
                                <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-all ${useSearch ? "translate-x-3" : "translate-x-0"}`} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <Button onClick={inputMode === "upload" && file ? handleStylize : handleGenerate}
                disabled={!canSubmit}
                className="w-full rounded-[2rem] bg-foreground py-7 text-lg font-black text-white shadow-xl hover:bg-candy-pink transition-all active:scale-[0.98] disabled:opacity-40">
                <Icon3DInline name="sparkles" size={22} className="mr-2" />
                Generate Mascot · {calculateCost()} Credits
            </Button>

            {/* Result preview */}
            {result && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <SectionLabel>Result</SectionLabel>
                        <button onClick={() => downloadFile(`data:image/png;base64,${result}`, "mascot.png")}
                            className="text-[10px] font-black uppercase text-candy-pink hover:underline">
                            Download
                        </button>
                    </div>
                    <div className="relative w-full overflow-hidden rounded-3xl border-4 border-white bg-checkerboard shadow-xl">
                        <img src={`data:image/png;base64,${result}`} alt="Generated mascot" className="w-full h-auto block" />
                        <button onClick={() => downloadFile(`data:image/png;base64,${result}`, "mascot.png")}
                            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-warm-gray shadow-lg backdrop-blur-sm hover:bg-white">
                            <DownloadIcon /> Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
