"use client";

import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/store/appStore";
import { NotificationBell } from "./NotificationBell";
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
  LogOut,
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
  { href: "/cases", label: "Matters", icon: Briefcase },
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
      className="fixed z-30 flex flex-col rounded-panel bg-sidebar transition-[width] duration-200 ease-in-out"
      style={{
        left: "var(--shell-margin)",
        top: "var(--shell-margin)",
        height: "calc(100vh - calc(var(--shell-margin) * 2))",
        width: sidebarCollapsed
          ? "var(--sidebar-width-collapsed)"
          : "var(--sidebar-width)",
      }}
    >
      <div
        className={cn(
          "mb-4 flex gap-2",
          sidebarCollapsed ? "items-center justify-center" : "items-start justify-between"
        )}
        style={{
          paddingTop: "var(--sidebar-logo-inset)",
          paddingInline: "var(--sidebar-logo-inset)",
        }}
      >
        <div className={cn("flex min-w-0", !sidebarCollapsed && "items-start gap-2.5")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-active-nav">
            <Scale className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="whitespace-nowrap text-base font-bold leading-tight text-white">UKIL.ai</p>
              <p className="whitespace-nowrap text-xs font-medium leading-tight text-white/60">Console</p>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <div className="flex shrink-0 items-center gap-1">
            <NotificationBell />
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {sidebarCollapsed && (
        <div className="mb-2 px-2">
          <NotificationBell collapsed />
          <button
            type="button"
            onClick={toggleSidebar}
            className="mt-2 flex h-9 w-full items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav
        className={cn(
          "flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden",
          sidebarCollapsed ? "px-2" : "px-[var(--sidebar-logo-inset)]"
        )}
      >
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
          sidebarCollapsed ? "mx-2 justify-center px-2 py-2.5" : "mx-[var(--sidebar-logo-inset)] gap-2.5 px-3 py-2",
          pathname.startsWith("/settings")
            ? "bg-active-nav text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
      >
        <Settings className="h-4 w-4 shrink-0" />
        {!sidebarCollapsed && <span>Settings</span>}
      </Link>

      <div className="mt-3 border-t border-white/10">
        <div
          className={cn(
            "group flex rounded-b-panel transition-colors hover:bg-active-nav has-[.logout-btn:hover]:!bg-transparent",
            sidebarCollapsed
              ? "flex-col items-center gap-1 px-2 pb-2 pt-3"
              : "flex-row items-center gap-2 px-[var(--sidebar-logo-inset)] pb-4 pt-3"
          )}
        >
          <button
            type="button"
            className={cn(
              "flex min-w-0 items-center text-left",
              sidebarCollapsed ? "justify-center" : "flex-1 gap-2"
            )}
            aria-label="Open profile menu"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-active-nav text-[11px] font-bold text-white group-hover:bg-white/20 group-has-[.logout-btn:hover]:bg-active-nav">
              AI
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-sm font-semibold leading-tight text-white">
                  Aminul Islam
                </p>
                <p className="truncate text-[11px] text-white/60 group-hover:text-white/80 group-has-[.logout-btn:hover]:text-white/60">
                  Managing Partner
                </p>
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="logout-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-input text-white/60 transition-colors group-hover:text-white hover:bg-[#dc2626] hover:text-white"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
