import type { CaseStatus } from "@/types/case";

export const CASE_STATUSES: CaseStatus[] = [
  "In-Progress",
  "Pending",
  "On-Hold",
  "Completed",
];

export type StatusBadgeVariant =
  | "green"
  | "amber"
  | "red"
  | "muted"
  | "blue";

export function getStatusVariant(status: CaseStatus): StatusBadgeVariant {
  switch (status) {
    case "Completed":
      return "green";
    case "In-Progress":
      return "blue";
    case "Pending":
      return "amber";
    case "On-Hold":
      return "muted";
    default:
      return "green";
  }
}

export function getStatusLabel(status: CaseStatus): string {
  return status;
}

export function getStatusColorClasses(status: CaseStatus): string {
  switch (status) {
    case "Completed":
      return "border border-status-completed/20 bg-status-completed-surface text-status-completed";
    case "In-Progress":
      return "border border-status-progress/20 bg-status-progress-surface text-status-progress";
    case "Pending":
      return "border border-status-pending/20 bg-status-pending-surface text-status-pending";
    case "On-Hold":
      return "border border-status-hold/20 bg-status-hold-surface text-status-hold";
    default:
      return "border border-divider/40 bg-cream-card text-text-primary";
  }
}
