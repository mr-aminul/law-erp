"use client";

import { cn } from "@/lib/utils/cn";
import { CASE_STATUSES, getStatusColorClasses } from "@/lib/utils/caseStatus";
import type { CaseStatus } from "@/types/case";
import { ChevronDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_ITEM_HEIGHT = 34;
const MENU_PADDING = 8;

interface CaseStatusSelectProps {
  status: CaseStatus;
  onChange: (status: CaseStatus) => void;
}

export function CaseStatusSelect({ status, onChange }: CaseStatusSelectProps) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const menuHeight = CASE_STATUSES.length * MENU_ITEM_HEIGHT + MENU_PADDING;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    setPlacement(openUp ? "top" : "bottom");
    setMenuStyle({
      left: rect.left,
      minWidth: rect.width,
      top: openUp ? rect.top - menuHeight - 6 : rect.bottom + 6,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-status-menu]")) return;
      setOpen(false);
    }

    function handleReposition() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const menuHeight = CASE_STATUSES.length * MENU_ITEM_HEIGHT + MENU_PADDING;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

      setPlacement(openUp ? "top" : "bottom");
      setMenuStyle({
        left: rect.left,
        minWidth: rect.width,
        top: openUp ? rect.top - menuHeight - 6 : rect.bottom + 6,
      });
    }

    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const menu =
    open && menuStyle ? (
      <div
        data-status-menu
        role="listbox"
        style={{
          position: "fixed",
          top: menuStyle.top,
          left: menuStyle.left,
          minWidth: menuStyle.minWidth,
          width: "max-content",
          zIndex: 50,
        }}
        className={cn(
          "w-max overflow-hidden rounded-lg border border-divider bg-white shadow-lg",
          placement === "top" ? "origin-bottom" : "origin-top"
        )}
      >
        {CASE_STATUSES.map((option) => (
          <button
            key={option}
            type="button"
            role="option"
            aria-selected={option === status}
            onClick={() => {
              onChange(option);
              setOpen(false);
            }}
            className={cn(
              "block w-full whitespace-nowrap px-3 py-2 text-left text-xs text-text-primary transition-colors hover:bg-[#eceef1]",
              option === status && "bg-cream-card font-semibold"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <div
      ref={ref}
      className="relative inline-flex w-max max-w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7 w-max max-w-full items-center justify-between gap-2 rounded-lg px-2.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green/20",
          getStatusColorClasses(status)
        )}
        aria-label={`Status: ${status}. Click to change.`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="whitespace-nowrap">{status}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
      </button>
      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}
