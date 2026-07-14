"use client";

import { cn } from "@/lib/utils/cn";
import { SCRIM_CLASS } from "@/components/ui/Scrim";
import { useAppStore } from "@/lib/store/appStore";
import { useSlickScrollbar } from "@/lib/hooks/useSlickScrollbar";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { AiAssistant } from "@/components/assistant/AiAssistant";
import { NotificationDrawer } from "./NotificationDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface ShellProps {
  children: React.ReactNode;
  title: string;
  icon: LucideIcon;
  subtitle?: string;
}

export function Shell({ children, title, icon, subtitle }: ShellProps) {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const mobileNavOpen = useAppStore((s) => s.mobileNavOpen);
  const closeMobileNav = useAppStore((s) => s.closeMobileNav);
  const {
    scrollRef: mainScrollRef,
    onScroll: handleMainScroll,
    scrollbarClassName,
    scrollbarOverlay,
  } = useSlickScrollbar();

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileNavOpen]);

  return (
    <div className="h-dvh overflow-hidden bg-white">
      <Sidebar />
      {mobileNavOpen ? (
        <button
          type="button"
          className={cn("fixed inset-0 z-[35] lg:hidden", SCRIM_CLASS)}
          aria-label="Close navigation"
          onClick={closeMobileNav}
        />
      ) : null}
      <NotificationDrawer />
      <AiAssistant />
      <div
        className={cn(
          "fixed inset-[var(--shell-margin)] overflow-hidden transition-[left] duration-200 ease-in-out",
          sidebarCollapsed
            ? "lg:left-[calc(var(--sidebar-width-collapsed)+var(--shell-margin)*2)]"
            : "lg:left-[calc(var(--sidebar-width)+var(--shell-margin)*2)]"
        )}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-panel border border-gray-300 bg-white max-lg:rounded-[14px]">
          <Topbar title={title} icon={icon} subtitle={subtitle} />
          <main
            ref={mainScrollRef}
            onScroll={handleMainScroll}
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
              scrollbarClassName
            )}
          >
            {scrollbarOverlay}
            <div className="p-3 sm:p-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
