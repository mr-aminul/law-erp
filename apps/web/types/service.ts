import type { CaseStatus } from "./case";

export type ServiceType =
  | "Legal opinions"
  | "Contracts"
  | "Agreements"
  | "Due diligence"
  | "Company registration"
  | "Notices"
  | "Legal drafting"
  | "Compliance work"
  | "Documentation";

export const SERVICE_TYPES: ServiceType[] = [
  "Legal opinions",
  "Contracts",
  "Agreements",
  "Due diligence",
  "Company registration",
  "Notices",
  "Legal drafting",
  "Compliance work",
  "Documentation",
];

export type ServiceStatus = CaseStatus;

export type ServiceStage =
  | "Intake"
  | "Drafting"
  | "Review"
  | "Delivery"
  | "Closed";

export interface Service {
  id: string;
  serviceId: string;
  matter: string;
  clientId: string;
  clientName: string;
  type: ServiceType;
  status: ServiceStatus;
  stage: ServiceStage;
  assignedLawyers: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}
