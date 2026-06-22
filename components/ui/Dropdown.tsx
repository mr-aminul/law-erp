"use client";

import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
}

export function Dropdown({
  options,
  value,
  onChange,
  label,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && (
        <span className="mb-1 block text-xs font-semibold text-text-sec">
          {label}
        </span>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 min-w-[140px] items-center justify-between gap-2 rounded-input border border-divider bg-white px-3 text-sm font-medium text-text-primary"
      >
        {selected?.label}
        <ChevronDown className="h-4 w-4 text-text-muted" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-full overflow-hidden rounded-input border border-divider bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "block w-full px-3 py-2 text-left text-sm hover:bg-cream-card",
                option.value === value && "bg-green-light font-semibold text-green"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
