"use client";

import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { useAppStore } from "@/lib/store/appStore";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { mockNotifications } from "@/lib/mock/notifications";
import type { AppNotification, NotificationTab } from "@/types/notification";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export function NotificationDrawer() {
  const router = useRouter();
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

  const overlayLeft = sidebarCollapsed
    ? "calc(var(--shell-margin) + var(--sidebar-width-collapsed))"
    : "calc(var(--shell-margin) + var(--sidebar-width))";

  const drawer = (
    <div className="fixed inset-0 z-[110]" role="presentation">
      <div
        className="absolute bottom-0 right-0 top-0 bg-sidebar/35 backdrop-blur-[3px]"
        style={{ left: overlayLeft }}
        onClick={closeDrawer}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-drawer-title"
        className="fixed z-[111] flex w-[min(400px,calc(100vw-var(--shell-margin)*2-80px))] flex-col overflow-hidden rounded-panel border border-[var(--color-theme)] bg-white shadow-[0_24px_48px_rgba(26,43,35,0.12)] transition-[left] duration-200 ease-in-out"
        style={{
          left: sidebarCollapsed
            ? "calc(var(--shell-margin) + var(--sidebar-width-collapsed) + 8px)"
            : "calc(var(--shell-margin) + var(--sidebar-width) + 8px)",
          top: "var(--shell-margin)",
          height: "calc(100vh - calc(var(--shell-margin) * 2))",
        }}
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
        />
      </aside>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(drawer, document.body)
    : null;
}
