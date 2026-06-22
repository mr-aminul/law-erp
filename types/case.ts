import type { CourtLevel } from "./hearing";

export type CaseStatus =
  | "New"
  | "In-Progress"
  | "Pending"
  | "On-Hold"
  | "Completed";

export type CaseType =
  | "Civil"
  | "Criminal"
  | "Family"
  | "Corporate"
  | "Labour"
  | "Property";

export type CaseStage =
  | "Filing"
  | "Hearing"
  | "Judgment"
  | "Appeal"
  | "Closed";

export type CaseOutcome = "Won" | "Lost" | "Settled" | "Pending";

export interface OpposingParty {
  name: string;
  counsel?: string;
  contact?: string;
}

export interface Case {
  id: string;
  caseId: string;
  matter: string;
  clientId: string;
  clientName: string;
  type: CaseType;
  status: CaseStatus;
  stage: CaseStage;
  court: CourtLevel;
  courtName: string;
  caseNumber?: string;
  causeListRef?: string;
  assignedLawyers: string[];
  opposingParty?: OpposingParty;
  nextHearing?: string;
  limitationDate?: string;
  outcome?: CaseOutcome;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface CaseMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  author: string;
  content: string;
  isMemo: boolean;
  createdAt: string;
}
