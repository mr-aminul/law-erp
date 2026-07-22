"use client";

import { cn } from "@/lib/utils/cn";
import {
  applyAppearance,
  DEFAULT_APPEARANCE,
  readAppearance,
  watchSystemAppearance,
  type AppearanceMode,
} from "@/lib/theme/brand";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const OPTIONS: { id: AppearanceMode; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function AppearanceSettings() {
  const [mode, setMode] = useState<AppearanceMode>(DEFAULT_APPEARANCE);

  useEffect(() => {
    setMode(readAppearance());
    return watchSystemAppearance();
  }, []);

  return (
    <div
      className="inline-flex rounded-full bg-muted-bg p-0.5"
      role="group"
      aria-label="Appearance"
    >
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => setMode(applyAppearance(id))}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              active
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
