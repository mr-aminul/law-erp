"use client";

import { useEffect, useState } from "react";
import { apiFetch, type HealthResponse } from "@/lib/api";

export function ApiStatusBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<HealthResponse>("/health")
      .then(setHealth)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <span className="rounded-badge bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">
        API offline
      </span>
    );
  }

  if (!health) {
    return (
      <span className="rounded-badge bg-cream-card px-2 py-0.5 text-[11px] font-semibold text-text-muted">
        Connecting…
      </span>
    );
  }

  return (
    <span className="rounded-badge bg-green-light px-2 py-0.5 text-[11px] font-semibold text-green">
      API connected
    </span>
  );
}
