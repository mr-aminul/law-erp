"use client";

import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/store/appStore";
import { useSlickScrollbar } from "@/lib/hooks/useSlickScrollbar";
import type { AuthUser } from "@/lib/auth/client";
import { resolveUserAvatarUrl } from "@/lib/utils/userAvatar";
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
  user: AuthUser;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Shell({ children, title, icon, subtitle, user }: ShellProps) {
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
          className="fixed inset-0 z-[35] bg-sidebar/45 backdrop-blur-[2px] lg:hidden"
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
          <Topbar
            title={title}
            icon={icon}
            subtitle={subtitle}
            userName={user.fullName}
            userRole={user.role.replace(/_/g, " ")}
            userInitials={initials(user.fullName)}
            userEmail={user.email}
            userAvatarUrl={resolveUserAvatarUrl(user.avatarUrl)}
          />
          <main
            ref={mainScrollRef}
            onScroll={handleMainScroll}
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4",
              scrollbarClassName
            )}
          >
            {scrollbarOverlay}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
