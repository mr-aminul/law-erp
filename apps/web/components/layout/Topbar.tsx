"use client";

import { ApiStatusBadge } from "@/components/dashboard/ApiStatusBadge";
import { formatLongDate } from "@/lib/utils/formatDate";
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
    <header className="mb-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {title}
        </h1>
        <ApiStatusBadge />
        {dateLabel && (
          <span className="text-sm text-text-muted">{dateLabel}</span>
        )}
      </div>
    </header>
  );
}
