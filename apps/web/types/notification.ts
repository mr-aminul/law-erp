export type NotificationCategory =
  | "matter"
  | "hearing"
  | "billing"
  | "message"
  | "document"
  | "system";

export type NotificationKind = "firm" | "team" | "system";

export type SystemAlertVariant = "info" | "alert" | "success";

export interface NotificationMatterChip {
  label: string;
  initial: string;
  tone: "green" | "blue" | "amber" | "slate";
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  category: NotificationCategory;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read?: boolean;
  actorName?: string;
  actorInitials?: string;
  matterChip?: NotificationMatterChip;
  systemVariant?: SystemAlertVariant;
  detail?: string;
  actionLabel?: string;
  statusLabel?: string;
}

export type NotificationTab = "all" | "firm" | "system";
