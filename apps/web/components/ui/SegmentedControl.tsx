"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

export interface SegmentedItem {
  id: string;
  label: string;
  badge?: ReactNode;
  /** When set, the segment renders as a link instead of a button. */
  href?: string;
}

interface SegmentedControlProps {
  items: SegmentedItem[];
  value: string;
  onChange?: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
  /** Stretch equal-width segments across the container. Default hugs content. */
  fill?: boolean;
}

const sizeClasses = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3 py-1.5 text-xs",
} as const;

/** Full-round split control with a sliding active pill (notification-panel style). */
export function SegmentedControl({
  items,
  value,
  onChange,
  className,
  size = "md",
  fill = false,
}: SegmentedControlProps) {
  const activeIndex = items.findIndex((item) => item.id === value);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);

  // Imperative pill sync — avoids setState ↔ ResizeObserver update loops.
  const syncPill = useCallback(() => {
    if (fill) return;
    const pillEl = pillRef.current;
    if (!pillEl) return;
    const el = itemRefs.current[activeIndex];
    if (!el || activeIndex < 0) {
      pillEl.style.opacity = "0";
      return;
    }
    pillEl.style.opacity = "1";
    pillEl.style.left = `${el.offsetLeft}px`;
    pillEl.style.width = `${el.offsetWidth}px`;
  }, [activeIndex, fill]);

  useLayoutEffect(() => {
    syncPill();
  }, [syncPill, activeIndex, items.length, value]);

  useEffect(() => {
    if (fill) return;
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => syncPill());
    observer.observe(track);
    return () => observer.disconnect();
  }, [fill, syncPill]);

  const segmentClass = cn(
    "relative z-10 flex items-center justify-center gap-1 rounded-full font-semibold transition-colors duration-300",
    sizeClasses[size],
    fill ? "flex-1" : "shrink-0"
  );

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative rounded-full bg-gray-100 p-1",
        fill
          ? "flex w-full"
          : "inline-flex w-fit max-w-full self-start overflow-x-auto overscroll-x-contain",
        className
      )}
    >
      {fill && activeIndex >= 0 && items.length > 0 ? (
        <div
          aria-hidden
          className="absolute bottom-1 top-1 rounded-full bg-primary transition-transform duration-300 ease-out"
          style={{
            width: `calc((100% - 0.5rem) / ${items.length})`,
            transform: `translateX(calc(${activeIndex} * 100%))`,
          }}
        />
      ) : null}
      {!fill ? (
        <div
          ref={pillRef}
          aria-hidden
          className="pointer-events-none absolute bottom-1 top-1 rounded-full bg-primary opacity-0 transition-[left,width,opacity] duration-300 ease-out"
        />
      ) : null}
      {items.map((item, index) => {
        const isActive = value === item.id;
        const classNameForItem = cn(
          segmentClass,
          isActive ? "text-primary-foreground" : "text-gray-600 hover:text-gray-900"
        );
        const content = (
          <>
            <span className="truncate">{item.label}</span>
            {item.badge != null ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[9px] font-bold leading-none text-white tabular-nums">
                {item.badge}
              </span>
            ) : null}
          </>
        );
        const setRef = (node: HTMLElement | null) => {
          itemRefs.current[index] = node;
        };

        if (item.href) {
          return (
            <Link
              key={item.id}
              ref={setRef}
              href={item.href}
              className={classNameForItem}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            ref={setRef}
            type="button"
            onClick={() => onChange?.(item.id)}
            className={classNameForItem}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
