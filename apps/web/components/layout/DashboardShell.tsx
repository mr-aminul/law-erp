"use client";

import { Shell } from "./Shell";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string): string {
  const titles: [RegExp | string, string][] = [
    ["/", "Dashboard"],
    ["/cases/new", "New Matter"],
    [/^\/cases\/[^/]+$/, "Case Detail"],
    ["/cases", "Matters"],
    ["/clients/new", "New Client"],
    [/^\/clients\/[^/]+$/, "Client Detail"],
    ["/clients", "Clients"],
    ["/calendar", "Calendar"],
    ["/documents/templates", "Document Templates"],
    ["/documents", "Documents"],
    ["/billing/invoices/", "Invoice Detail"],
    ["/billing/invoices", "Invoices"],
    ["/billing/time-tracking", "Time Tracking"],
    ["/billing/expenses", "Expenses"],
    ["/billing", "Billing"],
    ["/staff/attendance", "Attendance"],
    ["/staff/leave", "Leave Management"],
    ["/staff/compensation", "Payroll"],
    [/^\/staff\/[^/]+$/, "Staff Profile"],
    ["/staff", "Staff"],
    ["/court-filing/new", "New Filing"],
    ["/court-filing", "Court Filing"],
    ["/reports", "Reports & Analytics"],
    ["/communications", "Communications"],
    ["/settings/roles", "Roles & Access"],
    ["/settings/audit", "Audit Log"],
    ["/settings", "Settings"],
  ];

  for (const [pattern, title] of titles) {
    if (typeof pattern === "string") {
      if (pathname === pattern) return title;
    } else if (pattern.test(pathname)) {
      return title;
    }
  }
  return "UKIL.ai";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <Shell title={getPageTitle(pathname)}>{children}</Shell>;
}
