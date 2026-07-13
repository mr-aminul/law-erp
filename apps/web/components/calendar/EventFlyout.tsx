"use client";

import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/formatDate";
import type { Hearing } from "@/types/hearing";
import { Clock, Gavel, MapPin, Users } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const typeColors: Record<string, "green" | "amber" | "blue"> = {
  "Court Hearing": "green",
  "Filing Deadline": "amber",
  "Internal Meeting": "blue",
};

const GAP = 8;
const CLOSE_MS = 120;

interface EventFlyoutProps {
  hearing: Hearing;
  onOpenCase: (hearing: Hearing) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function EventFlyout({ hearing, onOpenCase, children, className, style }: EventFlyoutProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function show() {
    clearCloseTimer();
    setOpen(true);
  }

  function hide() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_MS);
  }

  const place = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const width = 280;
    const estimatedHeight = 220;
    let left = rect.left;
    let top = rect.bottom + GAP;

    if (left + width > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - width - 8);
    }
    if (top + estimatedHeight > window.innerHeight - 8 && rect.top > estimatedHeight) {
      top = rect.top - estimatedHeight - GAP;
    }

    setPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    function onScrollOrResize() {
      place();
    }
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, place]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <div
      ref={triggerRef}
      className={className}
      style={style}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
      }}
    >
      {children}
      {open &&
        pos &&
        createPortal(
          <div
            role="dialog"
            data-event-flyout
            aria-label={hearing.caseName}
            onMouseEnter={show}
            onMouseLeave={hide}
            className="fixed z-50 w-[280px] overflow-hidden rounded-card border border-gray-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="border-b border-gray-200 px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={typeColors[hearing.type] ?? "muted"}>{hearing.type}</Badge>
                {hearing.adjourned && <Badge variant="amber">Adjourned</Badge>}
              </div>
              <p className="mt-1.5 text-sm font-semibold text-text-primary">{hearing.caseName}</p>
              <p className="mt-0.5 text-xs text-text-sec">{hearing.clientName}</p>
            </div>

            <div className="space-y-1.5 px-3 py-2.5 text-xs text-text-sec">
              <p className="flex items-start gap-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                <span>
                  {formatDate(hearing.date)} · {hearing.time}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                <span>{hearing.courtName}</span>
              </p>
              {hearing.judge && (
                <p className="flex items-start gap-2">
                  <Gavel className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                  <span>{hearing.judge}</span>
                </p>
              )}
              {hearing.assignedLawyers.length > 0 && (
                <p className="flex items-start gap-2">
                  <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                  <span>{hearing.assignedLawyers.join(", ")}</span>
                </p>
              )}
              {hearing.adjournmentReason && (
                <p className="text-amber">Reason: {hearing.adjournmentReason}</p>
              )}
            </div>

            <div className="flex border-t border-gray-200">
              <button
                type="button"
                className="flex-1 px-3 py-2 text-left text-xs font-semibold text-green transition-colors hover:bg-cream-card"
                onClick={() => {
                  setOpen(false);
                  onOpenCase(hearing);
                }}
              >
                Open case
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
