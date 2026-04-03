"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icon3DInline } from "@/components/ui/icon-3d";
import { downloadFile } from "@/lib/download";

import { STYLES, SUBJECT_TYPES, SubjectType } from "@/lib/prompts";

interface StudioMascotProps {
    onGenerated: (images: string[], analysis?: string, options?: any) => void;
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
    const [removeBackground, setRemoveBackground] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentStyle = STYLES.find(s => s.id === selectedStyleId) || STYLES[0];

    const calculateCost = () => {
        if (subjectType === "Sticker") return 15;
        return 5;
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
                    style: currentStyle.prompt,
                    subjectType,
                    studioMode: "Single",
                    removeBackground: subjectType === "Sticker" ? true : (subjectType === "Logo" ? false : removeBackground),
                    aspectRatio: "1:1",
                    imageSize: "2K"
                }),
            });
            const data = await res.json();
            if (!res.ok) { if (!onApiError(res, data)) return; toast.error(data.error || "Failed"); return; }
            onCreditsUpdate(data.creditsRemaining);
            const images = data.images || (data.imageBase64 ? [data.imageBase64] : []);
            if (images.length > 0) {
                setResult(images[0]);
                onGenerated(images, data.analysis, {
                    aspectRatio: "1:1",
                    imageSize: "2K",
                    removeBackground: subjectType === "Sticker" ? true : (subjectType === "Logo" ? false : removeBackground),
                    subjectType
                });
            }
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
            formData.append("removeBackground", (subjectType === "Sticker" ? true : (subjectType === "Logo" ? false : removeBackground)).toString());
            formData.append("style", currentStyle.prompt);
            formData.append("subjectType", subjectType);
            formData.append("aspectRatio", "1:1");
            formData.append("imageSize", "2K");
            const res = await fetch("/api/stylize", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) { if (!onApiError(res, data)) return; toast.error(data.error || "Failed"); return; }
            onCreditsUpdate(data.creditsRemaining);
            if (data.imageBase64) {
                setResult(data.imageBase64);
                onGenerated([data.imageBase64], data.analysis, {
                    aspectRatio: "1:1",
                    imageSize: "2K",
                    removeBackground: subjectType === "Sticker" ? true : (subjectType === "Logo" ? false : removeBackground),
                    subjectType
                });
            }
        } catch { toast.error("Failed to stylize. Please try again."); }
        finally { onLoadingChange(false); }
    };

    const canSubmit = inputMode === "describe" ? !!prompt.trim() : !!file;
    const ACCENT = "candy-pink";

    return (
        <div className="space-y-5">

            {/* Art Style - Hidden in Logo Mode */}
            {subjectType !== "Logo" && (
                <div className="space-y-2 relative animate-in fade-in slide-in-from-top-2 duration-300">
                    <SectionLabel>Art Style</SectionLabel>
                    <div className="relative">
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                            {STYLES.map((s) => (
                                <button key={s.id} onClick={() => setSelectedStyleId(s.id)}
                                    className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all min-w-[70px] ${selectedStyleId === s.id
                                        ? `border-${ACCENT} bg-${ACCENT}/5 shadow-sm`
                                        : "border-border bg-white hover:border-candy-pink/20"}`}>
                                    <Icon3DInline name={s.icon} size={24} className="md:w-[26px] md:h-[26px]" />
                                    <p className={`text-[9px] font-black uppercase ${selectedStyleId === s.id ? `text-${ACCENT}` : "text-foreground"}`}>{s.label}</p>
                                </button>
                            ))}
                        </div>
                        {/* Fade indicators for mobile scroll */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden" />
                    </div>
                </div>
            )}

            {/* What are you creating? */}
            <div className="space-y-2">
                <SectionLabel>What are you creating?</SectionLabel>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-1.5">
                    {SUBJECT_TYPES.map((s) => (
                        <button key={s.value} onClick={() => setSubjectType(s.value)} title={s.desc}
                            className={`flex flex-col items-center justify-center gap-1 p-2 min-h-[40px] rounded-xl border-2 transition-all ${subjectType === s.value
                                ? "border-candy-pink bg-candy-pink/5 text-candy-pink"
                                : "border-border bg-white text-muted-foreground hover:border-candy-pink/20"}`}>
                            <span className="text-[9px] font-black uppercase leading-none text-center">{s.label}</span>
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-muted-foreground hidden md:block">{SUBJECT_TYPES.find(s => s.value === subjectType)?.desc}</p>
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
                        placeholder={
                            subjectType === "Logo"
                                ? "Describe your brand, icon, or vision..."
                                : subjectType === "Sticker"
                                    ? `Describe your ${currentStyle.label.toLowerCase()} stickers...`
                                    : `Describe your ${currentStyle.label.toLowerCase()} mascot...`
                        }
                        className="min-h-[90px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-candy-pink transition-all" />
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
            {subjectType === "Character" && (
                <div className="rounded-2xl border-2 border-border overflow-hidden bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                        <SectionLabel>Transparent Background</SectionLabel>
                        <div onClick={() => setRemoveBackground(!removeBackground)}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-3 py-1.5 transition-all ${removeBackground ? "border-candy-green/40 bg-candy-green/5" : "border-border bg-white hover:bg-muted/30"}`}>
                            <span className="text-[9px] font-black uppercase text-foreground mr-3">
                                Free
                            </span>
                            <div className={`h-4 w-7 rounded-full p-0.5 transition-all ${removeBackground ? "bg-candy-green" : "bg-muted-foreground/30"}`}>
                                <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-all ${removeBackground ? "translate-x-3" : "translate-x-0"}`} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Generate Button */}
            <Button onClick={inputMode === "upload" && file ? handleStylize : handleGenerate}
                disabled={!canSubmit}
                className="w-full rounded-[2rem] bg-foreground py-6 md:py-7 text-sm md:text-lg font-black text-white shadow-xl hover:bg-candy-pink transition-all active:scale-[0.98] disabled:opacity-40">
                <Icon3DInline name="sparkles" size={20} className="mr-1.5 md:mr-2" />
                Generate {subjectType === "Character" ? "Mascot" : (subjectType === "Sticker" ? "Stickers" : "Logo")} · {calculateCost()} Credits
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
