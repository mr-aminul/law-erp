export type FeeStructure = "Hourly" | "Fixed" | "Retainer" | "Contingency";
export type PaymentMethod = "Cash" | "bKash" | "Bank Transfer" | "Cheque" | "Nagad";

export interface Expense {
  id: string;
  caseId: string;
  caseName: string;
  description: string;
  category: "Court Fee" | "Stamp Duty" | "Travel" | "Other";
  amount: number;
  date: string;
  recordedBy: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  method: PaymentMethod;
  receivedAt: string;
  reference?: string;
}

export interface FeeAgreement {
  id: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  structure: FeeStructure;
  rate?: number;
  fixedAmount?: number;
  retainerBalance?: number;
}
