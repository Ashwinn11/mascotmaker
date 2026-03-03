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
  onMascotUpdate: (imageBase64: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onDone: () => void;
  onApiError: (res: Response, data: Record<string, unknown>) => boolean;
  onCreditsUpdate: (creditsRemaining?: number) => void;
}

export function ChatRefiner({
  mascotBase64,
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
        body: JSON.stringify({ message: userMsg, mascotBase64 }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!onApiError(res, data)) return;
        toast.error(data.error || "Failed to refine mascot");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Something went wrong. Try again!" },
        ]);
        return;
      }
      onCreditsUpdate(data.creditsRemaining);
      if (data.imageBase64) {
        onMascotUpdate(data.imageBase64);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Here's the updated mascot!", imageBase64: data.imageBase64 },
        ]);
      }
    } catch {
      toast.error("Failed to refine mascot. Please try again.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const quickEdits = [
    "Make the eyes bigger and sparklier",
    "Add a tiny top hat",
    "Switch to a cool blue palette",
    "Give it a superhero cape",
    "Add rosy cheeks",
    "Make it fluffier",
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-base md:text-lg text-foreground truncate">Refine Your Mascot</h3>
        <Button
          onClick={onDone}
          variant="outline"
          className="rounded-xl border-2 border-candy-green text-candy-green hover:bg-candy-green/10 font-bold whitespace-nowrap"
          size="sm"
        >
          {mounted && window.innerWidth < 640 ? "Done" : "Done Refining"} →
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white/50 p-4 border-2 border-border mb-3 max-h-60 sm:max-h-[320px]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon3D name="sparkles" size="xl" className="mb-3" />
            <p className="text-sm font-semibold text-warm-gray">
              Your mascot is looking great! Want to tweak anything?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try the quick edits below or type your own
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

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Describe changes..."
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
  );
}
