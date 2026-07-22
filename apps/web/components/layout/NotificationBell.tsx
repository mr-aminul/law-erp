"use client";

import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { mockNotifications } from "@/lib/mock/notifications";
import { cn } from "@/lib/utils/cn";
import { useNotificationStore } from "@/lib/store/notificationStore";
import type { AppNotification, NotificationTab } from "@/types/notification";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PANEL_WIDTH = 400;
const PANEL_GAP = 6;
const VIEWPORT_PAD = 12;

export function NotificationBell({ className }: { className?: string }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<NotificationTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(
    null
  );

  const drawerOpen = useNotificationStore((s) => s.drawerOpen);
  const openDrawer = useNotificationStore((s) => s.openDrawer);
  const closeDrawer = useNotificationStore((s) => s.closeDrawer);
  const readIds = useNotificationStore((s) => s.readIds);
  const dismissedIds = useNotificationStore((s) => s.dismissedIds);
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

  useLayoutEffect(() => {
    if (!drawerOpen) {
      setAnchor(null);
      return;
    }

    function updateAnchor() {
      const bell = document.getElementById("notification-bell");
      if (!bell) return;
      const rect = bell.getBoundingClientRect();
      setAnchor({
        top: rect.bottom + PANEL_GAP,
        right: Math.max(VIEWPORT_PAD, window.innerWidth - rect.right),
      });
    }

    updateAnchor();
    window.addEventListener("resize", updateAnchor);
    window.addEventListener("scroll", updateAnchor, true);
    return () => {
      window.removeEventListener("resize", updateAnchor);
      window.removeEventListener("scroll", updateAnchor, true);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closeDrawer();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [drawerOpen, closeDrawer]);

  function handleOpenNotification(notification: AppNotification) {
    markRead(notification.id);
    closeDrawer();
    router.push(notification.href);
  }

  function handleRefresh() {
    setRefreshing(true);
    refresh();
    window.setTimeout(() => setRefreshing(false), 500);
  }

  const panel =
    drawerOpen && typeof document !== "undefined"
      ? createPortal(
          <aside
            ref={panelRef}
            role="dialog"
            aria-labelledby="notification-drawer-title"
            className="fixed z-[111] flex flex-col overflow-hidden rounded-panel border border-gray-300 bg-white shadow-[0_12px_40px_rgb(0_0_0/0.14)]"
            style={{
              top: anchor?.top ?? 56,
              right: anchor?.right ?? VIEWPORT_PAD,
              width: `min(${PANEL_WIDTH}px, calc(100vw - ${VIEWPORT_PAD * 2}px))`,
              height: `min(78dvh, calc(100dvh - ${(anchor?.top ?? 56) + VIEWPORT_PAD}px))`,
              visibility: anchor ? "visible" : "hidden",
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
              onClose={closeDrawer}
            />
          </aside>,
          document.body
        )
      : null;

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        id="notification-bell"
        type="button"
        onClick={() => (drawerOpen ? closeDrawer() : openDrawer())}
        aria-expanded={drawerOpen}
        aria-haspopup="dialog"
        title={
          unreadCount > 0
            ? `${unreadCount} unread notifications`
            : "View notifications"
        }
        className="relative flex h-8 w-8 items-center justify-center rounded-input text-text-sec transition-colors hover:bg-gray-100 hover:text-text-primary"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
      >
        <span className="relative inline-flex">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red px-0.5 text-[9px] font-bold leading-none text-white ring-2 ring-[#f4f5f6]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
      </button>
      {panel}
    </div>
  );
}
