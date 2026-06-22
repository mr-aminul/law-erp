export type DocumentCategory =
  | "Writ Petition"
  | "Plaint"
  | "Affidavit"
  | "Vakalatnama"
  | "Legal Notice"
  | "MOA"
  | "Other";

export type DocumentLanguage = "English" | "Bangla" | "Bilingual";

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  caseId?: string;
  caseName?: string;
  clientId?: string;
  clientName?: string;
  language: DocumentLanguage;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  isTemplate?: boolean;
  accessLevel: "Admin" | "Partner" | "Associate" | "All";
}
