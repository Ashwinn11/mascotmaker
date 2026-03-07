"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icon3DInline } from "@/components/ui/icon-3d";

const STYLES = [
    { id: "chibi", label: "Chibi", icon: "artist-palette" as const, prompt: "cute expressive cartoon/chibi style, vibrant colors" },
    { id: "pixar", label: "Pixar", icon: "sparkles" as const, prompt: "3D cinematic Disney Pixar style, soft studio lighting" },
    { id: "retro", label: "Retro", icon: "camera" as const, prompt: "80s photograph style, Kodak film grain, retro vibes" },
    { id: "pop", label: "Pop Art", icon: "magic-wand" as const, prompt: "Pop Art style, thick black outlines, vibrant primary colors, Ben-Day dots" },
    { id: "clay", label: "Clay", icon: "relieved-face" as const, prompt: "claymation style, tactile clay texture, Aardman style" },
];

interface StudioStoryProps {
    existingMascotBase64?: string | null;
    existingAnalysis?: string | null;
    requireAuth: () => boolean;
    onApiError: (res: Response, data: Record<string, unknown>) => boolean;
    onCreditsUpdate: (creditsRemaining?: number) => void;
    onFramesChange: (frames: string[]) => void;
    onLoadingChange: (loading: boolean) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{children}</p>
);

export function StudioStory({
    existingMascotBase64, existingAnalysis,
    requireAuth, onApiError, onCreditsUpdate,
    onFramesChange, onLoadingChange,
}: StudioStoryProps) {
    const [prompt, setPrompt] = useState("");
    const [selectedStyleId, setSelectedStyleId] = useState("chibi");
    const [characterSource, setCharacterSource] = useState<"none" | "mascot" | "upload">("none");
    const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [imageSize, setImageSize] = useState("1K");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentStyle = STYLES.find(s => s.id === selectedStyleId) || STYLES[0];
    const hasMascot = !!existingMascotBase64;
    const useMascot = characterSource === "mascot";

    const calculateCost = () => {
        let cost = 40;
        if (imageSize === "2K") cost += 5;
        else if (imageSize === "4K") cost += 15;
        return cost;
    };

    const handleFileUpload = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setUploadedImageBase64(result.split(",")[1]);
            setUploadedFileName(file.name);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        if (!requireAuth()) return;
        setLoading(true);
        onLoadingChange(true);
        onFramesChange([]);
        try {
            const body: Record<string, unknown> = { prompt: prompt.trim(), style: currentStyle.prompt, aspectRatio, imageSize };
            if (characterSource === "mascot" && existingMascotBase64) {
                body.mascotBase64 = existingMascotBase64;
                body.analysis = existingAnalysis;
            } else if (characterSource === "upload" && uploadedImageBase64) {
                body.mascotBase64 = uploadedImageBase64;
            }
            const res = await fetch("/api/story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) { if (!onApiError(res, data)) return; toast.error(data.error || "Failed to generate story"); return; }
            onCreditsUpdate(data.creditsRemaining);
            if (data.images && data.images.length > 0) onFramesChange(data.images);
            else toast.error("No story frames were generated");
        } catch { toast.error("Failed to generate story. Please try again."); }
        finally { setLoading(false); onLoadingChange(false); }
    };

    return (
        <div className="space-y-5">

            {/* Character Source — same segmented pill as Mascot's Describe/Upload */}
            <div className="space-y-2">
                <SectionLabel>Character</SectionLabel>
                <div className="flex gap-1 rounded-2xl bg-muted p-1">
                    <button onClick={() => setCharacterSource("none")}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${characterSource === "none" ? "bg-foreground text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                        Text Only
                    </button>
                    {hasMascot && (
                        <button onClick={() => setCharacterSource("mascot")}
                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${characterSource === "mascot" ? "bg-foreground text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                            <img src={`data:image/png;base64,${existingMascotBase64}`} className="h-4 w-4 rounded object-contain" alt="mascot" />
                            My Mascot
                        </button>
                    )}
                    <button onClick={() => { setCharacterSource("upload"); fileInputRef.current?.click(); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${characterSource === "upload" ? "bg-foreground text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                        {characterSource === "upload" && uploadedImageBase64
                            ? <><img src={`data:image/png;base64,${uploadedImageBase64}`} className="h-4 w-4 rounded object-cover" alt="uploaded" /> {uploadedFileName.split(".")[0].slice(0, 8)}</>
                            : "Upload Photo"}
                    </button>
                </div>
                {characterSource !== "none" && (
                    <p className="text-[10px] text-muted-foreground">This character will appear consistently across all 8 frames</p>
                )}
            </div>

            {/* Art Style */}
            <div className="space-y-2 relative">
                <SectionLabel>Art Style</SectionLabel>
                <div className="relative">
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                        {STYLES.map((s) => (
                            <button key={s.id} onClick={() => setSelectedStyleId(s.id)}
                                className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all min-w-[70px] ${selectedStyleId === s.id ? "border-candy-blue bg-candy-blue/5" : "border-border bg-white hover:border-candy-blue/20"}`}>
                                <Icon3DInline name={s.icon} size={24} className="md:w-[26px] md:h-[26px]" />
                                <p className={`text-[9px] font-black uppercase ${selectedStyleId === s.id ? "text-candy-blue" : "text-foreground"}`}>{s.label}</p>
                            </button>
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden" />
                </div>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
                <SectionLabel>{useMascot ? "What adventure does your mascot go on?" : "Describe your story or narrative"}</SectionLabel>
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                    placeholder={useMascot
                        ? "e.g. My mascot discovers a lost city, battles a storm, and finds treasure"
                        : "e.g. Two blue jazz musicians in the 1960s music scene, thrilling highs and lows"}
                    className="min-h-[100px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-candy-blue" />
            </div>

            {/* Quality & Options */}
            <div className="rounded-2xl border-2 border-border overflow-hidden">
                <button onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white hover:bg-muted/30 transition-colors">
                    <SectionLabel>Quality & Options</SectionLabel>
                    <span className="text-[10px] font-black text-muted-foreground">{showAdvanced ? "▲" : "▼"}</span>
                </button>
                {showAdvanced && (
                    <div className="p-4 grid grid-cols-2 gap-3 bg-muted/20 border-t-2 border-border">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Aspect Ratio</label>
                            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-full rounded-xl border-2 border-border bg-white px-2 py-1.5 text-xs font-bold focus:border-candy-blue focus:outline-none">
                                {["1:1", "16:9", "9:16", "4:3", "3:4"].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Resolution</label>
                            <select value={imageSize} onChange={(e) => setImageSize(e.target.value)}
                                className="w-full rounded-xl border-2 border-border bg-white px-2 py-1.5 text-xs font-bold focus:border-candy-blue focus:outline-none">
                                <option value="1K">Standard (1K)</option>
                                <option value="2K">High (2K) +5cr</option>
                                <option value="4K">Ultra (4K) +15cr</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <Button onClick={handleGenerate} disabled={!prompt.trim() || loading}
                className="w-full rounded-[2rem] bg-candy-blue py-6 md:py-7 text-sm md:text-lg font-black text-white shadow-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40">
                {loading
                    ? <><span className="animate-spin mr-2">⏳</span> Generating...</>
                    : <><Icon3DInline name="clapper-board" size={20} className="mr-1.5 md:mr-2" /> Generate Story · {calculateCost()} Credits</>}
            </Button>
        </div>
    );
}
