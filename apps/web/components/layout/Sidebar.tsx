"use client";

import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/store/appStore";
import {
  BarChart3,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Gavel,
  LayoutDashboard,
  MessageSquare,
  Scale,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cases", label: "Cases", icon: Briefcase },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/staff", label: "Staff", icon: Scale },
  { href: "/court-filing", label: "Court Filing", icon: Gavel },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/communications", label: "Communications", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "fixed z-30 flex flex-col rounded-panel bg-sidebar transition-[width,padding] duration-200 ease-in-out",
        sidebarCollapsed ? "p-2" : "p-4"
      )}
      style={{
        left: "var(--shell-margin)",
        top: "var(--shell-margin)",
        height: "calc(100vh - calc(var(--shell-margin) * 2))",
        width: sidebarCollapsed
          ? "var(--sidebar-width-collapsed)"
          : "var(--sidebar-width)",
      }}
    >
      <div className={cn("mb-4 flex items-center", sidebarCollapsed ? "justify-center" : "justify-between gap-2")}>
        <div className={cn("flex items-center", sidebarCollapsed ? "justify-center" : "gap-2.5")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-active-nav">
            <Scale className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="whitespace-nowrap text-base font-bold text-white">UKIL.ai</p>
              <p className="whitespace-nowrap text-xs font-medium text-white/60">Console</p>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="mb-2 flex h-9 w-full items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={sidebarCollapsed ? label : undefined}
            className={cn(
              "flex items-center rounded-input text-[13px] font-semibold transition-colors",
              sidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-3 py-2",
              isActive(href)
                ? "bg-active-nav text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </nav>

      <Link
        href="/settings"
        title={sidebarCollapsed ? "Settings" : undefined}
        className={cn(
          "mt-2 flex items-center rounded-input text-[13px] font-semibold transition-colors",
          sidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-3 py-2",
          pathname.startsWith("/settings")
            ? "bg-active-nav text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
      >
        <Settings className="h-4 w-4 shrink-0" />
        {!sidebarCollapsed && <span>Settings</span>}
      </Link>
    </aside>
  );
}
