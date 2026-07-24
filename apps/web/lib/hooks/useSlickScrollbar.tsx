"use client";

import { cn } from "@/lib/utils/cn";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefCallback,
} from "react";

type ThumbState = {
  visible: boolean;
  show: boolean;
  top: number;
  height: number;
};

const HIDDEN: ThumbState = {
  visible: false,
  show: false,
  top: 0,
  height: 0,
};

/**
 * Hides the native scrollbar (no layout gutter) and renders a floating thumb
 * that sits above the content while scrolling.
 *
 * Render `scrollbarOverlay` as the first child of the scroll container.
 * Keep horizontal padding on an inner wrapper — not the scroll container —
 * so the thumb sits on the panel’s right edge.
 */
export function useSlickScrollbar(hideDelayMs = 700): {
  scrollRef: RefCallback<HTMLElement | null>;
  onScroll: () => void;
  scrollbarClassName: string;
  scrollbarOverlay: ReactNode;
} {
  const nodeRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const hideTimeout = useRef<number | null>(null);
  const [thumb, setThumb] = useState<ThumbState>(HIDDEN);

  const syncThumb = useCallback(() => {
    const el = nodeRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) {
      setThumb((prev) => (prev.show ? HIDDEN : prev));
      return;
    }

    const height = Math.round(
      Math.max(28, (clientHeight / scrollHeight) * clientHeight)
    );
    const maxTop = clientHeight - height;
    const top =
      maxTop <= 0
        ? 0
        : Math.round((scrollTop / (scrollHeight - clientHeight)) * maxTop);

    setThumb((prev) => {
      if (prev.show && prev.top === top && prev.height === height) return prev;
      return { ...prev, show: true, top, height };
    });
  }, []);

  const scrollRef = useCallback<RefCallback<HTMLElement | null>>(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      nodeRef.current = node;
      if (!node) return;

      syncThumb();
      const observer = new ResizeObserver(() => syncThumb());
      observer.observe(node);
      observerRef.current = observer;
    },
    [syncThumb]
  );

  const onScroll = useCallback(() => {
    syncThumb();
    setThumb((prev) => (prev.visible ? prev : { ...prev, visible: true }));
    if (hideTimeout.current !== null) {
      window.clearTimeout(hideTimeout.current);
    }
    hideTimeout.current = window.setTimeout(() => {
      setThumb((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      hideTimeout.current = null;
    }, hideDelayMs);
  }, [hideDelayMs, syncThumb]);

  useEffect(() => {
    return () => {
      if (hideTimeout.current !== null) {
        window.clearTimeout(hideTimeout.current);
      }
      observerRef.current?.disconnect();
    };
  }, []);

  const scrollbarOverlay = (
    <div
      aria-hidden
      className="pointer-events-none sticky top-0 z-20 float-right h-0 w-0"
    >
      <div
        className={cn(
          "absolute right-0.5 w-1 rounded-full bg-gray-400/75 transition-opacity duration-300",
          thumb.show && thumb.visible ? "opacity-100" : "opacity-0"
        )}
        style={{ top: thumb.top, height: thumb.height }}
      />
    </div>
  );

  return {
    scrollRef,
    onScroll,
    scrollbarClassName: "scrollbar-slick",
    scrollbarOverlay,
  };
}
