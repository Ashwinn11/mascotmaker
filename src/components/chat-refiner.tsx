"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icon3D } from "@/components/ui/icon-3d";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageBase64?: string;
}

interface ChatRefinerProps {
  mascotBase64: string;
  analysis: string | null;
  // Options inherited from the Create step — not re-asked here
  aspectRatio?: string;
  imageSize?: string;
  removeBackground?: boolean;
  subjectType?: string;
  onMascotUpdate: (imageBase64: string, mascotAnalysis?: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onDone: () => void;
  onApiError: (res: Response, data: Record<string, unknown>) => boolean;
  onCreditsUpdate: (creditsRemaining?: number) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{children}</p>
);

export function ChatRefiner({
  mascotBase64,
  analysis,
  aspectRatio = "1:1",
  imageSize = "2K",
  removeBackground = false,
  subjectType = "Character",
  onMascotUpdate,
  onLoadingChange,
  onDone,
  onApiError,
  onCreditsUpdate,
}: ChatRefinerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    onLoadingChange(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          mascotBase64,
          analysis,
          aspectRatio,
          imageSize,
          removeBackground,
          subjectType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to refine");
        return;
      }
      onCreditsUpdate(data.creditsRemaining);
      if (data.imageBase64) {
        onMascotUpdate(data.imageBase64, data.analysis);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Updated!", imageBase64: data.imageBase64 },
        ]);
      }
    } catch {
      toast.error("Error. Try again.");
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const quickEdits = [
    "Bigger sparklier eyes",
    "Add a tiny top hat",
    "Cool blue palette",
    "Superhero cape",
    "Rosy cheeks",
    "Make it fluffier",
  ];

  const settingsLabel = [
    imageSize !== "2K" ? imageSize : null,
    removeBackground ? "Transp." : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <SectionLabel>Refine</SectionLabel>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 italic">Using: {aspectRatio}</span>
            {settingsLabel && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 italic">· {settingsLabel}</span>}
          </div>
        </div>
        
        {subjectType === "Character" && (
           <Button
             onClick={onDone}
             variant="outline"
             className="h-8 rounded-lg border-white/[0.08] bg-white/[0.02] px-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-[#F5C842]/10 hover:text-[#F5C842] hover:border-[#F5C842]/40 transition-all border shadow-none"
           >
             Animate →
           </Button>
        )}
      </div>

      {/* Messages area - Studio Dark Container */}
      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-black border border-white/[0.06] p-4 min-h-[220px] max-h-[280px] shadow-inner relative group">
        <div className="flex flex-col items-center justify-center p-3 text-center border border-white/[0.04] bg-white/[0.01] rounded-lg mb-2">
          <Icon3D name="sparkles" size="sm" className="mb-2 opacity-50 contrast-150 saturate-0 group-hover:saturate-200 transition-all duration-700" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
            Tweak anything?
          </p>
        </div>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-[11px] font-medium leading-relaxed tracking-tight ${msg.role === "user"
                ? "bg-[#F5C842] text-black shadow-lg shadow-[#F5C842]/10 font-bold"
                : "bg-white/[0.04] text-white/80 border border-white/[0.08]"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] px-4 py-3">
              <div className="flex gap-1.5 grayscale opacity-50">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.15s" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick edit chips - Obsidian Palette */}
      <div className="flex flex-wrap gap-1.5">
        {quickEdits.map((edit) => (
          <button
            key={edit}
            onClick={() => setInput(edit)}
            disabled={loading}
            className="rounded-lg bg-white/[0.02] border border-white/[0.04] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/30 transition-all hover:bg-white/[0.06] hover:text-[#F5C842] hover:border-[#F5C842]/30 active:scale-95 disabled:opacity-20"
          >
            {edit}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {/* Cost label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
          <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Cost: {subjectType === "Sticker" ? 15 : 5} Credits</span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        {/* Input Layer */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-black border border-white/[0.08]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Changes..."
            disabled={loading}
            className="flex-1 bg-transparent px-4 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none disabled:opacity-50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="rounded-lg bg-[#F5C842] hover:bg-[#F5C842] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-black shadow-md hover:brightness-110 active:scale-95 disabled:opacity-10 transition-all"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

