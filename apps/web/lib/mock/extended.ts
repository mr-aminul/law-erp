import type { AuditEntry, FirmProfile, SystemUser } from "@/types/admin";
import type { Expense, FeeAgreement, Payment, TimeEntry } from "@/types/billing";
import type { CaseComment, Communication, ContactLog } from "@/types/communication";
import type { CaseMilestone, CaseNote } from "@/types/case";
import type { Document } from "@/types/document";
import type { CourtFiling } from "@/types/filing";
import type { Hearing } from "@/types/hearing";
import type { AttendanceRecord, CompensationRecord, LeaveRequest } from "@/types/staff";

export const mockHearings: Hearing[] = [
  {
    id: "h1",
    caseId: "1",
    caseName: "Land dispute — Gulshan Block C",
    clientName: "Bashundhara Group",
    court: "High Court Division",
    courtName: "High Court Division, Dhaka",
    bench: "Bench-3",
    judge: "Hon. Justice Md. Ashfaq",
    date: "2026-06-10",
    time: "10:30",
    type: "Court Hearing",
    assignedLawyers: ["Adv. Rahima Khan"],
    causeListRef: "CL-2026-06-10-HCD-142",
  },
  {
    id: "h2",
    caseId: "3",
    caseName: "Divorce petition — mutual consent",
    clientName: "Mohammad Ali",
    court: "District Court",
    courtName: "Dhaka Family Court",
    date: "2026-06-05",
    time: "11:00",
    type: "Court Hearing",
    assignedLawyers: ["Adv. Rahima Khan"],
  },
  {
    id: "h3",
    caseId: "6",
    caseName: "Civil suit — recovery of dues",
    clientName: "Mohammad Ali",
    court: "District Court",
    courtName: "1st Court of Joint District Judge, Dhaka",
    date: "2026-06-03",
    time: "09:00",
    type: "Court Hearing",
    assignedLawyers: ["Adv. Tanvir Ahmed"],
  },
  {
    id: "h4",
    caseId: "2",
    caseName: "Contract breach — supply agreement",
    clientName: "Square Pharmaceuticals",
    court: "High Court Division",
    courtName: "High Court Division, Dhaka",
    date: "2026-06-15",
    time: "14:00",
    type: "Court Hearing",
    assignedLawyers: ["Adv. Nusrat Jahan"],
    adjourned: true,
    adjournmentReason: "Opposing counsel requested extension",
  },
  {
    id: "h5",
    caseId: "5",
    caseName: "Labour tribunal — wrongful termination",
    clientName: "Bashundhara Group",
    court: "Tribunal",
    courtName: "Labour Court-3, Dhaka",
    date: "2026-06-20",
    time: "10:00",
    type: "Filing Deadline",
    assignedLawyers: ["Adv. Nusrat Jahan"],
  },
];

export const mockDocuments: Document[] = [
  {
    id: "d1",
    name: "Writ Petition — Gulshan Land Dispute",
    category: "Writ Petition",
    caseId: "1",
    caseName: "Land dispute — Gulshan Block C",
    clientName: "Bashundhara Group",
    language: "English",
    version: 3,
    uploadedBy: "Adv. Tanvir Ahmed",
    uploadedAt: "2026-05-20",
    size: "2.4 MB",
    accessLevel: "Partner",
  },
  {
    id: "d2",
    name: "Vakalatnama — Mohammad Ali",
    category: "Vakalatnama",
    caseId: "3",
    caseName: "Divorce petition",
    clientName: "Mohammad Ali",
    language: "Bangla",
    version: 1,
    uploadedBy: "Farhana Begum",
    uploadedAt: "2026-05-01",
    size: "540 KB",
    accessLevel: "All",
  },
  {
    id: "d3",
    name: "Legal Notice — Supply Agreement Breach",
    category: "Legal Notice",
    caseId: "2",
    caseName: "Contract breach",
    clientName: "Square Pharmaceuticals",
    language: "Bilingual",
    version: 2,
    uploadedBy: "Adv. Nusrat Jahan",
    uploadedAt: "2026-04-10",
    size: "890 KB",
    accessLevel: "Associate",
  },
  {
    id: "d4",
    name: "Writ Petition Template",
    category: "Writ Petition",
    language: "English",
    version: 1,
    uploadedBy: "Admin",
    uploadedAt: "2025-01-01",
    size: "120 KB",
    isTemplate: true,
    accessLevel: "All",
  },
  {
    id: "d5",
    name: "Affidavit Template",
    category: "Affidavit",
    language: "Bilingual",
    version: 1,
    uploadedBy: "Admin",
    uploadedAt: "2025-01-01",
    size: "95 KB",
    isTemplate: true,
    accessLevel: "All",
  },
];

export const mockFilings: CourtFiling[] = [
  {
    id: "f1",
    filingRef: "FIL-2026-018",
    caseId: "1",
    caseName: "Land dispute — Gulshan Block C",
    court: "High Court Division, Dhaka",
    filingType: "Writ Petition",
    submittedAt: "2026-05-15",
    filedBy: "Adv. Rahima Khan",
    status: "Accepted",
    causeListRef: "CL-2026-06-10-HCD-142",
    processServer: "Karim Uddin",
    filingFee: 2500,
    summonsDispatched: true,
    acknowledgmentReceived: true,
  },
  {
    id: "f2",
    filingRef: "FIL-2026-022",
    caseId: "6",
    caseName: "Civil suit — recovery of dues",
    court: "1st Court of Joint District Judge, Dhaka",
    filingType: "Plaint",
    submittedAt: "2026-05-28",
    filedBy: "Adv. Tanvir Ahmed",
    status: "Submitted",
    filingFee: 1800,
    summonsDispatched: false,
  },
];

export const mockExpenses: Expense[] = [
  {
    id: "e1",
    caseId: "1",
    caseName: "Land dispute — Gulshan Block C",
    description: "Court fee — writ admission",
    category: "Court Fee",
    amount: 2500,
    date: "2026-05-15",
    recordedBy: "Farhana Begum",
  },
  {
    id: "e2",
    caseId: "1",
    caseName: "Land dispute — Gulshan Block C",
    description: "Stamp duty on vakalatnama",
    category: "Stamp Duty",
    amount: 500,
    date: "2026-05-16",
    recordedBy: "Farhana Begum",
  },
  {
    id: "e3",
    caseId: "6",
    caseName: "Civil suit — recovery of dues",
    description: "Travel — court appearance",
    category: "Travel",
    amount: 1200,
    date: "2026-06-03",
    recordedBy: "Adv. Tanvir Ahmed",
  },
];

export const mockPayments: Payment[] = [
  {
    id: "p1",
    invoiceId: "2",
    invoiceNumber: "INV-2026-038",
    clientName: "Square Pharmaceuticals",
    amount: 85000,
    method: "Bank Transfer",
    receivedAt: "2026-05-18",
    reference: "TXN-884521",
  },
  {
    id: "p2",
    invoiceId: "1",
    invoiceNumber: "INV-2026-042",
    clientName: "Bashundhara Group",
    amount: 50000,
    method: "bKash",
    receivedAt: "2026-05-25",
    reference: "BK-9928341",
  },
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: "t1",
    date: "2026-06-01",
    lawyer: "Adv. Rahima Khan",
    caseId: "1",
    caseName: "Land dispute — Gulshan Block C",
    description: "Drafted reply to preliminary objection",
    hours: 3.5,
    rate: 15000,
    billable: true,
  },
  {
    id: "t2",
    date: "2026-06-02",
    lawyer: "Adv. Tanvir Ahmed",
    caseId: "6",
    caseName: "Civil suit — recovery of dues",
    description: "Court appearance and client briefing",
    hours: 5,
    rate: 8000,
    billable: true,
  },
  {
    id: "t3",
    date: "2026-06-02",
    lawyer: "Adv. Nusrat Jahan",
    caseId: "2",
    caseName: "Contract breach",
    description: "Document review and research",
    hours: 2,
    rate: 8000,
    billable: true,
  },
];

export const mockFeeAgreements: FeeAgreement[] = [
  {
    id: "fa1",
    clientId: "1",
    clientName: "Bashundhara Group",
    caseId: "1",
    structure: "Retainer",
    retainerBalance: 450000,
  },
  {
    id: "fa2",
    clientId: "2",
    clientName: "Mohammad Ali",
    caseId: "3",
    structure: "Fixed",
    fixedAmount: 75000,
  },
  {
    id: "fa3",
    clientId: "3",
    clientName: "Square Pharmaceuticals",
    structure: "Hourly",
    rate: 12000,
  },
];

export const mockContactLogs: ContactLog[] = [
  {
    id: "cl1",
    clientId: "1",
    clientName: "Bashundhara Group",
    caseId: "1",
    type: "Meeting",
    subject: "Case strategy review",
    notes: "Discussed interim relief options with client legal team.",
    loggedBy: "Adv. Rahima Khan",
    loggedAt: "2026-05-28T14:00:00",
  },
  {
    id: "cl2",
    clientId: "2",
    clientName: "Mohammad Ali",
    type: "Call",
    subject: "Hearing date confirmation",
    notes: "Confirmed attendance for 5 June family court hearing.",
    loggedBy: "Farhana Begum",
    loggedAt: "2026-06-01T10:30:00",
  },
];

export const mockCaseComments: CaseComment[] = [
  {
    id: "cc1",
    caseId: "1",
    author: "Adv. Tanvir Ahmed",
    content: "Draft reply submitted. Awaiting court date for hearing on preliminary objection.",
    createdAt: "2026-05-29T16:00:00",
  },
  {
    id: "cc2",
    caseId: "1",
    author: "Farhana Begum",
    content: "Updated cause list reference — CL-2026-06-10-HCD-142.",
    createdAt: "2026-05-30T09:15:00",
  },
];

export const mockServiceComments: CaseComment[] = [
  {
    id: "sc1",
    caseId: "1",
    author: "Adv. Rahima Khan",
    content: "First draft of opinion circulated for partner review.",
    createdAt: "2026-05-22T11:00:00",
  },
  {
    id: "sc2",
    caseId: "1",
    author: "Farhana Begum",
    content: "Pulled title deeds from client vault — attached to Documents.",
    createdAt: "2026-05-25T14:30:00",
  },
];

export const mockCommunications: Communication[] = [
  {
    id: "cm1",
    channel: "Email",
    subject: "Hearing reminder — 10 June",
    caseId: "1",
    caseName: "Land dispute — Gulshan Block C",
    clientId: "1",
    clientName: "Bashundhara Group",
    status: "Delivered",
    sentAt: "2026-06-08T09:00:00",
    sentBy: "System",
  },
  {
    id: "cm2",
    channel: "Legal Notice",
    subject: "Demand notice — supply agreement breach",
    caseId: "2",
    caseName: "Contract breach",
    clientId: "3",
    clientName: "Square Pharmaceuticals",
    status: "Sent",
    sentAt: "2026-04-10T11:00:00",
    sentBy: "Adv. Nusrat Jahan",
  },
  {
    id: "cm3",
    channel: "SMS",
    subject: "Cause list published — hearing tomorrow",
    caseId: "6",
    caseName: "Civil suit — recovery of dues",
    clientId: "2",
    clientName: "Mohammad Ali",
    status: "Delivered",
    sentAt: "2026-06-02T18:00:00",
    sentBy: "System",
  },
];

export const mockMilestones: CaseMilestone[] = [
  { id: "m1", title: "Case filed", completed: true, dueDate: "2024-03-15" },
  { id: "m2", title: "Preliminary objection filed", completed: true, dueDate: "2024-08-01" },
  { id: "m3", title: "Interim hearing", completed: true, dueDate: "2025-02-10" },
  { id: "m4", title: "Final hearing", completed: false, dueDate: "2026-06-10" },
  { id: "m5", title: "Judgment", completed: false, dueDate: "2026-09-01" },
];

// ponytail: service milestones until services API exists
export const mockServiceMilestones: CaseMilestone[] = [
  { id: "sm1", title: "Brief received", completed: true, dueDate: "2026-05-10" },
  { id: "sm2", title: "First draft prepared", completed: true, dueDate: "2026-05-22" },
  { id: "sm3", title: "Internal review", completed: false, dueDate: "2026-06-05" },
  { id: "sm4", title: "Client feedback", completed: false, dueDate: "2026-06-12" },
  { id: "sm5", title: "Final delivery", completed: false, dueDate: "2026-06-20" },
];

export const mockCaseNotes: CaseNote[] = [
  {
    id: "n1",
    caseId: "1",
    author: "Adv. Rahima Khan",
    content: "Client prefers settlement if opposite party agrees to boundary demarcation.",
    isMemo: false,
    createdAt: "2026-05-10",
  },
  {
    id: "n2",
    caseId: "1",
    author: "Adv. Tanvir Ahmed",
    content: "INTERNAL: Evaluate appeal strategy if writ is dismissed at admission stage.",
    isMemo: true,
    createdAt: "2026-05-22",
  },
];

export const mockServiceNotes: CaseNote[] = [
  {
    id: "sn1",
    caseId: "1",
    author: "Adv. Rahima Khan",
    content: "Client asked for risk matrix covering RAJUK and title defects.",
    isMemo: false,
    createdAt: "2026-05-12",
  },
  {
    id: "sn2",
    caseId: "1",
    author: "Adv. Rahima Khan",
    content: "INTERNAL: Cross-check with prior Gulshan Block C opinion before circulating.",
    isMemo: true,
    createdAt: "2026-05-28",
  },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: "a1", staffId: "1", staffName: "Adv. Rahima Khan", date: "2026-06-03", status: "Present" },
  { id: "a2", staffId: "2", staffName: "Adv. Tanvir Ahmed", date: "2026-06-03", status: "Present" },
  { id: "a3", staffId: "3", staffName: "Adv. Nusrat Jahan", date: "2026-06-03", status: "Late" },
  { id: "a4", staffId: "4", staffName: "Farhana Begum", date: "2026-06-03", status: "Present" },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "lr1",
    staffId: "3",
    staffName: "Adv. Nusrat Jahan",
    type: "Annual",
    from: "2026-06-15",
    to: "2026-06-17",
    status: "Pending",
    reason: "Family event in Sylhet",
  },
];

export const mockCompensation: CompensationRecord[] = [
  {
    id: "cr1",
    staffId: "1",
    staffName: "Adv. Rahima Khan",
    month: "May 2026",
    grossSalary: 350000,
    tds: 35000,
    netSalary: 315000,
    paidAt: "2026-05-28",
  },
  {
    id: "cr2",
    staffId: "2",
    staffName: "Adv. Tanvir Ahmed",
    month: "May 2026",
    grossSalary: 180000,
    tds: 18000,
    netSalary: 162000,
    paidAt: "2026-05-28",
  },
];

export const mockFirmProfile: FirmProfile = {
  name: "UKIL & Associates",
  barCouncilReg: "BC-2847/2010",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
  phone: "+880 1712-345678",
  email: "contact@ukil.ai",
  branches: ["Dhaka", "Chittagong"],
};

export const mockSystemUsers: SystemUser[] = [
  {
    id: "u1",
    name: "Aminul Islam",
    email: "aminul@ukil.ai",
    role: "Managing Partner",
    status: "Active",
    lastLogin: "2026-06-03T08:30:00",
  },
  {
    id: "u2",
    name: "Adv. Rahima Khan",
    email: "rahima@ukil.ai",
    role: "Partner",
    status: "Active",
    lastLogin: "2026-06-03T09:00:00",
  },
  {
    id: "u3",
    name: "Farhana Begum",
    email: "farhana@ukil.ai",
    role: "Paralegal",
    status: "Active",
    lastLogin: "2026-06-02T17:45:00",
  },
];

export const mockAuditLog: AuditEntry[] = [
  {
    id: "al1",
    user: "Adv. Rahima Khan",
    action: "Updated case status",
    resource: "K4M9P2",
    timestamp: "2026-06-03T10:15:00",
    ip: "103.24.1.45",
  },
  {
    id: "al2",
    user: "Farhana Begum",
    action: "Uploaded document",
    resource: "Writ Petition v3",
    timestamp: "2026-06-02T14:30:00",
    ip: "103.24.1.52",
  },
  {
    id: "al3",
    user: "Aminul Islam",
    action: "Approved leave request",
    resource: "Adv. Nusrat Jahan",
    timestamp: "2026-06-01T11:00:00",
    ip: "103.24.1.10",
  },
];
