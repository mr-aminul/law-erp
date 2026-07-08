"use client";

import { mockNotifications } from "@/lib/mock/notifications";
import { cn } from "@/lib/utils/cn";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { Bell } from "lucide-react";
import { useMemo } from "react";

interface NotificationBellProps {
  collapsed?: boolean;
}

export function NotificationBell({ collapsed = false }: NotificationBellProps) {
  const openDrawer = useNotificationStore((s) => s.openDrawer);
  const readIds = useNotificationStore((s) => s.readIds);
  const dismissedIds = useNotificationStore((s) => s.dismissedIds);

  const unreadCount = useMemo(
    () =>
      mockNotifications.filter(
        (notification) =>
          !dismissedIds.includes(notification.id) &&
          !readIds.includes(notification.id)
      ).length,
    [dismissedIds, readIds]
  );

  return (
    <button
      type="button"
      onClick={openDrawer}
      title={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : "View notifications"
      }
      className={cn(
        "relative flex items-center justify-center rounded-input text-white/60 transition-colors hover:bg-white/10 hover:text-white",
        collapsed ? "mb-2 h-9 w-full" : "h-8 w-8"
      )}
      aria-label={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : "Notifications"
      }
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red px-0.5 text-[9px] font-bold leading-none text-white ring-2 ring-sidebar">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
