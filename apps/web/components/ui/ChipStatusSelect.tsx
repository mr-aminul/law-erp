"use client";

import { badgeVariants } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const MENU_ITEM_HEIGHT = 34;
const MENU_PADDING = 8;

export interface ChipStatusOption<T extends string = string> {
  value: T;
  label: string;
  variant: BadgeVariant;
}

interface ChipStatusSelectProps<T extends string> {
  value: T;
  options: ChipStatusOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
}

/** Colored chip dropdown — same interaction as CaseStatusSelect on tables. */
export function ChipStatusSelect<T extends string>({
  value,
  options,
  onChange,
  ariaLabel = "Status",
}: ChipStatusSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useLayoutEffect(() => {
    if (!open || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const menuHeight = options.length * MENU_ITEM_HEIGHT + MENU_PADDING;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    setPlacement(openUp ? "top" : "bottom");
    setMenuStyle({
      left: rect.left,
      minWidth: rect.width,
      top: openUp ? rect.top - menuHeight - 6 : rect.bottom + 6,
    });
  }, [open, options.length]);

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
      const menuHeight = options.length * MENU_ITEM_HEIGHT + MENU_PADDING;
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
  }, [open, options.length]);

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
          zIndex: 120,
        }}
        className={cn(
          "ui-dropdown-menu w-max",
          placement === "top" ? "origin-bottom" : "origin-top"
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={option.value === value}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
            className="ui-dropdown-option"
          >
            <span className={cn(badgeVariants({ variant: option.variant }))}>
              {option.label}
            </span>
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
          badgeVariants({ variant: selected?.variant ?? "muted" }),
          "h-7 gap-2 rounded-lg px-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200"
        )}
        aria-label={`${ariaLabel}: ${selected?.label ?? value}. Click to change.`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="whitespace-nowrap">{selected?.label ?? value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
      </button>
      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}
