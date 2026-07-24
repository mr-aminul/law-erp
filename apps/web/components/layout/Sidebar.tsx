"use client";

import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/store/appStore";
import { mainNav } from "@/lib/config/navigation";
import {
  Banknote,
  Briefcase,
  Calendar,
  ChevronDown,
  Clock,
  ContactRound,
  CreditCard,
  FileText,
  Folder,
  Gavel,
  Handshake,
  LayoutDashboard,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Scale,
  Settings,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Folder,
  Briefcase,
  Handshake,
  Calendar,
  FileText,
  Gavel,
  MessageSquare,
  CreditCard,
  Receipt,
  Wallet,
  ContactRound,
  Clock,
  Banknote,
  Settings,
};

type NavChild = { href: string; label: string; icon: LucideIcon };
type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: NavChild[];
};

const navItems: NavItem[] = mainNav.map((item) => ({
  href: item.href,
  label: item.label,
  icon: ICONS[item.icon] ?? LayoutDashboard,
  children:
    "children" in item && item.children
      ? item.children.map((child) => ({
          href: child.href,
          label: child.label,
          icon: ICONS[child.icon] ?? LayoutDashboard,
        }))
      : undefined,
}));

function isGroupPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function isChildActive(pathname: string, href: string, siblings: NavChild[]) {
  if (pathname !== href && !pathname.startsWith(href + "/")) return false;
  return !siblings.some(
    (sibling) =>
      sibling.href !== href &&
      sibling.href.length > href.length &&
      (pathname === sibling.href || pathname.startsWith(sibling.href + "/"))
  );
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
    setPos({
      top: rect.top + rect.height / 2,
      left: rect.right + 8,
    });
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
      ? "bg-active-nav text-on-active-nav"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  );

  return (
    <div ref={triggerRef} onMouseEnter={show} onMouseLeave={hide}>
      {href ? (
        <Link href={href} className={triggerClass}>
          <Icon className="h-4 w-4 shrink-0" />
        </Link>
      ) : (
        <button
          type="button"
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
              "fixed z-[120] -translate-y-1/2 rounded-md border border-active-nav bg-active-nav text-on-active-nav shadow-[0_4px_16px_rgba(0,0,0,0.1)]",
              hasMenu ? "min-w-[160px] py-0.5" : "px-2.5 py-1.5"
            )}
            style={{ top: pos.top, left: pos.left }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 border-y-[6px] border-r-[6px] border-y-transparent border-r-active-nav"
            />
            {hasMenu ? (
              <>
                <p className="border-b border-current/15 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] opacity-70">
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
                        isChildActive(pathname, childHref, items!)
                          ? "bg-active-nav-soft text-on-active-nav-soft"
                          : "opacity-80 hover:bg-black/10 hover:opacity-100"
                      )}
                    >
                      <ChildIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{childLabel}</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="whitespace-nowrap text-[12px] font-medium">
                {label}
              </p>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

function initialOpenGroups(pathname: string) {
  return Object.fromEntries(
    navItems
      .filter((item) => item.children)
      .map((item) => [item.href, isGroupPath(pathname, item.href)])
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const { sidebarCollapsed, toggleSidebar, mobileNavOpen, closeMobileNav } =
    useAppStore();
  const [openGroups, setOpenGroups] = useState(() => initialOpenGroups(pathname));

  // Collapse is desktop-only; mobile drawer always shows labels.
  const collapsed = isDesktop && sidebarCollapsed;

  useEffect(() => {
    setOpenGroups((prev) => {
      let next = prev;
      for (const item of navItems) {
        if (!item.children || !isGroupPath(pathname, item.href) || prev[item.href]) {
          continue;
        }
        if (next === prev) next = { ...prev };
        next[item.href] = true;
      }
      return next;
    });
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
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function handleNavClick() {
    closeMobileNav();
  }

  return (
    <aside
      className={cn(
        "fixed flex flex-col overflow-hidden rounded-panel bg-sidebar transition-[width,transform] duration-200 ease-in-out z-40",
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-active-nav text-on-active-nav">
            <Scale className="h-5 w-5" />
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
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-9 w-full items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav
        className={cn(
          // Keep overflow scroll for short viewports / expanded groups, but never
          // show a native scrollbar (scrollbar-slick hides the gutter).
          "flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden scrollbar-slick pb-3",
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
                active={children ? isGroupPath(pathname, href) : isActive(href)}
                pathname={pathname}
              />
            );
          }

          if (children) {
            const groupActive = isGroupPath(pathname, href);
            const groupOpen = openGroups[href] ?? false;
            return (
              <div key={href} className="flex flex-col gap-0.5">
                <div
                  className={cn(
                    "flex w-full items-center rounded-input transition-colors",
                    groupActive
                      ? "bg-active-nav text-on-active-nav"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Link
                    href={href}
                    onClick={() => {
                      setOpenGroups((prev) => ({ ...prev, [href]: true }));
                      handleNavClick();
                    }}
                    className="flex min-w-0 flex-1 items-center gap-2.5 rounded-input px-3 py-2 text-[13px] font-semibold"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-left">{label}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      const willOpen = !groupOpen;
                      setOpenGroups((prev) => ({ ...prev, [href]: willOpen }));
                      // Expanding should select the parent so active styling matches the label click.
                      if (willOpen) {
                        router.push(href);
                        handleNavClick();
                      }
                    }}
                    className={cn(
                      "mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-input transition-colors",
                      groupActive ? "hover:bg-black/10" : "hover:bg-white/10"
                    )}
                    aria-expanded={groupOpen}
                    aria-label={groupOpen ? `Collapse ${label}` : `Expand ${label}`}
                  >
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-transform",
                        groupOpen ? "rotate-0" : "-rotate-90"
                      )}
                    />
                  </button>
                </div>
                {groupOpen && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-2">
                    {children.map(
                      ({ href: childHref, label: childLabel, icon: ChildIcon }) => (
                        <Link
                          key={childHref}
                          href={childHref}
                          onClick={handleNavClick}
                          className={cn(
                            "flex items-center gap-2.5 rounded-input px-3 py-1.5 text-[13px] font-semibold transition-colors",
                            isChildActive(pathname, childHref, children)
                              ? "bg-active-nav-soft text-on-active-nav-soft"
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
                  ? "bg-active-nav text-on-active-nav"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "mt-auto border-t border-white/10",
          collapsed ? "p-2" : "p-3"
        )}
      >
        {collapsed ? (
          <CollapsedFlyout
            label="Settings"
            icon={Settings}
            href="/settings"
            active={pathname.startsWith("/settings")}
            pathname={pathname}
          />
        ) : (
          <Link
            href="/settings"
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-2.5 rounded-input px-3 py-2 text-[13px] font-semibold transition-colors",
              pathname.startsWith("/settings")
                ? "bg-active-nav text-on-active-nav"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span className="truncate">Settings</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
