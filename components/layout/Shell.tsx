"use client";

import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/store/appStore";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface ShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function Shell({ children, title, subtitle }: ShellProps) {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div
        className={cn(
          "min-h-screen p-shell transition-[margin-left] duration-200 ease-in-out",
          sidebarCollapsed
            ? "ml-[calc(var(--sidebar-width-collapsed)+var(--shell-margin))]"
            : "ml-[calc(var(--sidebar-width)+var(--shell-margin))]"
        )}
      >
        <Topbar title={title} subtitle={subtitle} />
        <main>{children}</main>
      </div>
    </div>
  );
}
