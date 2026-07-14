"use client";

import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { Scrim } from "@/components/ui/Scrim";
import { useAppStore } from "@/lib/store/appStore";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { mockNotifications } from "@/lib/mock/notifications";
import { cn } from "@/lib/utils/cn";
import type { AppNotification, NotificationTab } from "@/types/notification";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";

export function NotificationDrawer() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [filter, setFilter] = useState<NotificationTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const drawerOpen = useNotificationStore((s) => s.drawerOpen);
  const readIds = useNotificationStore((s) => s.readIds);
  const dismissedIds = useNotificationStore((s) => s.dismissedIds);
  const closeDrawer = useNotificationStore((s) => s.closeDrawer);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const dismiss = useNotificationStore((s) => s.dismiss);
  const refresh = useNotificationStore((s) => s.refresh);

  const unreadCount = useMemo(
    () =>
      mockNotifications.filter(
        (notification) =>
          !dismissedIds.includes(notification.id) &&
          !readIds.includes(notification.id)
      ).length,
    [dismissedIds, readIds]
  );

  useEffect(() => {
    if (!drawerOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen, closeDrawer]);

  function handleOpenNotification(notification: AppNotification) {
    markRead(notification.id);
    closeDrawer();
    router.push(notification.href);
  }

  function handleOpenCenter() {
    closeDrawer();
    router.push("/communications");
  }

  function handleRefresh() {
    setRefreshing(true);
    refresh();
    window.setTimeout(() => setRefreshing(false), 500);
  }

  if (!drawerOpen) return null;

  const drawer = (
    <>
      <Scrim className="fixed z-[110]" onClick={closeDrawer} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-drawer-title"
        className={cn(
          "fixed z-[111] flex flex-col overflow-hidden rounded-panel border border-gray-300 bg-white shadow-[0_12px_40px_rgb(0_0_0/0.14)]",
          "inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] bottom-auto h-[min(78dvh,calc(100dvh-5.5rem))] w-auto",
          "lg:inset-x-auto lg:top-[var(--shell-margin)] lg:w-[min(400px,calc(100vw-var(--shell-margin)*2-80px))]"
        )}
        style={
          isDesktop
            ? {
                left: sidebarCollapsed
                  ? "calc(var(--sidebar-width-collapsed) + var(--shell-margin) * 2 + 8px)"
                  : "calc(var(--sidebar-width) + var(--shell-margin) * 2 + 8px)",
              }
            : undefined
        }
      >
        <NotificationPanel
          titleId="notification-drawer-title"
          filter={filter}
          onFilterChange={setFilter}
          readIds={readIds}
          dismissedIds={dismissedIds}
          expandedId={expandedId}
          onToggleExpand={(id) =>
            setExpandedId((current) => (current === id ? null : id))
          }
          onDismiss={dismiss}
          onOpenNotification={handleOpenNotification}
          onMarkAllRead={markAllRead}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          unreadCount={unreadCount}
          className="h-full"
          listClassName="min-h-0 flex-1"
          onCenterClick={handleOpenCenter}
          onClose={closeDrawer}
        />
      </aside>
    </>
  );

  return typeof document !== "undefined"
    ? createPortal(drawer, document.body)
    : null;
}
