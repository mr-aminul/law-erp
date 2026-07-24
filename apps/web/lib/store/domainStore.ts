"use client";

import {
  mockCases,
  mockClients,
  mockDocuments,
  mockFilings,
  mockHearings,
  mockInvoices,
} from "@/lib/mock";
import type { Case, CaseStatus, CaseType } from "@/types/case";
import type { Client, ClientStatus, ClientType } from "@/types/client";
import type {
  Document,
  DocumentCategory,
  DocumentLanguage,
} from "@/types/document";
import { documentAccessUsers } from "@/types/document";
import type { CourtFiling, FilingStatus } from "@/types/filing";
import type { CourtLevel, Hearing, HearingEventType } from "@/types/hearing";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
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

function nextInvoiceNumber(invoices: Invoice[]) {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  let max = 0;
  for (const inv of invoices) {
    if (!inv.invoiceNumber.startsWith(prefix)) continue;
    const n = Number(inv.invoiceNumber.slice(prefix.length));
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
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

export type CreateInvoiceInput = {
  /** Domain case `id` (numeric store key). */
  caseId: string;
  amount: number;
  dueDate: string;
  status?: InvoiceStatus;
};

export type UpdateInvoiceInput = Partial<
  Omit<Invoice, "id" | "invoiceNumber" | "createdAt">
>;

export type CreateDocumentInput = {
  name: string;
  category: DocumentCategory;
  language: DocumentLanguage;
  accessUsers: string[];
  size?: string;
  /** Case-linked document (also stamps client from the case). */
  caseId?: string;
  /** Client-profile document (no case). Ignored when caseId or invoiceId is set. */
  clientId?: string;
  /** Invoice attachment (also stamps client / case from the invoice). */
  invoiceId?: string;
};

interface DomainState {
  clients: Client[];
  cases: Case[];
  hearings: Hearing[];
  filings: CourtFiling[];
  invoices: Invoice[];
  documents: Document[];
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

  createInvoice: (input: CreateInvoiceInput) => Invoice | null;
  updateInvoice: (id: string, input: UpdateInvoiceInput) => Invoice | null;
  getInvoice: (id: string) => Invoice | undefined;

  createDocument: (input: CreateDocumentInput) => Document | null;
}

export const useDomainStore = create<DomainState>()(
  persist(
    (set, get) => ({
      clients: mockClients,
      cases: mockCases,
      hearings: mockHearings,
      filings: mockFilings,
      invoices: mockInvoices,
      documents: mockDocuments,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),

      getClient: (id) => get().clients.find((c) => c.id === id),
      getCase: (id) => get().cases.find((c) => c.id === id),
      getInvoice: (id) => get().invoices.find((i) => i.id === id),

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

      createInvoice: (input) => {
        const matter = get().getCase(input.caseId);
        if (!matter || !(input.amount > 0) || !input.dueDate) return null;
        const id = nextNumericId(get().invoices);
        const invoice: Invoice = {
          id,
          invoiceNumber: nextInvoiceNumber(get().invoices),
          clientId: matter.clientId,
          clientName: matter.clientName,
          caseId: matter.caseId,
          caseName: matter.matter,
          amount: Math.round(input.amount),
          status: input.status ?? "Draft",
          dueDate: input.dueDate,
          createdAt: todayIso(),
        };
        set((state) => ({ invoices: [invoice, ...state.invoices] }));
        return invoice;
      },

      updateInvoice: (id, input) => {
        let updated: Invoice | null = null;
        set((state) => ({
          invoices: state.invoices.map((invoice) => {
            if (invoice.id !== id) return invoice;
            updated = { ...invoice, ...input };
            return updated;
          }),
        }));
        return updated;
      },

      createDocument: (input) => {
        if (!input.name.trim() || input.accessUsers.length === 0) return null;
        const id = nextNumericId(get().documents);
        const accessUsers = input.accessUsers
          .map((name) => name.trim())
          .filter(Boolean);

        if (input.invoiceId) {
          const invoice = get().getInvoice(input.invoiceId);
          if (!invoice) return null;
          const matter = get().cases.find((c) => c.caseId === invoice.caseId);
          const doc: Document = {
            id,
            name: input.name.trim(),
            category: input.category,
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            caseId: matter?.id,
            caseName: invoice.caseName,
            clientId: invoice.clientId,
            clientName: invoice.clientName,
            language: input.language,
            version: 1,
            uploadedBy: "Firm",
            uploadedAt: todayIso(),
            size: input.size?.trim() || "—",
            accessUsers,
          };
          set((state) => ({ documents: [doc, ...state.documents] }));
          return doc;
        }

        if (input.caseId) {
          const matter = get().getCase(input.caseId);
          if (!matter) return null;
          const doc: Document = {
            id,
            name: input.name.trim(),
            category: input.category,
            caseId: matter.id,
            caseName: matter.matter,
            clientId: matter.clientId,
            clientName: matter.clientName,
            language: input.language,
            version: 1,
            uploadedBy: matter.assignedLawyers[0] ?? "Firm",
            uploadedAt: todayIso(),
            size: input.size?.trim() || "—",
            accessUsers,
          };
          set((state) => ({ documents: [doc, ...state.documents] }));
          return doc;
        }

        if (input.clientId) {
          const client = get().getClient(input.clientId);
          if (!client) return null;
          const doc: Document = {
            id,
            name: input.name.trim(),
            category: input.category,
            clientId: client.id,
            clientName: client.name,
            language: input.language,
            version: 1,
            uploadedBy: "Firm",
            uploadedAt: todayIso(),
            size: input.size?.trim() || "—",
            accessUsers,
          };
          set((state) => ({ documents: [doc, ...state.documents] }));
          return doc;
        }

        return null;
      },
    }),
    {
      name: "ukil-domain-v1",
      // Always provide storage so persist API attaches during SSR (default
      // createJSONStorage(() => localStorage) returns undefined without window).
      skipHydration: true,
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const raw = window.localStorage.getItem(name);
          return raw ? (JSON.parse(raw) as { state: unknown; version?: number }) : null;
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          window.localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          window.localStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        clients: state.clients,
        cases: state.cases,
        hearings: state.hearings,
        filings: state.filings,
        invoices: state.invoices,
        documents: state.documents,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<DomainState>;
        const rawDocs = p.documents ?? current.documents;
        return {
          ...current,
          ...p,
          // Older localStorage blobs lack newer collections / field shapes
          documents: rawDocs.map((doc) => ({
            ...doc,
            accessUsers: documentAccessUsers(doc),
          })),
          invoices: p.invoices ?? current.invoices,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
