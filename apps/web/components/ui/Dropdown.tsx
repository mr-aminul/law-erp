"use client";

import { cn } from "@/lib/utils/cn";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  size?: "default" | "sm";
  disabled?: boolean;
  id?: string;
  menuPlacement?: "auto" | "bottom" | "top";
}

const MENU_GAP = 4;

export function Dropdown({
  options,
  value,
  onChange,
  label,
  className,
  size = "default",
  disabled = false,
  id,
  menuPlacement = "bottom",
}: DropdownProps) {
  const fallbackId = useId();
  const triggerId = id ?? fallbackId;
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const usePortal = menuPlacement === "auto";
  const isSmall = size === "sm";

  const updateMenuPosition = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const itemHeight = isSmall ? 28 : 36;
    const menuHeight = options.length * itemHeight + (isSmall ? 4 : 0);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp =
      menuPlacement === "top" ||
      (menuPlacement === "auto" && spaceBelow < menuHeight && spaceAbove > spaceBelow);

    setMenuStyle({
      left: rect.left,
      minWidth: rect.width,
      top: openUp ? rect.top - menuHeight - MENU_GAP : rect.bottom + MENU_GAP,
    });
  }, [isSmall, menuPlacement, options.length]);

  useLayoutEffect(() => {
    if (!open || !usePortal) return;
    updateMenuPosition();
  }, [open, usePortal, updateMenuPosition]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-dropdown-menu]")) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open || !usePortal) return;

    function handleReposition() {
      updateMenuPosition();
    }

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, usePortal, updateMenuPosition]);

  const menuItems = options.map((option) => {
    const isSelected = option.value === value;
    return (
      <button
        key={option.value}
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={() => {
          onChange(option.value);
          setOpen(false);
        }}
        className={cn(
          "flex w-full items-center whitespace-nowrap text-left text-text-primary transition-colors hover:bg-[#eceef1]",
          isSmall ? "gap-2 px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
          isSelected && (isSmall ? "bg-cream-card font-semibold" : "bg-green-light font-semibold text-green")
        )}
      >
        {isSmall ? (
          <>
            <span
              className={cn(
                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border border-divider bg-white",
                isSelected &&
                  "border-[var(--color-theme)] bg-[var(--color-theme)] text-white"
              )}
            >
              {isSelected ? <Check className="h-2.5 w-2.5" /> : null}
            </span>
            <span>{option.label}</span>
          </>
        ) : (
          option.label
        )}
      </button>
    );
  });

  const menu = open ? (
    <div
      data-dropdown-menu
      role="listbox"
      style={
        usePortal && menuStyle
          ? {
              position: "fixed",
              top: menuStyle.top,
              left: menuStyle.left,
              minWidth: menuStyle.minWidth,
              width: "max-content",
              zIndex: 50,
            }
          : undefined
      }
      className={cn(
        "w-max border border-divider bg-white shadow-lg",
        isSmall ? "rounded-lg py-1" : "overflow-hidden rounded-input",
        usePortal ? "" : "absolute right-0 top-full z-50 mt-1 min-w-full overflow-hidden"
      )}
    >
      {menuItems}
    </div>
  ) : null;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label ? (
        <span className="mb-1 block text-[10px] font-semibold leading-none text-text-muted">
          {label}
        </span>
      ) : null}
      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center justify-between gap-2 border border-divider bg-white text-text-primary transition-colors focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 disabled:opacity-40",
          isSmall
            ? "h-6 min-w-[2.75rem] rounded-lg px-2 text-xs font-semibold"
            : "h-10 min-w-0 w-full max-w-full rounded-input px-3 text-sm font-medium md:min-w-[140px] md:w-auto"
        )}
      >
        {selected?.label}
        <ChevronDown
          className={cn(
            "shrink-0 text-text-muted",
            isSmall ? "h-3 w-3" : "h-4 w-4"
          )}
        />
      </button>
      {usePortal
        ? typeof document !== "undefined" && menu
          ? createPortal(menu, document.body)
          : null
        : menu}
    </div>
  );
}
