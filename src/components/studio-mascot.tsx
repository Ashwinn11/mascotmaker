"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icon3DInline } from "@/components/ui/icon-3d";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FolderOpen, Wand2 } from "lucide-react";
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

export function StudioMascot({ onGenerated, onLoadingChange, requireAuth, onApiError, onCreditsUpdate }: StudioMascotProps) {
    const [inputMode, setInputMode] = useState<"describe" | "upload">("describe");
    const [prompt, setPrompt] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [selectedStyleId, setSelectedStyleId] = useState("chibi");
    const [subjectType, setSubjectType] = useState<SubjectType>("Character");
    const [removeBackground, setRemoveBackground] = useState(false);
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

    return (
        <div className="space-y-5">

            {/* Asset Configuration - High Density */}
            <div className="space-y-2.5">
                <SectionLabel>Asset Configuration</SectionLabel>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black border border-white/[0.06]">
                    {SUBJECT_TYPES.map((s) => (
                        <button 
                            key={s.value} 
                            onClick={() => setSubjectType(s.value)} 
                            title={s.desc}
                            className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all duration-300 ${
                                subjectType === s.value
                                ? "bg-[#F5C842] text-black shadow-md ring-1 ring-[#F5C842]/20"
                                : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Pro Style Palette - Compressed Grid */}
            {subjectType !== "Logo" && (
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <SectionLabel>Style Palette</SectionLabel>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest italic">PRO ENGINE</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                        {STYLES.map((s, idx) => (
                            <motion.button 
                                key={s.id} 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.01, duration: 0.2 }}
                                onClick={() => setSelectedStyleId(s.id)}
                                className={`group relative flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all duration-200 ${
                                    selectedStyleId === s.id
                                    ? "border-[#F5C842] bg-white/[0.08] shadow-sm shadow-[#F5C842]/10"
                                    : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05]"
                                }`}
                            >
                                <div className={`relative transition-all duration-300 ${selectedStyleId === s.id ? "scale-105" : "opacity-60 group-hover:opacity-100"}`}>
                                    <Icon3DInline name={s.icon} size={22} />
                                </div>
                                <p className={`text-[7px] font-black uppercase tracking-tighter text-center leading-tight ${selectedStyleId === s.id ? "text-[#F5C842]" : "text-white/40 group-hover:text-white/60"}`}>
                                    {s.label}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Execution Layer - Mode Selection */}
            <div className="space-y-3.5">
                <div className="flex gap-1 p-1 rounded-xl bg-black border border-white/[0.08]">
                    <button onClick={() => setInputMode("describe")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${inputMode === "describe" ? "bg-[#F5C842] text-black shadow-md" : "text-white/50 hover:text-white/80"}`}>
                        <Wand2 size={10} />
                        Describe
                    </button>
                    <button onClick={() => setInputMode("upload")}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${inputMode === "upload" ? "bg-[#F5C842] text-black shadow-md" : "text-white/50 hover:text-white/80"}`}>
                        <FolderOpen size={10} />
                        Reference
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {inputMode === "describe" ? (
                        <motion.div 
                            key="describe-input"
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            className="relative"
                        >
                            <Textarea 
                                value={prompt} 
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                                placeholder={`Describe your concept...`}
                                className="min-h-[80px] resize-none rounded-lg border border-white/[0.04] bg-[#0c0a09] px-4 py-3 text-xs text-white placeholder:text-white/20 focus:border-[#F5C842]/50 focus:ring-0 transition-all shadow-inner" 
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-input"
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) setFile(f); }}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex min-h-[80px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-300 ${
                                dragOver ? "border-[#F5C842] bg-[#F5C842]/5" : file ? "border-[#5cd85c]/30 bg-white/[0.01]" : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03]"
                            }`}
                        >
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            {file
                                ? <p className="text-[10px] font-black text-[#5cd85c] px-4 text-center tracking-tight italic">{file.name} ✓</p>
                                : <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Visual Input</p>
                            }
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Switch Layer - Compact */}
            {subjectType === "Character" && (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-black border border-white/[0.04] cursor-pointer group hover:bg-white/[0.02] transition-colors" 
                     onClick={() => setRemoveBackground(!removeBackground)}>
                    <SectionLabel>Auto-Masking</SectionLabel>
                    <div className={`h-4 w-7.5 rounded-full p-0.5 transition-all duration-300 ${removeBackground ? "bg-[#F5C842]" : "bg-white/10"}`}>
                        <div className={`h-3 w-3 rounded-full shadow-sm transition-all duration-300 ${removeBackground ? "translate-x-3.5 bg-black" : "translate-x-0 bg-white/40"}`} />
                    </div>
                </div>
            )}

            {/* Primary Action Button - Pure Pro */}
            <div className="pt-0.5">
                <Button 
                    onClick={inputMode === "upload" && file ? handleStylize : handleGenerate}
                    disabled={!canSubmit}
                    className="w-full relative overflow-hidden group rounded-xl bg-[#F5C842] py-6 text-[11px] font-black text-black shadow-[0_20px_50px_-5px_rgba(245,200,66,0.3)] hover:shadow-[0_20px_60px_-5px_rgba(245,200,66,0.4)] active:scale-[0.98] transition-all disabled:opacity-10 hover:brightness-110"
                >
                    <div className="relative flex items-center justify-center gap-2 tracking-[0.2em] uppercase italic">
                        <Sparkles size={13} className="text-black/40 group-hover:rotate-12 transition-transform" />
                        Generate · {calculateCost()}
                    </div>
                </Button>
            </div>
        </div>
    );
}
