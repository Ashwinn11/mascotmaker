"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icon3DInline } from "@/components/ui/icon-3d";

interface StudioMixProps {
    existingMascotBase64?: string | null;
    requireAuth: () => boolean;
    onApiError: (res: Response, data: Record<string, unknown>) => boolean;
    onCreditsUpdate: (creditsRemaining?: number) => void;
    onResultChange: (result: string | null) => void;
    onLoadingChange: (loading: boolean) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{children}</p>
);

export function StudioMix({
    existingMascotBase64, requireAuth, onApiError, onCreditsUpdate,
    onResultChange, onLoadingChange,
}: StudioMixProps) {
    const [image1, setImage1] = useState<string | null>(existingMascotBase64 || null);
    const [image1Label, setImage1Label] = useState(existingMascotBase64 ? "Your Mascot" : "");
    const [image2, setImage2] = useState<string | null>(null);
    const [image2Label, setImage2Label] = useState("");
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [imageSize, setImageSize] = useState("1K");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const file1Ref = useRef<HTMLInputElement | null>(null);
    const file2Ref = useRef<HTMLInputElement | null>(null);

    const readFile = (file: File): Promise<string> =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve((e.target?.result as string).split(",")[1]);
            reader.readAsDataURL(file);
        });

    const handleFile1 = async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const b64 = await readFile(file);
        setImage1(b64); setImage1Label(file.name);
    };

    const handleFile2 = async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const b64 = await readFile(file);
        setImage2(b64); setImage2Label(file.name);
    };

    const handleComposite = async () => {
        if (!image1 || !image2 || !prompt.trim()) return;
        if (!requireAuth()) return;
        setLoading(true);
        onLoadingChange(true);
        onResultChange(null);
        try {
            const res = await fetch("/api/mix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image1Base64: image1, image2Base64: image2, prompt: prompt.trim(), aspectRatio, imageSize }),
            });
            const data = await res.json();
            if (!res.ok) { if (!onApiError(res, data)) return; toast.error(data.error || "Failed to composite"); return; }
            onCreditsUpdate(data.creditsRemaining);
            if (data.imageBase64) onResultChange(data.imageBase64);
        } catch { toast.error("Failed to composite. Please try again."); }
        finally { setLoading(false); onLoadingChange(false); }
    };

    const canSubmit = !!image1 && !!image2 && !!prompt.trim();

    const ImageSlot = ({ image, label, slotRef, onFile, onClear, slotNumber, hint }: {
        image: string | null; label: string; slotRef: React.RefObject<HTMLInputElement | null>;
        onFile: (f: File) => void; onClear: () => void; slotNumber: number; hint: string;
    }) => (
        <div className="space-y-1.5 flex-1">
            <SectionLabel>Image {slotNumber}</SectionLabel>
            <div onClick={() => !image && slotRef.current?.click()}
                className={`relative aspect-square w-full overflow-hidden rounded-2xl border-2 transition-all ${image ? "border-candy-pink bg-white cursor-default" : "border-dashed border-border bg-white hover:border-candy-pink/40 cursor-pointer"}`}>
                <input ref={slotRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
                {image ? (
                    <>
                        <img src={`data:image/png;base64,${image}`} alt={label} className="h-full w-full object-contain p-1" />
                        <button onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 text-white text-[10px] font-black hover:bg-black/80 flex items-center justify-center">✕</button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 text-center text-[8px] font-black text-white truncate px-2">{label}</div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-3">
                        <Icon3DInline name="open-folder" size={28} className="text-muted-foreground" />
                        <p className="text-[9px] font-bold text-muted-foreground text-center">{hint}</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-5">

            {/* Two image slots */}
            <div className="space-y-2">
                <SectionLabel>Images to Combine</SectionLabel>
                <div className="flex items-center gap-2 md:gap-3">
                    <ImageSlot image={image1} label={image1Label} slotRef={file1Ref}
                        onFile={handleFile1}
                        onClear={() => { setImage1(null); setImage1Label(""); }}
                        slotNumber={1} hint="Character" />
                    <div className="flex items-center justify-center text-xl md:text-2xl font-black text-muted-foreground/40 mt-6">+</div>
                    <ImageSlot image={image2} label={image2Label} slotRef={file2Ref}
                        onFile={handleFile2}
                        onClear={() => { setImage2(null); setImage2Label(""); }}
                        slotNumber={2} hint="Asset/BG" />
                </div>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
                <SectionLabel>How to combine them</SectionLabel>
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. My mascot holding this coffee cup in a studio setting. Match the style of the mascot."
                    className="min-h-[80px] resize-none rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-candy-green" />
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
                                className="w-full rounded-xl border-2 border-border bg-white px-2 py-1.5 text-xs font-bold focus:border-candy-green focus:outline-none">
                                {["1:1", "16:9", "9:16", "4:3", "3:4"].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Resolution</label>
                            <select value={imageSize} onChange={(e) => setImageSize(e.target.value)}
                                className="w-full rounded-xl border-2 border-border bg-white px-2 py-1.5 text-xs font-bold focus:border-candy-green focus:outline-none">
                                <option value="1K">Standard (1K)</option>
                                <option value="2K">High (2K) +5cr</option>
                                <option value="4K">Ultra (4K) +15cr</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Composite Button */}
            <Button onClick={handleComposite} disabled={!canSubmit || loading}
                className="w-full rounded-[2rem] bg-candy-green py-6 md:py-7 text-sm md:text-lg font-black text-white shadow-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40">
                {loading
                    ? <><span className="mr-2 animate-spin">⏳</span> Compositing...</>
                    : <><Icon3DInline name="artist-palette" size={20} className="mr-1.5 md:mr-2" /> Composite · 15 Credits</>}
            </Button>
        </div>
    );
}
