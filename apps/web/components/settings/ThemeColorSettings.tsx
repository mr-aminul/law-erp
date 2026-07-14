"use client";

import {
  applyThemeColor,
  DEFAULT_THEME_COLOR,
  readThemeColor,
} from "@/lib/theme/brand";
import { useEffect, useRef, useState } from "react";

export function ThemeColorSettings() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState(DEFAULT_THEME_COLOR);

  useEffect(() => {
    setColor(readThemeColor());
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={(e) => {
          const next = applyThemeColor(e.target.value);
          if (next) setColor(next);
        }}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        tabIndex={-1}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Theme color"
        className="group relative flex h-7 w-7 items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      >
        <span
          className="h-full w-full rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] ring-2 ring-white ring-offset-1 ring-offset-gray-200 transition group-hover:ring-offset-gray-300"
          style={{ backgroundColor: color }}
        />
      </button>
    </div>
  );
}
