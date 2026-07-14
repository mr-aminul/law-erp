export const mainNav = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  {
    href: "/cases",
    label: "Matters",
    icon: "Folder",
    children: [
      { href: "/cases", label: "Cases", icon: "Briefcase" },
      { href: "/cases/services", label: "Services", icon: "Handshake" },
    ],
  },
  { href: "/clients", label: "Clients", icon: "Users" },
  { href: "/calendar", label: "Calendar", icon: "Calendar" },
  { href: "/documents", label: "Documents", icon: "FileText" },
  {
    href: "/billing",
    label: "Billing",
    icon: "CreditCard",
    children: [
      { href: "/billing", label: "Overview", icon: "LayoutDashboard" },
      { href: "/billing/invoices", label: "Invoices", icon: "Receipt" },
      { href: "/billing/expenses", label: "Expenses", icon: "Wallet" },
    ],
  },
  {
    href: "/staff",
    label: "Staff",
    icon: "Scale",
    children: [
      { href: "/staff", label: "Directory", icon: "ContactRound" },
      { href: "/staff/attendance", label: "Attendance", icon: "Clock" },
      { href: "/staff/leave", label: "Leave", icon: "CalendarOff" },
      { href: "/staff/compensation", label: "Payroll", icon: "Banknote" },
    ],
  },
  { href: "/court-filing", label: "Court Filing", icon: "Gavel" },
  { href: "/reports", label: "Reports", icon: "BarChart3" },
  {
    href: "/communications",
    label: "Communications",
    icon: "MessageSquare",
    children: [
      { href: "/communications", label: "All", icon: "LayoutDashboard" },
      { href: "/communications/internal", label: "Internal", icon: "MessagesSquare" },
      { href: "/communications/email", label: "Email Log", icon: "Mail" },
      { href: "/communications/notices", label: "Legal Notices", icon: "ScrollText" },
    ],
  },
] as const;

export const documentsSubNav = [
  { href: "/documents", label: "Repository" },
  { href: "/documents/templates", label: "Templates" },
];

export const settingsSubNav = [
  { href: "/settings", label: "Firm Profile" },
  { href: "/settings/roles", label: "Roles & Access" },
  { href: "/settings/audit", label: "Audit Log" },
];

export const communicationsSubNav = [
  { href: "/communications", label: "All", exact: true },
  { href: "/communications/internal", label: "Internal" },
  { href: "/communications/email", label: "Email Log" },
  { href: "/communications/notices", label: "Legal Notices" },
];
