export type CourtLevel =
  | "Supreme Court"
  | "High Court Division"
  | "District Court"
  | "Tribunal";

export type HearingEventType =
  | "Court Hearing"
  | "Filing Deadline"
  | "Internal Meeting";

export interface Hearing {
  id: string;
  caseId: string;
  caseName: string;
  clientName: string;
  court: CourtLevel;
  courtName: string;
  bench?: string;
  judge?: string;
  date: string;
  time: string;
  type: HearingEventType;
  assignedLawyers: string[];
  adjourned?: boolean;
  adjournmentReason?: string;
  causeListRef?: string;
}
