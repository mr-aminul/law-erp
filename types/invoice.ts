export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  caseId: string;
  caseName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
}
