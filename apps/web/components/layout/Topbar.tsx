"use client";

import { ApiStatusBadge } from "@/components/dashboard/ApiStatusBadge";
import { useAppStore } from "@/lib/store/appStore";
import { formatLongDate } from "@/lib/utils/formatDate";
import { Menu, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface TopbarProps {
  title: string;
  icon: LucideIcon;
  subtitle?: string;
}

export function Topbar({ title, icon: Icon, subtitle }: TopbarProps) {
  const toggleMobileNav = useAppStore((s) => s.toggleMobileNav);
  const [dateLabel, setDateLabel] = useState<string | null>(null);

  useEffect(() => {
    setDateLabel(subtitle ?? formatLongDate());
  }, [subtitle]);

  return (
    <header className="shrink-0 border-b border-gray-200 bg-[#f4f5f6] px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleMobileNav}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input border border-gray-200 bg-white text-text-primary transition-colors hover:bg-cream-card lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="flex min-w-0 items-center gap-2 text-base font-bold tracking-tight text-text-primary sm:text-lg">
            <Icon className="hidden h-5 w-5 shrink-0 sm:block" aria-hidden />
            <span className="truncate">{title}</span>
          </h1>
          <ApiStatusBadge />
          {dateLabel ? (
            <span className="ml-auto hidden text-sm text-text-muted sm:inline">
              {dateLabel}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
