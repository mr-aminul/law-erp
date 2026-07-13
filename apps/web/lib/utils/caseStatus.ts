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
      return "border border-gray-200 bg-status-completed-surface text-status-completed shadow-none";
    case "In-Progress":
      return "border border-gray-200 bg-status-progress-surface text-status-progress shadow-none";
    case "Pending":
      return "border border-gray-200 bg-status-pending-surface text-status-pending shadow-none";
    case "On-Hold":
      return "border border-gray-200 bg-status-hold-surface text-status-hold shadow-none";
    default:
      return "border border-gray-200 bg-gray-50 text-text-primary shadow-none";
  }
}
