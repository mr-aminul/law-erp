"use client";

import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/store/appStore";
import { NotificationBell } from "./NotificationBell";
import {
  BarChart3,
  Briefcase,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  Folder,
  Gavel,
  Handshake,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";

type NavChild = { href: string; label: string; icon: LucideIcon };
type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/cases",
    label: "Matters",
    icon: Folder,
    children: [
      { href: "/cases", label: "Cases", icon: Briefcase },
      { href: "/cases/services", label: "Services", icon: Handshake },
    ],
  },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/staff", label: "Staff", icon: Scale },
  { href: "/court-filing", label: "Court Filing", icon: Gavel },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/communications", label: "Communications", icon: MessageSquare },
];

function isMattersPath(pathname: string) {
  return pathname === "/cases" || pathname.startsWith("/cases/");
}

function isChildActive(pathname: string, href: string) {
  if (href === "/cases") {
    return (
      pathname === "/cases" ||
      (pathname.startsWith("/cases/") && !pathname.startsWith("/cases/services"))
    );
  }
  return pathname === href || pathname.startsWith(href + "/");
}

function CollapsedFlyout({
  label,
  icon: Icon,
  href,
  items,
  active,
  pathname,
}: {
  label: string;
  icon: LucideIcon;
  href?: string;
  items?: NavChild[];
  active: boolean;
  pathname: string;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMenu = Boolean(items?.length);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function show() {
    clearCloseTimer();
    setOpen(true);
  }

  function hide() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 100);
  }

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.top, left: rect.right + 8 });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-sidebar-flyout]")) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      clearCloseTimer();
    };
  }, [open]);

  const triggerClass = cn(
    "flex w-full items-center justify-center rounded-input px-2 py-2.5 text-[13px] font-semibold transition-colors",
    active
      ? "bg-active-nav text-white"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  );

  return (
    <div ref={triggerRef} onMouseEnter={show} onMouseLeave={hide}>
      {href ? (
        <Link href={href} title={label} className={triggerClass}>
          <Icon className="h-4 w-4 shrink-0" />
        </Link>
      ) : (
        <button
          type="button"
          title={label}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
          className={triggerClass}
        >
          <Icon className="h-4 w-4 shrink-0" />
        </button>
      )}
      {open &&
        pos &&
        createPortal(
          <div
            role={hasMenu ? "menu" : "tooltip"}
            data-sidebar-flyout
            aria-label={label}
            onMouseEnter={hasMenu ? show : undefined}
            onMouseLeave={hasMenu ? hide : undefined}
            className={cn(
              "fixed z-50 rounded-md border border-gray-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)]",
              hasMenu ? "min-w-[160px] py-0.5" : "px-2.5 py-1.5"
            )}
            style={{ top: pos.top, left: pos.left }}
          >
            {hasMenu ? (
              <>
                <p className="border-b border-gray-200 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-black">
                  {label}
                </p>
                <div className="flex flex-col gap-px p-1">
                  {items!.map(({ href: childHref, label: childLabel, icon: ChildIcon }) => (
                    <Link
                      key={childHref}
                      href={childHref}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded px-2 py-1.5 text-[12px] font-medium transition-colors",
                        isChildActive(pathname, childHref)
                          ? "bg-muted text-foreground"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <ChildIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{childLabel}</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="whitespace-nowrap text-[12px] font-medium text-foreground">
                {label}
              </p>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const { sidebarCollapsed, toggleSidebar, mobileNavOpen, closeMobileNav } =
    useAppStore();
  const [mattersOpen, setMattersOpen] = useState(isMattersPath(pathname));

  // Collapse is desktop-only; mobile drawer always shows labels.
  const collapsed = isDesktop && sidebarCollapsed;

  useEffect(() => {
    if (isMattersPath(pathname)) setMattersOpen(true);
  }, [pathname]);

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMobileNav();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen, closeMobileNav]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/cases") return false;
    return pathname.startsWith(href);
  }

  function handleNavClick() {
    closeMobileNav();
  }

  return (
    <aside
      className={cn(
        "fixed z-40 flex flex-col rounded-panel bg-sidebar transition-[width,transform] duration-200 ease-in-out",
        "max-lg:w-[min(var(--sidebar-width),calc(100vw-var(--shell-margin)*2))]",
        "max-lg:-translate-x-[calc(100%+var(--shell-margin)+12px)]",
        mobileNavOpen && "max-lg:translate-x-0",
        collapsed
          ? "lg:w-[var(--sidebar-width-collapsed)]"
          : "lg:w-[var(--sidebar-width)]"
      )}
      style={{
        left: "var(--shell-margin)",
        top: "var(--shell-margin)",
        height: "calc(100dvh - calc(var(--shell-margin) * 2))",
      }}
    >
      <div
        className={cn(
          "mb-4 flex gap-2",
          collapsed
            ? "items-center justify-center"
            : "items-start justify-between"
        )}
        style={{
          paddingTop: "var(--sidebar-logo-inset)",
          paddingInline: "var(--sidebar-logo-inset)",
        }}
      >
        <div className={cn("flex min-w-0", !collapsed && "items-start gap-2.5")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-active-nav">
            <Scale className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="whitespace-nowrap text-base font-bold leading-tight text-white">
                UKIL.ai
              </p>
              <p className="whitespace-nowrap text-xs font-medium leading-tight text-white/60">
                Console
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="flex shrink-0 items-center gap-1">
            <NotificationBell />
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden h-8 w-8 items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:flex"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={closeMobileNav}
              className="flex h-8 w-8 items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {collapsed && (
        <div className="mb-2 px-2">
          <NotificationBell collapsed />
          <button
            type="button"
            onClick={toggleSidebar}
            className="mt-2 flex h-9 w-full items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav
        className={cn(
          "flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden",
          collapsed ? "px-2" : "px-[var(--sidebar-logo-inset)]"
        )}
      >
        {navItems.map(({ href, label, icon: Icon, children }) => {
          if (collapsed) {
            return (
              <CollapsedFlyout
                key={href}
                label={label}
                icon={Icon}
                href={children ? undefined : href}
                items={children}
                active={children ? isMattersPath(pathname) : isActive(href)}
                pathname={pathname}
              />
            );
          }

          if (children) {
            const groupActive = isMattersPath(pathname);
            return (
              <div key={href} className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setMattersOpen((open) => !open)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-input px-3 py-2 text-[13px] font-semibold transition-colors",
                    groupActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                  aria-expanded={mattersOpen}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-left">{label}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform",
                      mattersOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
                {mattersOpen && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-2">
                    {children.map(
                      ({ href: childHref, label: childLabel, icon: ChildIcon }) => (
                        <Link
                          key={childHref}
                          href={childHref}
                          onClick={handleNavClick}
                          className={cn(
                            "flex items-center gap-2.5 rounded-input px-3 py-1.5 text-[13px] font-semibold transition-colors",
                            isChildActive(pathname, childHref)
                              ? "bg-active-nav text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <ChildIcon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{childLabel}</span>
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-2.5 rounded-input px-3 py-2 text-[13px] font-semibold transition-colors",
                isActive(href)
                  ? "bg-active-nav text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {collapsed ? (
        <div className="mt-2 px-2">
          <CollapsedFlyout
            label="Settings"
            icon={Settings}
            href="/settings"
            active={pathname.startsWith("/settings")}
            pathname={pathname}
          />
        </div>
      ) : (
        <Link
          href="/settings"
          onClick={handleNavClick}
          className={cn(
            "mt-2 flex items-center gap-2.5 rounded-input px-3 py-2 text-[13px] font-semibold transition-colors",
            "mx-[var(--sidebar-logo-inset)]",
            pathname.startsWith("/settings")
              ? "bg-active-nav text-white"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Settings</span>
        </Link>
      )}

      <div className="mt-3 border-t border-white/10">
        <div
          className={cn(
            "group flex rounded-b-panel transition-colors hover:bg-active-nav has-[.logout-btn:hover]:!bg-transparent",
            collapsed
              ? "flex-col items-center gap-1 px-2 pb-2 pt-3"
              : "flex-row items-center gap-2 px-[var(--sidebar-logo-inset)] pb-4 pt-3"
          )}
        >
          <button
            type="button"
            className={cn(
              "flex min-w-0 items-center text-left",
              collapsed ? "justify-center" : "flex-1 gap-2"
            )}
            aria-label="Open profile menu"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-active-nav text-[11px] font-bold text-white group-hover:bg-white/20 group-has-[.logout-btn:hover]:bg-active-nav">
              AI
            </div>
            {!collapsed && (
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
