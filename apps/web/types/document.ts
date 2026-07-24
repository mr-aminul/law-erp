export type DocumentCategory =
  | "Writ Petition"
  | "Plaint"
  | "Affidavit"
  | "Vakalatnama"
  | "Legal Notice"
  | "MOA"
  | "Title Deed"
  | "Property Record"
  | "Identity"
  | "Invoice"
  | "Receipt"
  | "Other";

export type DocumentLanguage = "English" | "Bangla" | "Bilingual";

/** Case docs have caseId; client-profile docs have clientId only; invoice files have invoiceId. */
export type DocumentScope = "case" | "client" | "invoice" | "template";

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  caseId?: string;
  caseName?: string;
  clientId?: string;
  clientName?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  language: DocumentLanguage;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  isTemplate?: boolean;
  /** People with access (staff names), same model as case assignees. */
  accessUsers: string[];
}

export function documentScope(
  doc: Pick<Document, "caseId" | "invoiceId" | "isTemplate">
): DocumentScope {
  if (doc.isTemplate) return "template";
  if (doc.invoiceId) return "invoice";
  return doc.caseId ? "case" : "client";
}

/** Compat for persisted docs that still store role-based accessLevel. */
export function documentAccessUsers(doc: {
  accessUsers?: string[];
  accessLevel?: string;
}): string[] {
  if (Array.isArray(doc.accessUsers)) return doc.accessUsers;
  return [];
}
