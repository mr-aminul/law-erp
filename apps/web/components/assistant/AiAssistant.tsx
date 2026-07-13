"use client";

import { Button } from "@/components/ui/Button";
import { useSlickScrollbar } from "@/lib/hooks/useSlickScrollbar";
import { cn } from "@/lib/utils/cn";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type ChatRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi — I'm the UKIL.ai assistant. Ask about cases, clients, hearings, or billing.",
};

/** ponytail: canned replies until a real assistant API is wired */
function mockReply(prompt: string): string {
  const q = prompt.toLowerCase();
  if (q.includes("case")) {
    return "You can browse open matters under Cases, or open a case to update status, documents, and hearings.";
  }
  if (q.includes("client")) {
    return "Clients lists every contact. Open a profile to see linked cases, invoices, and communications.";
  }
  if (q.includes("bill") || q.includes("invoice")) {
    return "Billing covers invoices, expenses, and time tracking. Overdue amounts show on the Billing overview.";
  }
  if (q.includes("hearing") || q.includes("calendar")) {
    return "Upcoming hearings live on Calendar. From a case, you can also schedule a hearing directly.";
  }
  return "I can help you navigate cases, clients, calendar, and billing. What would you like to look up?";
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const {
    scrollRef,
    onScroll,
    scrollbarClassName,
    scrollbarOverlay,
  } = useSlickScrollbar();

  const setListRef = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      scrollRef(node);
    },
    [scrollRef]
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBusy(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: mockReply(text),
        },
      ]);
      setBusy(false);
    }, 450);
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[120] flex flex-col items-end gap-3 max-lg:bottom-4 max-lg:right-4">
      {open ? (
        <div
          className="pointer-events-auto flex h-[min(28rem,calc(100dvh-6.5rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-panel border border-gray-300 bg-white shadow-[0_12px_40px_rgb(0_0_0/0.14)]"
          role="dialog"
          aria-label="AI assistant"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 bg-theme px-3 py-2.5 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">UKIL Assistant</p>
              <p className="truncate text-[11px] text-white/75">Ask anything about your firm</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/85 hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={setListRef}
            onScroll={onScroll}
            className={cn("min-h-0 flex-1 space-y-3 overflow-y-auto p-3", scrollbarClassName)}
          >
            {scrollbarOverlay}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "rounded-br-md bg-theme text-white"
                      : "rounded-bl-md bg-theme-subtle text-text-primary"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {busy ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-theme-subtle px-3 py-2 text-sm text-text-muted">
                  Thinking…
                </div>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-gray-200 p-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="h-10 min-w-0 flex-1 rounded-input border border-gray-200 bg-surface px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="Message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || busy}
              aria-label="Send message"
            >
              <Send />
            </Button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme text-white shadow-[0_8px_24px_rgb(26_92_69/0.35)] transition hover:bg-theme-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/40",
          open && "bg-theme-darker"
        )}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}
