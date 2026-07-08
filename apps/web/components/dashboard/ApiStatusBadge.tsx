"use client";

import { apiFetch, type HealthResponse } from "@/lib/api";
import { Cloud, CloudOff } from "lucide-react";
import { useEffect, useState } from "react";

export function ApiStatusBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    apiFetch<HealthResponse>("/health")
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  if (!health) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-badge bg-cream-card px-2 py-0.5 text-[11px] font-semibold text-text-muted"
        aria-label="Not connected to server"
      >
        <CloudOff className="h-3 w-3 shrink-0" aria-hidden />
        Not Connected
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-badge bg-green-light px-2 py-0.5 text-[11px] font-semibold text-green"
      aria-label="Connected to server"
    >
      <Cloud className="h-3 w-3 shrink-0" aria-hidden />
      Connected
    </span>
  );
}
