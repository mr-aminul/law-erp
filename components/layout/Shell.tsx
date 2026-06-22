"use client";

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
        className="min-h-screen p-shell transition-[margin-left] duration-200 ease-in-out"
        style={{
          marginLeft: sidebarCollapsed
            ? "calc(var(--sidebar-width-collapsed) + var(--shell-margin))"
            : "calc(var(--sidebar-width) + var(--shell-margin))",
        }}
      >
        <Topbar title={title} subtitle={subtitle} />
        <main>{children}</main>
      </div>
    </div>
  );
}
