"use client";

import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";

export function UserAvatar({
  initials,
  size = "md",
}: {
  initials: string;
  size?: "xs" | "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-green-light font-bold text-green",
        size === "xs" && "h-5 w-5 text-[9px]",
        size === "sm" && "h-6 w-6 text-[10px]",
        size === "md" && "h-8 w-8 text-xs"
      )}
    >
      {initials}
    </span>
  );
}

interface UserChipProps {
  name: string;
  initials: string;
  onRemove?: () => void;
  /** Hide the name below `sm` — avatar only (tables on mobile). */
  compactOnMobile?: boolean;
}

export function UserChip({
  name,
  initials,
  onRemove,
  compactOnMobile = false,
}: UserChipProps) {
  return (
    <span
      title={name}
      aria-label={name}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-divider bg-cream-card py-0.5 pl-0.5 text-xs",
        compactOnMobile ? "pr-0.5 sm:pr-1.5" : "pr-1.5"
      )}
    >
      <UserAvatar initials={initials} size="xs" />
      <span
        className={cn(
          "font-medium text-text-primary",
          compactOnMobile && "hidden sm:inline"
        )}
      >
        {name}
      </span>
      {onRemove ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 text-text-muted hover:bg-white hover:text-text-primary"
          aria-label={`Remove ${name}`}
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}
