"use client";

import { openModalLayers } from "@/components/ui/Modal";
import { Scrim } from "@/components/ui/Scrim";
import { cn } from "@/lib/utils/cn";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual emphasis for the confirm action. */
  tone?: "danger" | "default";
  layer?: number;
  className?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  layer = 0,
  className,
}: ConfirmDialogProps) {
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

  const isDanger = tone === "danger";

  const dialog = (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center p-4",
        layer > 0 ? "z-[110]" : "z-[100]"
      )}
      role="presentation"
    >
      <Scrim className="absolute" onClick={onClose} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? "confirm-dialog-desc" : undefined}
        className={cn(
          "confirm-dialog-panel relative z-10 w-full max-w-[360px] rounded-xl bg-white p-6 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.22)]",
          className
        )}
      >
        <h3
          id="confirm-dialog-title"
          className="text-base font-semibold text-text-primary"
        >
          {title}
        </h3>
        {description ? (
          <p
            id="confirm-dialog-desc"
            className="mt-1.5 text-sm leading-relaxed text-text-sec"
          >
            {description}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-gray-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-3",
              isDanger
                ? "bg-red hover:bg-[color-mix(in_srgb,var(--color-red)_85%,black)] focus-visible:ring-red/30"
                : "bg-primary hover:bg-primary/90 focus-visible:ring-ring/40"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(dialog, document.body)
    : null;
}
