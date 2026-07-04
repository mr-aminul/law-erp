export type ContactType = "Call" | "Email" | "Meeting" | "SMS" | "WhatsApp";
export type MessageChannel = "Internal" | "Email" | "SMS" | "Legal Notice";

export interface ContactLog {
  id: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  type: ContactType;
  subject: string;
  notes: string;
  loggedBy: string;
  loggedAt: string;
}

export interface CaseComment {
  id: string;
  caseId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Communication {
  id: string;
  channel: MessageChannel;
  subject: string;
  caseId?: string;
  caseName?: string;
  clientId?: string;
  clientName?: string;
  status: "Sent" | "Delivered" | "Pending" | "Failed";
  sentAt: string;
  sentBy: string;
}
