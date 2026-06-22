import type { Case, CaseStatus } from "@/types/case";
import type { Client } from "@/types/client";
import type { Invoice } from "@/types/invoice";
import type { Staff } from "@/types/staff";

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Adv. Rahima Khan",
    initials: "RK",
    role: "Partner",
    activeCases: 12,
    attendancePercent: 96,
    status: "Active",
    capacity: 15,
    barCouncilNo: "BC-11234/2008",
    salary: 350000,
    joinDate: "2010-03-01",
    email: "rahima@ukil.ai",
    cleHours: 24,
  },
  {
    id: "2",
    name: "Adv. Tanvir Ahmed",
    initials: "TA",
    role: "Associate",
    activeCases: 8,
    attendancePercent: 92,
    status: "Active",
    capacity: 12,
    barCouncilNo: "BC-15678/2015",
    salary: 180000,
    joinDate: "2016-01-15",
    email: "tanvir@ukil.ai",
    cleHours: 18,
  },
  {
    id: "3",
    name: "Adv. Nusrat Jahan",
    initials: "NJ",
    role: "Associate",
    activeCases: 6,
    attendancePercent: 88,
    status: "Active",
    capacity: 10,
    barCouncilNo: "BC-18901/2017",
    salary: 165000,
    joinDate: "2018-06-01",
    email: "nusrat@ukil.ai",
    cleHours: 12,
  },
  {
    id: "4",
    name: "Farhana Begum",
    initials: "FB",
    role: "Paralegal",
    activeCases: 4,
    attendancePercent: 94,
    status: "Active",
    capacity: 8,
    salary: 65000,
    joinDate: "2020-02-01",
    email: "farhana@ukil.ai",
  },
];

export const mockClients: Client[] = [
  {
    id: "1",
    clientId: "CL-001",
    name: "Bashundhara Group",
    type: "Corporate",
    status: "Active",
    activeCases: 3,
    totalBilled: 2450000,
    email: "legal@bashundhara.com",
    phone: "+880 9610-012345",
    address: "Bashundhara City, Dhaka",
    registrationNo: "C-123456/2000",
    referralSource: "Existing client referral",
    conflictChecked: true,
    kycDocuments: [
      { id: "k1", type: "Trade License", expiryDate: "2026-12-31", verified: true },
    ],
    createdAt: "2020-05-10",
  },
  {
    id: "2",
    clientId: "CL-002",
    name: "Mohammad Ali",
    type: "Individual",
    status: "Active",
    activeCases: 1,
    totalBilled: 185000,
    email: "mali@gmail.com",
    phone: "+880 1711-223344",
    address: "Mirpur, Dhaka",
    nid: "1234567890123",
    conflictChecked: true,
    createdAt: "2024-11-01",
  },
  {
    id: "3",
    clientId: "CL-003",
    name: "Square Pharmaceuticals",
    type: "Corporate",
    status: "Active",
    activeCases: 2,
    totalBilled: 980000,
    email: "legal@squarepharma.com",
    registrationNo: "C-987654/1995",
    conflictChecked: true,
    createdAt: "2022-03-15",
  },
  {
    id: "4",
    clientId: "CL-004",
    name: "Rashida Akter",
    type: "Individual",
    status: "Inactive",
    activeCases: 0,
    totalBilled: 62000,
    nid: "9876543210987",
    conflictChecked: true,
    createdAt: "2023-07-20",
  },
  {
    id: "5",
    clientId: "CL-005",
    name: "BRAC NGO",
    type: "NGO",
    status: "Active",
    activeCases: 1,
    totalBilled: 320000,
    registrationNo: "NGO-AB-1234/1985",
    referralSource: "Bar association event",
    conflictChecked: true,
    createdAt: "2025-01-05",
  },
];

const caseDefaults = {
  court: "High Court Division" as const,
  courtName: "High Court Division, Dhaka",
};

export const mockCases: Case[] = [
  {
    id: "1",
    caseId: "UK-2024-0142",
    matter: "Land dispute — Gulshan Block C",
    clientId: "1",
    clientName: "Bashundhara Group",
    type: "Property",
    status: "In-Progress",
    stage: "Hearing",
    ...caseDefaults,
    caseNumber: "Writ Petition No. 4521/2024",
    causeListRef: "CL-2026-06-10-HCD-142",
    assignedLawyers: ["Adv. Rahima Khan", "Adv. Tanvir Ahmed"],
    opposingParty: { name: "Rupayan Housing Ltd.", counsel: "Adv. Kamal Hossain" },
    nextHearing: "2026-06-10",
    limitationDate: "2026-12-31",
    description: "Dispute over 2.5 katha land in Gulshan Block C.",
    createdAt: "2024-03-15",
    updatedAt: "2026-05-28",
  },
  {
    id: "2",
    caseId: "UK-2024-0198",
    matter: "Contract breach — supply agreement",
    clientId: "3",
    clientName: "Square Pharmaceuticals",
    type: "Corporate",
    status: "Pending",
    stage: "Hearing",
    court: "High Court Division",
    courtName: "High Court Division, Dhaka",
    caseNumber: "Civil Appeal No. 892/2024",
    assignedLawyers: ["Adv. Nusrat Jahan"],
    opposingParty: { name: "MedSupply BD Ltd.", counsel: "Adv. Salma Begum" },
    nextHearing: "2026-06-15",
    createdAt: "2024-06-20",
    updatedAt: "2026-05-20",
  },
  {
    id: "3",
    caseId: "UK-2025-0031",
    matter: "Divorce petition — mutual consent",
    clientId: "2",
    clientName: "Mohammad Ali",
    type: "Family",
    status: "New",
    stage: "Filing",
    court: "District Court",
    courtName: "Dhaka Family Court",
    assignedLawyers: ["Adv. Rahima Khan"],
    opposingParty: { name: "Sadia Akter" },
    nextHearing: "2026-06-05",
    createdAt: "2025-01-10",
    updatedAt: "2026-05-01",
  },
  {
    id: "4",
    caseId: "UK-2023-0087",
    matter: "Cheque dishonour — Section 138",
    clientId: "3",
    clientName: "Square Pharmaceuticals",
    type: "Criminal",
    status: "Completed",
    stage: "Closed",
    court: "District Court",
    courtName: "Chief Metropolitan Magistrate Court, Dhaka",
    caseNumber: "CR Case No. 1245/2023",
    assignedLawyers: ["Adv. Tanvir Ahmed"],
    opposingParty: { name: "Apex Traders" },
    outcome: "Won",
    createdAt: "2023-08-05",
    updatedAt: "2026-04-12",
  },
  {
    id: "5",
    caseId: "UK-2024-0256",
    matter: "Labour tribunal — wrongful termination",
    clientId: "1",
    clientName: "Bashundhara Group",
    type: "Labour",
    status: "On-Hold",
    stage: "Hearing",
    court: "Tribunal",
    courtName: "Labour Court-3, Dhaka",
    assignedLawyers: ["Adv. Nusrat Jahan", "Farhana Begum"],
    opposingParty: { name: "Former employee — Karim Uddin" },
    nextHearing: "2026-07-01",
    createdAt: "2024-09-12",
    updatedAt: "2026-03-18",
  },
  {
    id: "6",
    caseId: "UK-2025-0044",
    matter: "Civil suit — recovery of dues",
    clientId: "2",
    clientName: "Mohammad Ali",
    type: "Civil",
    status: "In-Progress",
    stage: "Hearing",
    court: "District Court",
    courtName: "1st Court of Joint District Judge, Dhaka",
    caseNumber: "Money Suit No. 234/2025",
    assignedLawyers: ["Adv. Tanvir Ahmed"],
    opposingParty: { name: "Delta Traders", counsel: "Adv. Imran Ali" },
    nextHearing: "2026-06-03",
    createdAt: "2025-02-20",
    updatedAt: "2026-05-30",
  },
  {
    id: "7",
    caseId: "UK-2024-0310",
    matter: "Arbitration — construction contract",
    clientId: "1",
    clientName: "Bashundhara Group",
    type: "Corporate",
    status: "Pending",
    stage: "Hearing",
    court: "Tribunal",
    courtName: "Arbitration Tribunal, Dhaka",
    assignedLawyers: ["Adv. Rahima Khan"],
    nextHearing: "2026-06-18",
    createdAt: "2024-11-05",
    updatedAt: "2026-05-15",
  },
  {
    id: "8",
    caseId: "UK-2025-0055",
    matter: "Property transfer — Rajshahi",
    clientId: "4",
    clientName: "Rashida Akter",
    type: "Property",
    status: "New",
    stage: "Filing",
    court: "District Court",
    courtName: "District Judge Court, Rajshahi",
    assignedLawyers: ["Adv. Nusrat Jahan"],
    nextHearing: "2026-06-12",
    createdAt: "2025-03-01",
    updatedAt: "2026-05-25",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-042",
    clientId: "1",
    clientName: "Bashundhara Group",
    caseId: "UK-2024-0142",
    caseName: "Land dispute — Gulshan Block C",
    amount: 125000,
    status: "Sent",
    dueDate: "2026-06-15",
    createdAt: "2026-05-01",
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-038",
    clientId: "3",
    clientName: "Square Pharmaceuticals",
    caseId: "UK-2024-0198",
    caseName: "Contract breach — supply agreement",
    amount: 85000,
    status: "Paid",
    dueDate: "2026-05-20",
    createdAt: "2026-04-15",
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-045",
    clientId: "2",
    clientName: "Mohammad Ali",
    caseId: "UK-2025-0031",
    caseName: "Divorce petition",
    amount: 45000,
    status: "Overdue",
    dueDate: "2026-05-01",
    createdAt: "2026-04-01",
  },
  {
    id: "4",
    invoiceNumber: "INV-2026-050",
    clientId: "1",
    clientName: "Bashundhara Group",
    caseId: "UK-2024-0256",
    caseName: "Labour tribunal",
    amount: 95000,
    status: "Draft",
    dueDate: "2026-06-30",
    createdAt: "2026-06-01",
  },
];

export const dashboardStats = {
  hearings: { today: 3, thisMonth: 18, thisYear: 142 },
  invoices: {
    count: 24,
    amount: 1845000,
    receiptCount: 18,
    receiptAmount: 1420000,
  },
  cases: { new: 8, pending: 14, completed: 42 },
  hr: { total: 12, present: 10, absent: 2 },
};

export const caseStatusChartData = [
  { name: "Completed", value: 42, color: "#2d7a4f" },
  { name: "In-Progress", value: 18, color: "#1d4ed8" },
  { name: "Pending", value: 14, color: "#b87d2b" },
  { name: "New", value: 8, color: "#5a7a6e" },
  { name: "On-Hold", value: 5, color: "#8ca89e" },
];

export const monthlyCasesData = [
  { month: "Jan", cases: 6 },
  { month: "Feb", cases: 8 },
  { month: "Mar", cases: 12 },
  { month: "Apr", cases: 9 },
  { month: "May", cases: 14 },
  { month: "Jun", cases: 11 },
  { month: "Jul", cases: 7 },
  { month: "Aug", cases: 10 },
  { month: "Sep", cases: 13 },
  { month: "Oct", cases: 8 },
  { month: "Nov", cases: 15 },
  { month: "Dec", cases: 9 },
];

export const fyCaseReport = [
  { period: "QTR1", fy2023: { pending: 8, completed: 12 }, fy2024: { pending: 6, completed: 14 }, fy2025: { pending: 5, completed: 16 } },
  { period: "QTR2", fy2023: { pending: 10, completed: 11 }, fy2024: { pending: 7, completed: 15 }, fy2025: { pending: 4, completed: 18 } },
  { period: "QTR3", fy2023: { pending: 9, completed: 13 }, fy2024: { pending: 8, completed: 12 }, fy2025: { pending: 6, completed: 14 } },
  { period: "QTR4", fy2023: { pending: 7, completed: 16 }, fy2024: { pending: 5, completed: 18 }, fy2025: { pending: 3, completed: 20 } },
  { period: "Annual", fy2023: { pending: 34, completed: 52 }, fy2024: { pending: 26, completed: 59 }, fy2025: { pending: 18, completed: 68 } },
];

export const dashboardAlerts = {
  activeClients: 28,
  inactiveClients: 6,
  overdue: 4,
  dueWithin7Days: 7,
  inProcess: 18,
};

export function filterCasesByStatus(
  cases: Case[],
  status: CaseStatus | "All"
): Case[] {
  if (status === "All") return cases;
  return cases.filter((c) => c.status === status);
}

export function getCaseById(id: string): Case | undefined {
  return mockCases.find((c) => c.id === id);
}

export function getClientById(id: string): Client | undefined {
  return mockClients.find((c) => c.id === id);
}

export function getStaffById(id: string): Staff | undefined {
  return mockStaff.find((s) => s.id === id);
}

export function getCasesByClientId(clientId: string): Case[] {
  return mockCases.filter((c) => c.clientId === clientId);
}

export function getInvoicesByClientId(clientId: string): Invoice[] {
  return mockInvoices.filter((i) => i.clientId === clientId);
}
