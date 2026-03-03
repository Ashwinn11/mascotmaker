"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icon3D, Icon3DInline } from "@/components/ui/icon-3d";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageBase64?: string;
}

interface ChatRefinerProps {
  mascotBase64: string;
  analysis: string | null;
  onMascotUpdate: (imageBase64: string, mascotAnalysis?: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onDone: () => void;
  onApiError: (res: Response, data: Record<string, unknown>) => boolean;
  onCreditsUpdate: (creditsRemaining?: number) => void;
}

export function ChatRefiner({
  mascotBase64,
  analysis,
  onMascotUpdate,
  onLoadingChange,
  onDone,
  onApiError,
  onCreditsUpdate,
}: ChatRefinerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");
  const [thinkingLevel, setThinkingLevel] = useState<"Minimal" | "High">("Minimal");
  const [useSearch, setUseSearch] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          thinkingLevel,
          useSearch,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to refine");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error. Try again!" },
        ]);
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error. Try again!" },
      ]);
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

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-base md:text-lg text-foreground truncate">Refine</h3>
        <Button
          onClick={onDone}
          variant="outline"
          className="rounded-xl border-2 border-candy-green text-candy-green hover:bg-candy-green/10 font-bold whitespace-nowrap"
          size="sm"
        >
          {mounted && typeof window !== "undefined" && window.innerWidth < 640 ? "Done" : "Finishing"} →
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white/50 p-4 border-2 border-border mb-3 max-h-60 sm:max-h-[320px]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon3D name="sparkles" size="xl" className="mb-3" />
            <p className="text-sm font-semibold text-warm-gray">
              Tweak anything?
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user"
                ? "bg-gradient-to-r from-candy-pink to-candy-orange text-white rounded-br-md"
                : "bg-white border-2 border-border text-foreground rounded-bl-md"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-white border-2 border-border px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-candy-pink animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-candy-orange animate-bounce" style={{ animationDelay: "0.15s" }} />
                <div className="h-2 w-2 rounded-full bg-candy-yellow animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick edit chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {quickEdits.map((edit) => (
          <button
            key={edit}
            onClick={() => setInput(edit)}
            disabled={loading}
            className="rounded-full bg-white border-2 border-border px-2 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs font-semibold text-warm-gray transition-all hover:border-candy-pink/40 hover:bg-candy-pink/5 active:scale-95 disabled:opacity-50"
          >
            {edit}
          </button>
        ))}
      </div>

      <div className="border-t border-border pt-3 mt-auto">
        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mb-2 flex items-center gap-2 text-[10px] font-bold text-warm-gray hover:text-foreground transition-all py-1 active:scale-95"
        >
          <Icon3DInline
            name={showAdvanced ? "counterclockwise" : "magic-wand"}
            size={12}
            className={showAdvanced ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"}
          />
          {showAdvanced ? "Hide Advanced" : "Advanced"}
        </button>

        {showAdvanced && (
          <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border-2 border-border bg-muted/30 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-white px-2 py-1 text-xs font-semibold focus:border-candy-pink focus:outline-none"
              >
                {["1:1", "16:9", "9:16", "21:9", "4:3", "3:4", "5:4", "4:5", "3:2", "2:3"].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Resolution</label>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-white px-2 py-1 text-xs font-semibold focus:border-candy-pink focus:outline-none"
              >
                <option value="512px">Fast</option>
                <option value="1K">Std (1K)</option>
                <option value="2K">High (2K)</option>
                <option value="4K">Ultra (4K)</option>
              </select>
            </div>

            <div
              onClick={() => setThinkingLevel(thinkingLevel === "High" ? "Minimal" : "High")}
              className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-2 py-1 transition-all ${thinkingLevel === "High" ? "border-candy-pink/40 bg-candy-pink/5 shadow-inner" : "bg-white hover:bg-muted"}`}
            >
              <div className="flex items-center gap-1.5">
                <Icon3DInline name="high-voltage" size={14} />
                <span className="text-[10px] font-bold">Pro</span>
              </div>
              <div className={`h-3 w-6 rounded-full p-0.5 transition-all ${thinkingLevel === "High" ? "bg-candy-pink" : "bg-muted-foreground/30"}`}>
                <div className={`h-2 w-2 rounded-full bg-white shadow-sm transition-all ${thinkingLevel === "High" ? "translate-x-3" : "translate-x-0"}`} />
              </div>
            </div>

            <div
              onClick={() => setUseSearch(!useSearch)}
              className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-2 py-1 transition-all ${useSearch ? "border-candy-blue/40 bg-candy-blue/5 shadow-inner" : "bg-white hover:bg-muted"}`}
            >
              <div className="flex items-center gap-1.5">
                <Icon3DInline name="globe" size={14} />
                <span className="text-[10px] font-bold">Search</span>
              </div>
              <div className={`h-3 w-6 rounded-full p-0.5 transition-all ${useSearch ? "bg-candy-blue" : "bg-muted-foreground/30"}`}>
                <div className={`h-2 w-2 rounded-full bg-white shadow-sm transition-all ${useSearch ? "translate-x-3" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex-1 h-[1px] bg-border/50" />
          <div className="flex items-center gap-1 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>Cost: {5 + (imageSize === "2K" ? 5 : imageSize === "4K" ? 15 : imageSize === "512px" ? -2 : 0) + (thinkingLevel === "High" ? 5 : 0) + (useSearch ? 2 : 0)} Cr</span>
          </div>
          <div className="flex-1 h-[1px] bg-border/50" />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Changes..."
            disabled={loading}
            className="flex-1 rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-candy-pink focus:outline-none focus:ring-2 focus:ring-candy-pink/20 disabled:opacity-50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-5 text-white shadow-md hover:brightness-105 active:scale-95 disabled:opacity-50"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
