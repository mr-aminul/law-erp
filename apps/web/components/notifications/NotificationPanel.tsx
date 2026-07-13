"use client";

import { mockNotifications } from "@/lib/mock/notifications";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/formatDate";
import type {
  AppNotification,
  NotificationMatterChip,
  NotificationTab,
  SystemAlertVariant,
} from "@/types/notification";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Info,
  RefreshCw,
  Scale,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useSlickScrollbar } from "@/lib/hooks/useSlickScrollbar";
import { Tabs } from "@/components/ui/Tabs";

export const notificationTabs: { id: NotificationTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "firm", label: "Firm" },
  { id: "system", label: "System" },
];

const chipToneClasses: Record<NotificationMatterChip["tone"], string> = {
  green: "bg-active-nav",
  blue: "bg-blue",
  amber: "bg-amber",
  slate: "bg-text-muted",
};

const systemIconMeta: Record<
  SystemAlertVariant,
  { icon: typeof Info; bg: string; text: string }
> = {
  info: { icon: Info, bg: "bg-blue-light", text: "text-blue" },
  alert: { icon: AlertCircle, bg: "bg-red-light", text: "text-red" },
  success: { icon: CheckCircle2, bg: "bg-green-light", text: "text-green" },
};

function MatterChip({ chip }: { chip: NotificationMatterChip }) {
  return (
    <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-medium text-text-primary shadow-none">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded text-[8px] font-bold text-white",
          chipToneClasses[chip.tone]
        )}
      >
        {chip.initial}
      </span>
      <span className="truncate">{chip.label}</span>
    </span>
  );
}

function TeamNotificationCard({
  notification,
  unread,
  onOpen,
}: {
  notification: AppNotification;
  unread: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "w-full rounded-xl border bg-white p-3 text-left transition-colors hover:border-gray-300",
        unread ? "border-gray-300" : "border-gray-200"
      )}
    >
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-active-nav text-[11px] font-bold text-white">
          {notification.actorInitials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug text-text-primary">
            <span className="font-semibold">{notification.actorName}</span>{" "}
            {notification.body}
          </p>
          {notification.matterChip && (
            <MatterChip chip={notification.matterChip} />
          )}
          <p className="mt-2 text-[11px] text-text-muted">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
        {unread && (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-theme)]" />
        )}
      </div>
    </button>
  );
}

function FirmNotificationCard({
  notification,
  unread,
  onOpen,
}: {
  notification: AppNotification;
  unread: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "w-full rounded-xl border bg-white p-3 text-left transition-colors hover:border-gray-300",
        unread ? "border-gray-300" : "border-gray-200"
      )}
    >
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-active-nav">
          <Scale className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug text-text-primary">
            <span className="font-semibold">UKIL</span> {notification.body}
          </p>
          {notification.matterChip && (
            <MatterChip chip={notification.matterChip} />
          )}
          <div className="mt-2 flex items-center gap-2">
            {notification.statusLabel && (
              <span
                className={cn(
                  "text-[11px] font-medium",
                  notification.statusLabel === "Completed"
                    ? "text-green"
                    : "text-text-muted"
                )}
              >
                {notification.statusLabel === "Completed" && (
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green" />
                )}
                {notification.statusLabel}
              </span>
            )}
            <span className="text-[11px] text-text-muted">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>
        {unread && (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-theme)]" />
        )}
      </div>
    </button>
  );
}

function SystemNotificationCard({
  notification,
  unread,
  expanded,
  onToggle,
  onDismiss,
  onOpen,
}: {
  notification: AppNotification;
  unread: boolean;
  expanded: boolean;
  onToggle: () => void;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  const variant = notification.systemVariant ?? "info";
  const meta = systemIconMeta[variant];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white transition-colors",
        unread ? "border-gray-300" : "border-gray-200"
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            meta.bg
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", meta.text)} />
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left text-sm font-semibold text-text-primary"
        >
          {notification.title}
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1 text-text-muted transition-colors hover:bg-cream-card"
          aria-label={
            expanded ? "Collapse notification" : "Expand notification"
          }
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md p-1 text-text-muted transition-colors hover:bg-cream-card hover:text-text-primary"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 px-3 py-3">
          <p className="text-sm leading-relaxed text-text-muted">
            {notification.detail ?? notification.body}
          </p>
          {notification.actionLabel && (
            <button
              type="button"
              onClick={onOpen}
              className="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:bg-cream-card"
            >
              {notification.actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function NotificationCard({
  notification,
  unread,
  expanded,
  onToggleExpand,
  onDismiss,
  onOpen,
}: {
  notification: AppNotification;
  unread: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  if (notification.kind === "team") {
    return (
      <TeamNotificationCard
        notification={notification}
        unread={unread}
        onOpen={onOpen}
      />
    );
  }

  if (notification.kind === "system") {
    return (
      <SystemNotificationCard
        notification={notification}
        unread={unread}
        expanded={expanded}
        onToggle={onToggleExpand}
        onDismiss={onDismiss}
        onOpen={onOpen}
      />
    );
  }

  return (
    <FirmNotificationCard
      notification={notification}
      unread={unread}
      onOpen={onOpen}
    />
  );
}

export function useNotificationLists(dismissedIds: string[]) {
  const tabCounts = useMemo(() => {
    const active = mockNotifications.filter(
      (notification) => !dismissedIds.includes(notification.id)
    );
    return {
      all: active.length,
      firm: active.filter((notification) => notification.kind === "firm").length,
      system: active.filter((notification) => notification.kind === "system")
        .length,
    };
  }, [dismissedIds]);

  function getFilteredNotifications(filter: NotificationTab) {
    const active = mockNotifications.filter(
      (notification) => !dismissedIds.includes(notification.id)
    );
    const sorted = [...active].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (filter === "firm") {
      return sorted.filter((notification) => notification.kind === "firm");
    }
    if (filter === "system") {
      return sorted.filter((notification) => notification.kind === "system");
    }
    return sorted;
  }

  return { tabCounts, getFilteredNotifications };
}

interface NotificationPanelProps {
  filter: NotificationTab;
  onFilterChange: (tab: NotificationTab) => void;
  readIds: string[];
  dismissedIds: string[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpenNotification: (notification: AppNotification) => void;
  onMarkAllRead: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  unreadCount: number;
  centerHref?: string;
  onCenterClick?: () => void;
  titleId?: string;
  className?: string;
  listClassName?: string;
}

export function NotificationPanel({
  filter,
  onFilterChange,
  readIds,
  dismissedIds,
  expandedId,
  onToggleExpand,
  onDismiss,
  onOpenNotification,
  onMarkAllRead,
  onRefresh,
  refreshing = false,
  unreadCount,
  centerHref = "/communications",
  onCenterClick,
  titleId,
  className,
  listClassName,
}: NotificationPanelProps) {
  const { tabCounts, getFilteredNotifications } =
    useNotificationLists(dismissedIds);
  const notifications = getFilteredNotifications(filter);
  const {
    scrollRef: listScrollRef,
    onScroll: handleListScroll,
    scrollbarClassName,
    scrollbarOverlay,
  } = useSlickScrollbar();

  return (
    <div className={cn("flex flex-col overflow-hidden bg-white", className)}>
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h2
          id={titleId}
          className="text-[15px] font-bold text-text-primary"
        >
          Notifications
        </h2>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-cream-card hover:text-text-primary"
            aria-label="Refresh notifications"
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
          </button>
        ) : null}
      </div>

      <div className="px-4 pb-3">
        <Tabs
          size="sm"
          fill
          activeTab={filter}
          onChange={(id) => onFilterChange(id as NotificationTab)}
          tabs={notificationTabs.map((tab) => ({
            id: tab.id,
            label: tab.label,
            badge: tabCounts[tab.id],
          }))}
        />
      </div>

      <div
        ref={listScrollRef}
        onScroll={handleListScroll}
        className={cn(
          "overflow-y-auto px-4 pb-3",
          scrollbarClassName,
          listClassName
        )}
      >
        {scrollbarOverlay}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream-card">
              <Bell className="h-5 w-5 text-text-muted" />
            </div>
            <p className="text-sm font-semibold text-text-primary">
              No notifications
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Nothing in this category right now.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                unread={!readIds.includes(notification.id)}
                expanded={expandedId === notification.id}
                onToggleExpand={() => onToggleExpand(notification.id)}
                onDismiss={() => onDismiss(notification.id)}
                onOpen={() => onOpenNotification(notification)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="text-xs font-medium text-text-primary underline underline-offset-2 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mark all as read
        </button>
        {onCenterClick ? (
          <button
            type="button"
            onClick={onCenterClick}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:bg-cream-card"
          >
            Go to notification center
          </button>
        ) : (
          <Link
            href={centerHref}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:bg-cream-card"
          >
            Go to notification center
          </Link>
        )}
      </div>
    </div>
  );
}
