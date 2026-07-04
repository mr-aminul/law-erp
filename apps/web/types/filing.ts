export type FilingStatus = "Draft" | "Submitted" | "Accepted" | "Rejected";

export interface CourtFiling {
  id: string;
  filingRef: string;
  caseId: string;
  caseName: string;
  court: string;
  filingType: string;
  submittedAt: string;
  filedBy: string;
  status: FilingStatus;
  causeListRef?: string;
  processServer?: string;
  filingFee: number;
  summonsDispatched?: boolean;
  acknowledgmentReceived?: boolean;
}
