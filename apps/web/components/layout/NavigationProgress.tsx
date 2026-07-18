"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "idle" | "loading" | "done";

function isInternalNavClick(event: MouseEvent, pathname: string): boolean {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }

  const anchor = (event.target as Element | null)?.closest?.("a");
  if (!anchor) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === pathname && url.search === window.location.search) return false;
    return true;
  } catch {
    return false;
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pathnameRef = useRef(pathname);
  const pendingRef = useRef(false);

  useEffect(() => {
    // Capture phase: run before Next.js <Link> calls preventDefault.
    const onClick = (event: MouseEvent) => {
      if (!isInternalNavClick(event, pathnameRef.current)) return;
      pendingRef.current = true;
      setPhase("loading");
    };

    const onPopState = () => {
      pendingRef.current = true;
      setPhase("loading");
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    if (pathnameRef.current === pathname) return;
    pathnameRef.current = pathname;

    if (!pendingRef.current) return;
    pendingRef.current = false;
    setPhase("done");
  }, [pathname]);

  useEffect(() => {
    if (phase !== "done") return;
    const hide = window.setTimeout(() => setPhase("idle"), 220);
    return () => window.clearTimeout(hide);
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    const failsafe = window.setTimeout(() => {
      pendingRef.current = false;
      setPhase("idle");
    }, 10_000);
    return () => window.clearTimeout(failsafe);
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-1"
      role="progressbar"
      aria-hidden="true"
    >
      <div
        className={
          phase === "done" ? "nav-progress-bar nav-progress-bar--done" : "nav-progress-bar"
        }
      />
    </div>
  );
}
