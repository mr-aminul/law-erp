export type UserRole =
  | "Managing Partner"
  | "Partner"
  | "Associate"
  | "Paralegal"
  | "Clerk"
  | "Admin";

export interface FirmProfile {
  name: string;
  barCouncilReg: string;
  address: string;
  phone: string;
  email: string;
  branches: string[];
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ip?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  lastLogin?: string;
}
