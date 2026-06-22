import type { CaseStatus } from "@/types/case";

export const CASE_STATUSES: CaseStatus[] = [
  "New",
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
    case "New":
    default:
      return "green";
  }
}

export function getStatusLabel(status: CaseStatus): string {
  return status;
}
