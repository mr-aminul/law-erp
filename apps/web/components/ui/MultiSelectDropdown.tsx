"use client";

import { UserChip } from "@/components/ui/UserChip";
import { cn } from "@/lib/utils/cn";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
  initials?: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  showChips?: boolean;
  className?: string;
}

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
  className,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOptions = options.filter((option) => value.includes(option.value));
  const triggerLabel = getTriggerLabel(selectedOptions, placeholder, showChips);
  const hasSelection = value.length > 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleOption(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue]
    );
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label ? (
        <span className="mb-1 block text-[10px] font-semibold leading-none text-text-muted">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex min-h-10 min-w-0 w-full items-center justify-between gap-2 rounded-input border bg-white px-3 text-sm font-medium text-text-primary outline-none ring-0 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 md:min-w-[140px] md:w-auto",
          hasSelection
            ? "border-gray-300"
            : "border-gray-200",
          showChips && selectedOptions.length > 0 ? "h-auto py-1.5" : "h-10"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {showChips && selectedOptions.length > 0 ? (
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
        <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-multiselectable
          className="absolute left-0 top-full z-50 mt-1 w-max min-w-full overflow-hidden rounded-input border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleOption(option.value)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-[#eceef1]",
                  isSelected && "bg-cream-card"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-200 bg-white",
                    isSelected &&
                      "border-[var(--color-theme)] bg-[var(--color-theme)] text-white"
                  )}
                >
                  {isSelected ? <Check className="h-3 w-3" /> : null}
                </span>
                <span className={cn("whitespace-nowrap", isSelected && "font-semibold")}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
