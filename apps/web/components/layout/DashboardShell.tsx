"use client";

import { Shell } from "./Shell";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  Calendar,
  CreditCard,
  FileText,
  Gavel,
  Handshake,
  LayoutDashboard,
  MessageSquare,
  Scale,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

function getPageTitle(pathname: string): string {
  const titles: [RegExp | string, string][] = [
    ["/", "Dashboard"],
    ["/cases/new", "New Case"],
    [/^\/cases\/services\/[^/]+$/, "Service Detail"],
    ["/cases/services", "Services"],
    [/^\/cases\/[^/]+$/, "Case Detail"],
    ["/cases", "Cases"],
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

function getPageIcon(pathname: string): LucideIcon {
  // Match sidebar icons — most specific paths first
  if (pathname.startsWith("/cases/services")) return Handshake;
  if (pathname.startsWith("/cases")) return Briefcase;
  if (pathname.startsWith("/clients")) return Users;
  if (pathname.startsWith("/calendar")) return Calendar;
  if (pathname.startsWith("/documents")) return FileText;
  if (pathname.startsWith("/billing")) return CreditCard;
  if (pathname.startsWith("/staff")) return Scale;
  if (pathname.startsWith("/court-filing")) return Gavel;
  if (pathname.startsWith("/reports")) return BarChart3;
  if (pathname.startsWith("/communications")) return MessageSquare;
  if (pathname.startsWith("/settings")) return Settings;
  if (pathname === "/") return LayoutDashboard;
  return LayoutDashboard;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Shell title={getPageTitle(pathname)} icon={getPageIcon(pathname)}>
      {children}
    </Shell>
  );
}
