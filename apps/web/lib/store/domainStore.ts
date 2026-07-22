"use client";

import {
  mockCases,
  mockClients,
  mockFilings,
  mockHearings,
} from "@/lib/mock";
import type { Case, CaseStatus, CaseType } from "@/types/case";
import type { Client, ClientStatus, ClientType } from "@/types/client";
import type { CourtFiling, FilingStatus } from "@/types/filing";
import type { CourtLevel, Hearing, HearingEventType } from "@/types/hearing";
import { create } from "zustand";
import { persist } from "zustand/middleware";

function nextNumericId(items: { id: string }[]): string {
  const max = items.reduce((acc, item) => {
    const n = Number(item.id);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return String(max + 1);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function clientCode(id: string) {
  return `CL-${id.padStart(3, "0")}`;
}

function caseCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function filingRef(id: string) {
  return `FL-${new Date().getFullYear()}-${id.padStart(3, "0")}`;
}

export type CreateClientInput = {
  name: string;
  type: ClientType;
  email?: string;
  phone?: string;
  address?: string;
  nid?: string;
  passport?: string;
  registrationNo?: string;
  referralSource?: string;
  conflictChecked: boolean;
  conflictNotes?: string;
};

export type UpdateClientInput = Partial<
  Omit<Client, "id" | "clientId" | "createdAt">
>;

export type CreateCaseInput = {
  matter: string;
  clientId: string;
  type: CaseType | string;
  court: CourtLevel;
  courtName: string;
  caseNumber?: string;
  description?: string;
  status?: CaseStatus;
  assignedLawyers: string[];
  opposingParty?: { name: string; counsel?: string };
  nextHearing?: string;
  limitationDate?: string;
};

export type UpdateCaseInput = Partial<
  Omit<Case, "id" | "caseId" | "createdAt">
>;

export type CreateHearingInput = {
  caseId: string;
  date: string;
  time: string;
  type: HearingEventType;
  court?: CourtLevel;
  courtName?: string;
  bench?: string;
  judge?: string;
  causeListRef?: string;
  assignedLawyers?: string[];
};

export type UpdateHearingInput = Partial<Omit<Hearing, "id">>;

export type CreateFilingInput = {
  caseId: string;
  court: string;
  filingType: string;
  submittedAt: string;
  causeListRef?: string;
  processServer?: string;
  filingFee?: number;
  status?: FilingStatus;
};

export type UpdateFilingInput = Partial<Omit<CourtFiling, "id" | "filingRef">>;

interface DomainState {
  clients: Client[];
  cases: Case[];
  hearings: Hearing[];
  filings: CourtFiling[];
  hydrated: boolean;
  setHydrated: (value: boolean) => void;

  createClient: (input: CreateClientInput) => Client;
  updateClient: (id: string, input: UpdateClientInput) => Client | null;
  getClient: (id: string) => Client | undefined;

  createCase: (input: CreateCaseInput) => Case;
  updateCase: (id: string, input: UpdateCaseInput) => Case | null;
  getCase: (id: string) => Case | undefined;

  createHearing: (input: CreateHearingInput) => Hearing | null;
  updateHearing: (id: string, input: UpdateHearingInput) => Hearing | null;

  createFiling: (input: CreateFilingInput) => CourtFiling | null;
  updateFiling: (id: string, input: UpdateFilingInput) => CourtFiling | null;
}

export const useDomainStore = create<DomainState>()(
  persist(
    (set, get) => ({
      clients: mockClients,
      cases: mockCases,
      hearings: mockHearings,
      filings: mockFilings,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),

      getClient: (id) => get().clients.find((c) => c.id === id),
      getCase: (id) => get().cases.find((c) => c.id === id),

      createClient: (input) => {
        const id = nextNumericId(get().clients);
        const client: Client = {
          id,
          clientId: clientCode(id),
          name: input.name.trim(),
          type: input.type,
          status: "Active",
          activeCases: 0,
          totalBilled: 0,
          email: input.email?.trim() || undefined,
          phone: input.phone?.trim() || undefined,
          address: input.address?.trim() || undefined,
          nid: input.nid?.trim() || undefined,
          passport: input.passport?.trim() || undefined,
          registrationNo: input.registrationNo?.trim() || undefined,
          referralSource: input.referralSource?.trim() || undefined,
          conflictChecked: input.conflictChecked,
          conflictNotes: input.conflictNotes?.trim() || undefined,
          createdAt: todayIso(),
        };
        set((state) => ({ clients: [client, ...state.clients] }));
        return client;
      },

      updateClient: (id, input) => {
        let updated: Client | null = null;
        set((state) => ({
          clients: state.clients.map((client) => {
            if (client.id !== id) return client;
            updated = { ...client, ...input };
            return updated;
          }),
        }));
        return updated;
      },

      createCase: (input) => {
        const client = get().getClient(input.clientId);
        const id = nextNumericId(get().cases);
        const now = todayIso();
        const matterCase: Case = {
          id,
          caseId: caseCode(),
          matter: input.matter.trim(),
          clientId: input.clientId,
          clientName: client?.name ?? "Unknown client",
          type: (input.type as CaseType) || "Civil",
          status: input.status ?? "Pending",
          stage: "Filing",
          court: input.court,
          courtName: input.courtName.trim(),
          caseNumber: input.caseNumber?.trim() || undefined,
          assignedLawyers: input.assignedLawyers,
          opposingParty: input.opposingParty?.name
            ? {
                name: input.opposingParty.name.trim(),
                counsel: input.opposingParty.counsel?.trim() || undefined,
              }
            : undefined,
          nextHearing: input.nextHearing || undefined,
          limitationDate: input.limitationDate || undefined,
          description: input.description?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          cases: [matterCase, ...state.cases],
          clients: state.clients.map((c) =>
            c.id === input.clientId
              ? { ...c, activeCases: c.activeCases + 1, status: "Active" as ClientStatus }
              : c
          ),
        }));

        if (input.nextHearing) {
          get().createHearing({
            caseId: id,
            date: input.nextHearing,
            time: "10:00",
            type: "Court Hearing",
            court: input.court,
            courtName: input.courtName,
            assignedLawyers: input.assignedLawyers,
          });
        }

        return matterCase;
      },

      updateCase: (id, input) => {
        let updated: Case | null = null;
        set((state) => ({
          cases: state.cases.map((matter) => {
            if (matter.id !== id) return matter;
            updated = {
              ...matter,
              ...input,
              updatedAt: todayIso(),
              clientName:
                input.clientId && input.clientId !== matter.clientId
                  ? state.clients.find((c) => c.id === input.clientId)?.name ??
                    matter.clientName
                  : input.clientName ?? matter.clientName,
            };
            return updated;
          }),
        }));
        return updated;
      },

      createHearing: (input) => {
        const matter = get().getCase(input.caseId);
        if (!matter) return null;
        const id = nextNumericId(get().hearings);
        const hearing: Hearing = {
          id,
          caseId: matter.id,
          caseName: matter.matter,
          clientName: matter.clientName,
          court: input.court ?? matter.court,
          courtName: input.courtName ?? matter.courtName,
          bench: input.bench?.trim() || undefined,
          judge: input.judge?.trim() || undefined,
          date: input.date,
          time: input.time,
          type: input.type,
          assignedLawyers: input.assignedLawyers?.length
            ? input.assignedLawyers
            : matter.assignedLawyers,
          causeListRef: input.causeListRef?.trim() || undefined,
        };
        set((state) => ({
          hearings: [hearing, ...state.hearings],
          cases: state.cases.map((c) =>
            c.id === matter.id
              ? {
                  ...c,
                  nextHearing:
                    !c.nextHearing || input.date <= c.nextHearing
                      ? input.date
                      : c.nextHearing,
                  updatedAt: todayIso(),
                }
              : c
          ),
        }));
        return hearing;
      },

      updateHearing: (id, input) => {
        let updated: Hearing | null = null;
        set((state) => ({
          hearings: state.hearings.map((hearing) => {
            if (hearing.id !== id) return hearing;
            updated = { ...hearing, ...input };
            return updated;
          }),
        }));
        return updated;
      },

      createFiling: (input) => {
        const matter = get().getCase(input.caseId);
        if (!matter) return null;
        const id = nextNumericId(get().filings);
        const filing: CourtFiling = {
          id,
          filingRef: filingRef(id),
          caseId: matter.id,
          caseName: matter.matter,
          court: input.court.trim(),
          filingType: input.filingType,
          submittedAt: input.submittedAt,
          filedBy: matter.assignedLawyers[0] ?? "Firm",
          status: input.status ?? "Submitted",
          causeListRef: input.causeListRef?.trim() || undefined,
          processServer: input.processServer?.trim() || undefined,
          filingFee: input.filingFee ?? 0,
        };
        set((state) => ({ filings: [filing, ...state.filings] }));
        return filing;
      },

      updateFiling: (id, input) => {
        let updated: CourtFiling | null = null;
        set((state) => ({
          filings: state.filings.map((filing) => {
            if (filing.id !== id) return filing;
            updated = { ...filing, ...input };
            return updated;
          }),
        }));
        return updated;
      },
    }),
    {
      name: "ukil-domain-v1",
      partialize: (state) => ({
        clients: state.clients,
        cases: state.cases,
        hearings: state.hearings,
        filings: state.filings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
