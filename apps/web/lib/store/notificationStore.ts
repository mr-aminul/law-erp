import { mockNotifications } from "@/lib/mock/notifications";
import type { NotificationTab } from "@/types/notification";
import { create } from "zustand";

function getInitialReadIds(): string[] {
  return mockNotifications.filter((n) => n.read).map((n) => n.id);
}

interface NotificationState {
  drawerOpen: boolean;
  readIds: string[];
  dismissedIds: string[];
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  refresh: () => void;
  isRead: (id: string) => boolean;
  unreadCount: () => number;
  visibleNotifications: (tab: NotificationTab) => typeof mockNotifications;
  tabCount: (tab: NotificationTab) => number;
}

function sortNotifications(notifications: typeof mockNotifications) {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function filterByTab(
  notifications: typeof mockNotifications,
  tab: NotificationTab
) {
  if (tab === "all") return notifications;
  if (tab === "firm") {
    return notifications.filter((notification) => notification.kind === "firm");
  }
  return notifications.filter((notification) => notification.kind === "system");
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  drawerOpen: false,
  readIds: getInitialReadIds(),
  dismissedIds: [],

  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),

  markRead: (id) =>
    set((state) =>
      state.readIds.includes(id)
        ? state
        : { readIds: [...state.readIds, id] }
    ),

  markAllRead: () =>
    set({
      readIds: mockNotifications
        .filter((notification) => !get().dismissedIds.includes(notification.id))
        .map((notification) => notification.id),
    }),

  dismiss: (id) =>
    set((state) => ({
      dismissedIds: state.dismissedIds.includes(id)
        ? state.dismissedIds
        : [...state.dismissedIds, id],
      readIds: state.readIds.includes(id)
        ? state.readIds
        : [...state.readIds, id],
    })),

  refresh: () =>
    set({
      readIds: getInitialReadIds(),
      dismissedIds: [],
    }),

  isRead: (id) => get().readIds.includes(id),

  unreadCount: () =>
    mockNotifications.filter(
      (notification) =>
        !get().dismissedIds.includes(notification.id) &&
        !get().isRead(notification.id)
    ).length,

  visibleNotifications: (tab) => {
    const active = mockNotifications.filter(
      (notification) => !get().dismissedIds.includes(notification.id)
    );
    return sortNotifications(filterByTab(active, tab));
  },

  tabCount: (tab) => get().visibleNotifications(tab).length,
}));
