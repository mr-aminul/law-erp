export type ClientType = "Individual" | "Corporate" | "NGO";
export type ClientStatus = "Active" | "Inactive";

export interface KycDocument {
  id: string;
  type: string;
  expiryDate?: string;
  verified: boolean;
}

export interface Client {
  id: string;
  clientId: string;
  name: string;
  type: ClientType;
  status: ClientStatus;
  activeCases: number;
  totalBilled: number;
  email?: string;
  phone?: string;
  address?: string;
  nid?: string;
  passport?: string;
  registrationNo?: string;
  referralSource?: string;
  conflictChecked: boolean;
  conflictNotes?: string;
  kycDocuments?: KycDocument[];
  createdAt: string;
}
