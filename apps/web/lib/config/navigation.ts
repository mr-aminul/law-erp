export const mainNav = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/cases", label: "Cases", icon: "Briefcase" },
  { href: "/clients", label: "Clients", icon: "Users" },
  { href: "/calendar", label: "Calendar", icon: "Calendar" },
  { href: "/documents", label: "Documents", icon: "FileText" },
  { href: "/billing", label: "Billing", icon: "CreditCard" },
  { href: "/staff", label: "Staff", icon: "Scale" },
  { href: "/court-filing", label: "Court Filing", icon: "Gavel" },
  { href: "/reports", label: "Reports", icon: "BarChart3" },
  { href: "/communications", label: "Communications", icon: "MessageSquare" },
] as const;

export const billingSubNav = [
  { href: "/billing", label: "Overview" },
  { href: "/billing/invoices", label: "Invoices" },
  { href: "/billing/time-tracking", label: "Time Tracking" },
  { href: "/billing/expenses", label: "Expenses" },
];

export const staffSubNav = [
  { href: "/staff", label: "Directory" },
  { href: "/staff/attendance", label: "Attendance" },
  { href: "/staff/leave", label: "Leave" },
  { href: "/staff/compensation", label: "Payroll" },
];

export const documentsSubNav = [
  { href: "/documents", label: "Repository" },
  { href: "/documents/templates", label: "Templates" },
];

export const settingsSubNav = [
  { href: "/settings", label: "Firm Profile" },
  { href: "/settings/roles", label: "Roles & Access" },
  { href: "/settings/audit", label: "Audit Log" },
];

export const courtFilingSubNav = [
  { href: "/court-filing", label: "Registry" },
  { href: "/court-filing/new", label: "New Filing" },
];

export const communicationsSubNav = [
  { href: "/communications", label: "All" },
  { href: "/communications?tab=internal", label: "Internal" },
  { href: "/communications?tab=email", label: "Email Log" },
  { href: "/communications?tab=notices", label: "Legal Notices" },
];
