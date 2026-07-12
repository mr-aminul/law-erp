"use client";

import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/store/appStore";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
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
          className="fixed inset-0 z-[35] bg-sidebar/45 backdrop-blur-[2px] lg:hidden"
          aria-label="Close navigation"
          onClick={closeMobileNav}
        />
      ) : null}
      <NotificationDrawer />
      <div
        className={cn(
          "fixed inset-[var(--shell-margin)] overflow-hidden transition-[left] duration-200 ease-in-out",
          sidebarCollapsed
            ? "lg:left-[calc(var(--sidebar-width-collapsed)+var(--shell-margin)*2)]"
            : "lg:left-[calc(var(--sidebar-width)+var(--shell-margin)*2)]"
        )}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-panel border-2 border-active-nav bg-white shadow-[0_8px_24px_rgba(26,92,69,0.12)] max-lg:rounded-[14px]">
          <Topbar title={title} icon={icon} subtitle={subtitle} />
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
