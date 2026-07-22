import type { InvoiceStatus } from "@/types/invoice";

/** Single source of truth for invoice status → Badge color across billing pages. */
export function invoiceStatusVariant(
  status: InvoiceStatus
): "green" | "red" | "amber" | "muted" {
  switch (status) {
    case "Paid":
      return "green";
    case "Overdue":
      return "red";
    case "Draft":
      return "muted";
    case "Sent":
    default:
      return "amber";
  }
}
