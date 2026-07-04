"use client";

import { ApiStatusBadge } from "@/components/dashboard/ApiStatusBadge";
import { formatLongDate } from "@/lib/utils/formatDate";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const [dateLabel, setDateLabel] = useState<string | null>(null);

  useEffect(() => {
    setDateLabel(subtitle ?? formatLongDate());
  }, [subtitle]);

  return (
    <header className="mb-4 flex items-center justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
          <ApiStatusBadge />
          {dateLabel && (
            <span className="text-sm text-text-muted">{dateLabel}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-card border border-divider/70 bg-white px-2 py-1.5 shadow-sm">
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-input text-text-sec transition-colors hover:bg-cream-card hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red ring-2 ring-white" />
        </button>

        <div className="mx-1 h-6 w-px bg-divider/80" />

        <div className="flex items-center gap-2 pr-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar text-[11px] font-bold text-white">
            AI
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold leading-tight text-text-primary">
              Aminul Islam
            </p>
            <p className="text-[11px] text-text-muted">Managing Partner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
