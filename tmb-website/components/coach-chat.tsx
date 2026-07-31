"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationIdRef = useRef<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          conversationId: conversationIdRef.current,
        }),
      });

      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Something went wrong");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const raw of events) {
          const eventMatch = raw.match(/^event: (\w+)/m);
          const dataMatch = raw.match(/^data: (.*)$/m);
          const eventType = eventMatch?.[1];
          const data = dataMatch?.[1];
          if (!eventType || data === undefined) continue;

          if (eventType === "conversation") {
            conversationIdRef.current = data;
          } else if (eventType === "chunk") {
            const text: string = JSON.parse(data);
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last) last.content += text;
              return next;
            });
          } else if (eventType === "error") {
            throw new Error(JSON.parse(data));
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages((prev) => prev.slice(0, -1)); // remove the empty assistant bubble
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-xl2 border border-surface-line bg-white">
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-muted">
            <Sparkles className="text-gold" size={28} />
            <p className="mt-3 font-heading text-sm font-semibold text-slate-ink">
              Ask about anything in the book
            </p>
            <p className="mt-1 max-w-xs text-xs">
              e.g. &ldquo;Explain the difference between the avalanche and snowball
              debt methods&rdquo; or &ldquo;How do I know if my business idea is
              validated?&rdquo;
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl2 px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald text-white"
                  : "bg-surface-soft text-slate-ink"
              }`}
            >
              {m.content || (
                <Loader2 size={14} className="animate-spin text-slate-muted" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="border-t border-surface-line px-6 py-2 text-xs text-error">
          {error}
        </p>
      )}

      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 border-t border-surface-line p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI Coach..."
          disabled={loading}
          className="flex-1 rounded-full border border-surface-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald text-white disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
