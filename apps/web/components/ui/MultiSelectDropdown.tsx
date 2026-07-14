"use client";

import { UserAvatar, UserChip } from "@/components/ui/UserChip";
import { cn } from "@/lib/utils/cn";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface MultiSelectOption {
  value: string;
  label: string;
  initials?: string;
  /** Extra searchable text (role, email, etc.) */
  description?: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  showChips?: boolean;
  /** Adds a search field inside the menu */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** `chip` = subtle “+ Assignee” style trigger */
  variant?: "default" | "chip";
  className?: string;
}

const MENU_MAX_HEIGHT = 280;

function getTriggerLabel(
  selected: MultiSelectOption[],
  placeholder: string,
  showChips: boolean
) {
  if (selected.length === 0) return placeholder;
  if (selected.length === 1) return selected[0].label;
  if (showChips) return null;
  return `${selected.length} selected`;
}

export function MultiSelectDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "All",
  showChips = false,
  searchable = false,
  searchPlaceholder = "Search…",
  variant = "default",
  className,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedOptions = options.filter((option) => value.includes(option.value));
  const triggerLabel = getTriggerLabel(selectedOptions, placeholder, showChips);
  const hasSelection = value.length > 0;
  const isChip = variant === "chip";

  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(trimmed) ||
        option.description?.toLowerCase().includes(trimmed)
    );
  }, [options, query]);

  const updateMenuPosition = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < MENU_MAX_HEIGHT && spaceAbove > spaceBelow;
    const width = isChip ? Math.max(rect.width, 288) : Math.max(rect.width, 180);
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);

    setPlacement(openUp ? "top" : "bottom");
    setMenuStyle({
      left,
      width,
      top: openUp ? Math.max(8, rect.top - MENU_MAX_HEIGHT - 6) : rect.bottom + 6,
    });
  }, [isChip]);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, filteredOptions.length, updateMenuPosition]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    if (searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-multiselect-menu]")) return;
      setOpen(false);
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, searchable, updateMenuPosition]);

  function toggleOption(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue]
    );
  }

  const menu =
    open && menuStyle ? (
      <div
        data-multiselect-menu
        role="listbox"
        aria-multiselectable
        style={{
          position: "fixed",
          top: menuStyle.top,
          left: menuStyle.left,
          width: menuStyle.width,
          maxHeight: MENU_MAX_HEIGHT,
          zIndex: 120,
        }}
        className={cn(
          "ui-dropdown-menu",
          placement === "top" ? "origin-bottom" : "origin-top"
        )}
      >
        {searchable ? (
          <div className="shrink-0 border-b border-gray-200 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-input border border-gray-200 bg-white py-1.5 pl-8 pr-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-gray-300"
              />
            </div>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto py-1">
          {filteredOptions.length === 0 ? (
            <p className="px-3 py-3 text-sm text-text-muted">No matches</p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggleOption(option.value)}
                  className="ui-dropdown-option gap-2.5"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-200 bg-white",
                      isSelected &&
                        "border-theme bg-theme text-on-theme"
                    )}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : null}
                  </span>
                  {option.initials ? (
                    <UserAvatar initials={option.initials} size="xs" />
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate whitespace-nowrap",
                        isSelected && "font-semibold"
                      )}
                    >
                      {option.label}
                    </span>
                    {option.description ? (
                      <span className="block truncate text-xs text-text-muted">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    ) : null;

  return (
    <div ref={ref} className={cn("relative", isChip ? "inline-flex" : "", className)}>
      {label && !isChip ? (
        <span className="mb-1 block text-[10px] font-semibold leading-none text-text-muted">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          isChip
            ? "inline-flex h-7 items-center gap-1 rounded-full border border-dashed border-gray-300 bg-white px-2.5 text-xs font-semibold text-text-muted transition-colors hover:border-gray-400 hover:text-text-primary"
            : cn(
                "flex min-h-10 min-w-0 w-full items-center justify-between gap-2 rounded-input border bg-white px-3 text-sm font-medium text-text-primary outline-none ring-0 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 md:min-w-[140px] md:w-auto",
                hasSelection ? "border-gray-300" : "border-gray-200",
                showChips && selectedOptions.length > 0 ? "h-auto py-1.5" : "h-10"
              )
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {isChip ? (
          <>
            <Plus className="h-3.5 w-3.5" />
            <span>{placeholder}</span>
          </>
        ) : showChips && selectedOptions.length > 0 ? (
          <span className="flex flex-1 flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <UserChip
                key={option.value}
                name={option.label}
                initials={option.initials ?? option.label.slice(0, 2).toUpperCase()}
                onRemove={() => toggleOption(option.value)}
              />
            ))}
          </span>
        ) : (
          <span className="truncate">{triggerLabel}</span>
        )}
        {!isChip ? <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" /> : null}
      </button>
      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}
