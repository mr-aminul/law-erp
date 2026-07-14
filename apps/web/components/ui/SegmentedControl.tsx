"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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

type PillRect = { left: number; width: number };

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
  const [pill, setPill] = useState<PillRect | null>(null);

  const syncPill = useCallback(() => {
    if (fill) return;
    const el = itemRefs.current[activeIndex];
    const track = trackRef.current;
    if (!el || !track || activeIndex < 0) {
      setPill(null);
      return;
    }
    setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeIndex, fill]);

  useLayoutEffect(() => {
    syncPill();
  }, [syncPill, items]);

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
        "relative flex rounded-full bg-gray-100 p-1",
        fill
          ? "w-full"
          : "inline-flex max-w-full overflow-x-auto overscroll-x-contain",
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
      {!fill && pill ? (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-1 top-1 rounded-full bg-primary transition-[left,width] duration-300 ease-out"
          style={{ left: pill.left, width: pill.width }}
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
