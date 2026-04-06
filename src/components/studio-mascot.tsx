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
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{children}</p>
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
        <div className="space-y-6">

            {/* Art Style - Hidden in Logo Mode */}
            {subjectType !== "Logo" && (
                <div className="space-y-3 relative animate-in fade-in slide-in-from-top-2 duration-300">
                    <SectionLabel>Art Style</SectionLabel>
                    <div className="relative">
                        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                            {STYLES.map((s) => (
                                <button key={s.id} onClick={() => setSelectedStyleId(s.id)}
                                    className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-[1.25rem] border transition-all duration-300 min-w-[76px] ${selectedStyleId === s.id
                                        ? `border-${ACCENT}/50 bg-${ACCENT}/10 shadow-[0_0_15px_rgba(255,77,28,0.2)]`
                                        : "border-white/5 bg-[#141210] hover:border-candy-pink/30 hover:bg-white/5"}`}>
                                    <Icon3DInline name={s.icon} size={24} className={`md:w-[28px] md:h-[28px] transition-transform ${selectedStyleId === s.id ? "scale-110" : ""}`} />
                                    <p className={`text-[9px] font-black uppercase tracking-wider ${selectedStyleId === s.id ? `text-${ACCENT}` : "text-white/60"}`}>{s.label}</p>
                                </button>
                            ))}
                        </div>
                        {/* Fade indicators for mobile scroll */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0c0a09] to-transparent pointer-events-none md:hidden" />
                    </div>
                </div>
            )}

            {/* What are you creating? */}
            <div className="space-y-3">
                <SectionLabel>What are you creating?</SectionLabel>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {SUBJECT_TYPES.map((s) => (
                        <button key={s.value} onClick={() => setSubjectType(s.value)} title={s.desc}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[48px] rounded-2xl border transition-all duration-300 ${subjectType === s.value
                                ? "border-candy-pink bg-candy-pink/10 text-candy-pink shadow-[0_0_15px_rgba(255,77,28,0.15)]"
                                : "border-white/5 bg-[#141210] text-white/50 hover:border-candy-pink/30 hover:bg-white/5 hover:text-white/80"}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center">{s.label}</span>
                        </button>
                    ))}
                </div>
                <p className="text-[11px] font-medium text-white/40 hidden md:block pt-1">{SUBJECT_TYPES.find(s => s.value === subjectType)?.desc}</p>
            </div>

            {/* Describe or Upload */}
            <div className="space-y-3">
                <div className="flex gap-1 rounded-2xl bg-white/5 p-1 border border-white/[0.04]">
                    <button onClick={() => setInputMode("describe")}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-300 ${inputMode === "describe" ? "bg-[#141210] text-white border border-white/10 shadow-lg" : "text-white/40 hover:text-white"}`}>
                        Describe
                    </button>
                    <button onClick={() => setInputMode("upload")}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-300 ${inputMode === "upload" ? "bg-[#141210] text-white border border-white/10 shadow-lg" : "text-white/40 hover:text-white"}`}>
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
                        className="min-h-[100px] resize-none rounded-2xl border border-white/10 bg-[#1c1916] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-candy-pink focus:ring-1 focus:ring-candy-pink/50 transition-all duration-300 shadow-inner" />
                ) : (
                    <div
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) setFile(f); }}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${dragOver ? "border-candy-pink bg-candy-pink/10" : file ? "border-[#5cd85c]/50 bg-[#5cd85c]/10" : "border-white/10 bg-[#1c1916] hover:border-candy-pink/40 hover:bg-white/5"}`}>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        {file
                            ? <p className="text-xs font-black text-[#5cd85c] px-4 text-center">{file.name} ✓</p>
                            : <div className="text-center opacity-70 group-hover:opacity-100"><Icon3DInline name="open-folder" size={28} className="mx-auto mb-2" /><p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Drop or click to upload</p></div>
                        }
                    </div>
                )}

                {inputMode === "upload" && file && (
                    <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Optional: describe how to style it..."
                        className="min-h-[60px] resize-none rounded-2xl border border-white/10 bg-[#1c1916] px-4 py-3 text-sm text-white focus:border-candy-pink focus:ring-1 focus:ring-candy-pink/50 transition-all duration-300" />
                )}
            </div>

            {/* Quality & Options */}
            {subjectType === "Character" && (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#1c1916] px-4 py-3 shadow-inner">
                    <div className="flex items-center justify-between">
                        <SectionLabel>Transparent Background</SectionLabel>
                        <div onClick={() => setRemoveBackground(!removeBackground)}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border border-white/10 px-3 py-1.5 transition-all duration-300 ${removeBackground ? "border-[#5cd85c]/30 bg-[#5cd85c]/10" : "bg-[#141210] hover:border-candy-pink/30 hover:bg-white/5"}`}>
                            <span className="text-[9px] font-black uppercase text-[#5cd85c] mr-3">
                                Automagic
                            </span>
                            <div className={`h-4 w-7 rounded-full p-0.5 transition-all duration-300 ${removeBackground ? "bg-[#5cd85c]" : "bg-white/20"}`}>
                                <div className={`h-3 w-3 rounded-full shadow-sm transition-all duration-300 ${removeBackground ? "translate-x-3 bg-white" : "translate-x-0 bg-white/60"}`} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Generate Button */}
            <div className="pt-2">
                <Button onClick={inputMode === "upload" && file ? handleStylize : handleGenerate}
                    disabled={!canSubmit}
                    className="w-full rounded-[2rem] bg-candy-pink border border-transparent py-7 text-sm md:text-base font-black text-white shadow-[0_0_20px_rgba(255,77,28,0.3)] hover:brightness-110 hover:shadow-[0_0_30px_rgba(255,77,28,0.5)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100 disabled:shadow-none">
                    <Icon3DInline name="sparkles" size={20} className="mr-2" />
                    GENERATE {subjectType === "Character" ? "MASCOT" : (subjectType === "Sticker" ? "STICKER PACK" : "LOGO")} · {calculateCost()} CREDITS
                </Button>
            </div>

            {/* Result preview */}
            {result && (
                <div className="space-y-3 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <SectionLabel>Result</SectionLabel>
                        <button onClick={() => downloadFile(`data:image/png;base64,${result}`, "mascot.png")}
                            className="text-[10px] font-black uppercase text-candy-pink hover:text-white transition-colors">
                            Download
                        </button>
                    </div>
                    <div className="relative w-full overflow-hidden rounded-[2rem] border-2 border-white/10 bg-checkerboard shadow-2xl glass-dark">
                        <img src={`data:image/png;base64,${result}`} alt="Generated mascot" className="w-full h-auto block" />
                        <button onClick={() => downloadFile(`data:image/png;base64,${result}`, "mascot.png")}
                            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-[#141210]/90 border border-white/10 px-4 py-2.5 text-xs font-black text-white shadow-xl backdrop-blur-md hover:bg-candy-pink hover:text-[#0c0a09] hover:border-transparent transition-all duration-300">
                            <DownloadIcon /> SAVE PNG
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
