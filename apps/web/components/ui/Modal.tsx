"use client";

import { useSlickScrollbar } from "@/lib/hooks/useSlickScrollbar";
import { cn } from "@/lib/utils/cn";
import { Scrim } from "@/components/ui/Scrim";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

/** ponytail: module stack so nested modals only close the topmost on Escape */
export const openModalLayers: number[] = [];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  /** Higher layers stack above lower ones (default 0). */
  layer?: number;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  layer = 0,
}: ModalProps) {
  const { scrollRef, onScroll, scrollbarClassName, scrollbarOverlay } =
    useSlickScrollbar();

  useEffect(() => {
    if (!open) return;
    openModalLayers.push(layer);
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const top = openModalLayers[openModalLayers.length - 1];
      if (top === layer) onClose();
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      const idx = openModalLayers.lastIndexOf(layer);
      if (idx >= 0) openModalLayers.splice(idx, 1);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, layer]);

  if (!open) return null;

  const modal = (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center p-4",
        layer > 0 ? "z-[110]" : "z-[100]"
      )}
      role="presentation"
    >
      <Scrim className="absolute" onClick={onClose} />
      <div
        ref={scrollRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onScroll={onScroll}
        className={cn(
          "relative z-10 max-h-[min(90dvh,90vh)] w-full max-w-lg overflow-y-auto rounded-card border border-gray-200 bg-white",
          scrollbarClassName,
          className
        )}
      >
        {scrollbarOverlay}
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 id="modal-title" className="min-w-0 text-base font-bold text-text-primary">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-text-muted hover:bg-cream-card hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}
