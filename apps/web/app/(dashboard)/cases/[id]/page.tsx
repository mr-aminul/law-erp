"use client";

import { NewHearingForm } from "@/components/calendar/NewHearingForm";
import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { CaseStatusSelect } from "@/components/cases/CaseStatusSelect";
import { NewFilingForm } from "@/components/court-filing/NewFilingForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChecklistRow } from "@/components/ui/ChecklistRow";
import { Textarea } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { DetailField, EmptyState, PageSection } from "@/components/ui/PageSection";
import { Tabs } from "@/components/ui/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { UserChip } from "@/components/ui/UserChip";
import {
  mockCaseComments,
  mockDocuments,
  mockExpenses,
  mockInvoices,
  mockMilestones,
  mockCaseNotes,
  mockStaff,
} from "@/lib/mock";
import {
  type CreateFilingInput,
  type CreateHearingInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate, toDateInputValue } from "@/lib/utils/formatDate";
import { invoiceStatusVariant } from "@/lib/utils/invoiceStatus";
import type { CaseOutcome, CaseStatus, CaseType } from "@/types/case";
import type { FilingStatus } from "@/types/filing";
import type { CourtLevel } from "@/types/hearing";
import { CheckCircle2, Circle, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const stages = ["Filing", "Hearing", "Judgment", "Appeal", "Closed"];

const CASE_TYPES: CaseType[] = [
  "Civil",
  "Criminal",
  "Family",
  "Corporate",
  "Labour",
  "Property",
];

const COURT_LEVELS: CourtLevel[] = [
  "Supreme Court",
  "High Court Division",
  "District Court",
  "Tribunal",
];

const OUTCOMES = ["Pending", "Won", "Lost", "Settled"] as const;

function lawyerIdsFromNames(names: string[]) {
  return mockStaff.filter((s) => names.includes(s.name)).map((s) => s.id);
}

function namesFromLawyerIds(ids: string[]) {
  return mockStaff.filter((s) => ids.includes(s.id)).map((s) => s.name);
}

const CASE_TABS = [
  "overview",
  "pipeline",
  "documents",
  "filings",
  "notes",
  "billing",
  "thread",
] as const;

function CaseDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(() => useDomainStore.persist.hasHydrated());
  const caseData = useDomainStore((s) => s.cases.find((c) => c.id === id));
  const clients = useDomainStore((s) => s.clients);
  const filings = useDomainStore((s) => s.filings.filter((f) => f.caseId === id));
  const updateCase = useDomainStore((s) => s.updateCase);
  const createFiling = useDomainStore((s) => s.createFiling);
  const updateFiling = useDomainStore((s) => s.updateFiling);
  const createHearing = useDomainStore((s) => s.createHearing);
  const tabParam = searchParams.get("tab");
  const filingParam = searchParams.get("filing");
  const initialTab =
    tabParam && (CASE_TABS as readonly string[]).includes(tabParam)
      ? tabParam
      : filingParam
        ? "filings"
        : "overview";
  const [tab, setTab] = useState(initialTab);
  const [newFilingOpen, setNewFilingOpen] = useState(false);
  const [newHearingOpen, setNewHearingOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [milestoneOverrides, setMilestoneOverrides] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState({
    matter: "",
    clientId: "",
    type: "",
    court: "",
    courtName: "",
    caseNumber: "",
    firstHearing: "",
    deadline: "",
    status: "",
    oppositeParty: "",
    opposingCounsel: "",
    causeListRef: "",
    outcome: "",
    description: "",
    lawyerIds: [] as string[],
  });

  useEffect(() => {
    if (useDomainStore.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useDomainStore.persist.onFinishHydration(() => setReady(true));
  }, []);

  useEffect(() => {
    const nextTab = searchParams.get("tab");
    if (nextTab && (CASE_TABS as readonly string[]).includes(nextTab)) {
      setTab(nextTab);
      return;
    }
    if (searchParams.get("filing")) setTab("filings");
  }, [searchParams]);

  const docs = mockDocuments.filter((d) => d.caseId === id);
  const invoices = mockInvoices.filter((i) => i.caseId === caseData?.caseId);
  const expenses = mockExpenses.filter((e) => e.caseId === id);
  const notes = mockCaseNotes.filter((n) => n.caseId === id);
  const comments = mockCaseComments.filter((c) => c.caseId === id);
  const lawyers = mockStaff.filter((s) => s.role !== "Admin");
  const activeClients = clients.filter((c) => c.status === "Active");
  const focusFilingId = searchParams.get("filing");

  if (!ready) {
    return <div className="p-4 text-sm text-text-muted">Loading case…</div>;
  }

  if (!caseData) notFound();

  const displayClientId = draft.clientId || caseData.clientId;
  const displayClientName =
    activeClients.find((c) => c.id === displayClientId)?.name ??
    caseData.clientName;
  const displayLawyers = editing
    ? namesFromLawyerIds(draft.lawyerIds)
    : draft.lawyerIds.length > 0
      ? namesFromLawyerIds(draft.lawyerIds)
      : caseData.assignedLawyers;
  const displayStatus = (draft.status || caseData.status) as typeof caseData.status;
  const displayFirstHearing = draft.firstHearing || caseData.nextHearing;
  const displayDeadline = draft.deadline || caseData.limitationDate;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pipeline", label: "Pipeline" },
    { id: "documents", label: "Documents" },
    { id: "filings", label: "Filings" },
    { id: "notes", label: "Notes & Memos" },
    { id: "billing", label: "Billing" },
    { id: "thread", label: "Team Thread" },
  ];

  function changeTab(next: string) {
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    if (next !== "filings") params.delete("filing");
    const qs = params.toString();
    router.replace(`/cases/${id}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function startEditing() {
    if (!caseData) return;
    setDraft({
      matter: caseData.matter,
      clientId: caseData.clientId,
      type: caseData.type,
      court: caseData.court,
      courtName: caseData.courtName,
      caseNumber: caseData.caseNumber ?? "",
      firstHearing: toDateInputValue(caseData.nextHearing),
      deadline: toDateInputValue(caseData.limitationDate),
      status: caseData.status,
      oppositeParty: caseData.opposingParty?.name ?? "",
      opposingCounsel: caseData.opposingParty?.counsel ?? "",
      causeListRef: caseData.causeListRef ?? "",
      outcome: caseData.outcome ?? "Pending",
      description: caseData.description ?? "",
      lawyerIds: lawyerIdsFromNames(caseData.assignedLawyers),
    });
    setEditing(true);
  }

  function finishEditing() {
    if (!caseData) return;
    updateCase(caseData.id, {
      matter: draft.matter.trim() || caseData.matter,
      clientId: draft.clientId || caseData.clientId,
      type: (draft.type as CaseType) || caseData.type,
      court: (draft.court as CourtLevel) || caseData.court,
      courtName: draft.courtName.trim() || caseData.courtName,
      caseNumber: draft.caseNumber.trim() || undefined,
      nextHearing: draft.firstHearing || undefined,
      limitationDate: draft.deadline || undefined,
      status: (draft.status as CaseStatus) || caseData.status,
      opposingParty: draft.oppositeParty.trim()
        ? {
            name: draft.oppositeParty.trim(),
            counsel: draft.opposingCounsel.trim() || undefined,
          }
        : undefined,
      causeListRef: draft.causeListRef.trim() || undefined,
      outcome: (draft.outcome as CaseOutcome) || undefined,
      description: draft.description.trim() || undefined,
      assignedLawyers: namesFromLawyerIds(draft.lawyerIds),
    });
    setEditing(false);
  }

  function patchDraft(key: keyof typeof draft, value: string | string[]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleCreateFiling(input: CreateFilingInput) {
    createFiling(input);
    setNewFilingOpen(false);
    changeTab("filings");
  }

  function handleCreateHearing(input: CreateHearingInput) {
    createHearing(input);
    setNewHearingOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-gray-200 bg-surface p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {editing ? (
                <input
                  type="text"
                  value={draft.matter}
                  onChange={(e) => patchDraft("matter", e.target.value)}
                  className="min-w-0 flex-1 border-0 border-b border-gray-300 bg-transparent py-0.5 text-lg font-bold text-text-primary outline-none focus:border-text-primary"
                />
              ) : (
                <h2 className="text-lg font-bold">{draft.matter || caseData.matter}</h2>
              )}
              <CaseStatusBadge status={displayStatus} />
              <Badge variant="blue">{caseData.stage}</Badge>
            </div>
            <p className="mt-1 text-xs tabular-nums text-text-muted">{caseData.caseId}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => (editing ? finishEditing() : startEditing())}
            >
              {editing ? (
                "Done"
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={() => setNewHearingOpen(true)}>
              Schedule Hearing
            </Button>
            <Button variant="secondary" onClick={() => router.push("/cases")}>
              Back to list
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {editing ? (
            <>
              {draft.lawyerIds.map((id) => {
                const lawyer = lawyers.find((s) => s.id === id);
                if (!lawyer) return null;
                return (
                  <UserChip
                    key={id}
                    name={lawyer.name}
                    initials={lawyer.initials}
                    onRemove={() =>
                      patchDraft(
                        "lawyerIds",
                        draft.lawyerIds.filter((lawyerId) => lawyerId !== id)
                      )
                    }
                  />
                );
              })}
              <MultiSelectDropdown
                variant="chip"
                searchable
                searchPlaceholder="Search lawyers…"
                placeholder="Assignee"
                options={lawyers.map((s) => ({
                  value: s.id,
                  label: s.name,
                  initials: s.initials,
                  description: s.email ? `${s.role} · ${s.email}` : s.role,
                }))}
                value={draft.lawyerIds}
                onChange={(ids) => patchDraft("lawyerIds", ids)}
              />
            </>
          ) : (
            <AssignedLawyers lawyers={displayLawyers} />
          )}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={changeTab} />

      {tab === "overview" && (
        <PageSection title="Case Overview">
          <div className="grid-fields-3">
            <DetailField
              label="Client"
              value={
                <Link
                  href={`/clients/${displayClientId}`}
                  className="font-medium hover:underline"
                >
                  {displayClientName}
                </Link>
              }
              editing={editing}
              editValue={draft.clientId}
              onChange={(v) => patchDraft("clientId", v)}
              options={activeClients.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
            <DetailField
              label="Case Type"
              value={draft.type || caseData.type}
              editing={editing}
              editValue={draft.type}
              onChange={(v) => patchDraft("type", v)}
              options={CASE_TYPES.map((t) => ({ value: t, label: t }))}
            />
            <DetailField
              label="Status"
              value={<CaseStatusBadge status={displayStatus} />}
              editing={editing}
              editSlot={
                <CaseStatusSelect
                  status={displayStatus}
                  onChange={(s) => patchDraft("status", s)}
                />
              }
            />
            <DetailField
              label="Court Level"
              value={draft.court || caseData.court}
              editing={editing}
              editValue={draft.court}
              onChange={(v) => patchDraft("court", v)}
              options={COURT_LEVELS.map((c) => ({ value: c, label: c }))}
            />
            <DetailField
              label="Court Name"
              value={draft.courtName || caseData.courtName}
              editing={editing}
              editValue={draft.courtName}
              onChange={(v) => patchDraft("courtName", v)}
            />
            <DetailField
              label="Case Number"
              value={draft.caseNumber || caseData.caseNumber || "—"}
              editing={editing}
              editValue={draft.caseNumber}
              onChange={(v) => patchDraft("caseNumber", v)}
            />
            <DetailField
              label="First Hearing Date"
              value={displayFirstHearing ? formatDate(displayFirstHearing) : "—"}
              editing={editing}
              editValue={draft.firstHearing}
              onChange={(v) => patchDraft("firstHearing", v)}
              inputType="date"
            />
            <DetailField
              label="Deadline"
              value={displayDeadline ? formatDate(displayDeadline) : "—"}
              editing={editing}
              editValue={draft.deadline}
              onChange={(v) => patchDraft("deadline", v)}
              inputType="date"
            />
            <DetailField
              label="Opposite Party"
              value={draft.oppositeParty || caseData.opposingParty?.name || "—"}
              editing={editing}
              editValue={draft.oppositeParty}
              onChange={(v) => patchDraft("oppositeParty", v)}
            />
            <DetailField
              label="Opposing Counsel"
              value={draft.opposingCounsel || caseData.opposingParty?.counsel || "—"}
              editing={editing}
              editValue={draft.opposingCounsel}
              onChange={(v) => patchDraft("opposingCounsel", v)}
            />
            <DetailField
              label="Cause List Ref"
              value={draft.causeListRef || caseData.causeListRef || "—"}
              editing={editing}
              editValue={draft.causeListRef}
              onChange={(v) => patchDraft("causeListRef", v)}
            />
            <DetailField
              label="Outcome"
              value={draft.outcome || caseData.outcome || "Pending"}
              editing={editing}
              editValue={draft.outcome || "Pending"}
              onChange={(v) => patchDraft("outcome", v)}
              options={OUTCOMES.map((o) => ({ value: o, label: o }))}
            />
            <DetailField label="Created" value={formatDate(caseData.createdAt)} />
            <DetailField label="Last Updated" value={formatDate(caseData.updatedAt)} />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              Description
            </p>
            {editing ? (
              <Textarea
                value={draft.description}
                onChange={(e) => patchDraft("description", e.target.value)}
                placeholder="Optional details about the case"
                className="mt-0.5"
              />
            ) : (
              <p className="mt-0.5 min-h-[1.25rem] text-sm font-medium text-text-primary">
                {draft.description || caseData.description || ""}
              </p>
            )}
          </div>
        </PageSection>
      )}

      {tab === "pipeline" && (
        <PageSection title="Case Stage Pipeline">
          <div className="mb-6 flex items-center gap-1 overflow-x-auto overscroll-x-contain pb-1">
            {stages.map((stage, i) => {
              const currentIdx = stages.indexOf(caseData.stage);
              const done = i <= currentIdx;
              return (
                <div key={stage} className="flex min-w-[4.5rem] flex-1 items-center">
                  <div className={`flex flex-col items-center ${done ? "text-green" : "text-text-muted"}`}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    <span className="mt-1 text-center text-[10px] font-semibold">{stage}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className={`mx-1 h-0.5 min-w-4 flex-1 ${i < currentIdx ? "bg-green" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <h3 className="mb-3 text-xs font-bold uppercase text-text-muted">Milestones</h3>
          <div className="space-y-2">
            {mockMilestones.map((m) => {
              const completed = milestoneOverrides[m.id] ?? m.completed;
              return (
                <ChecklistRow
                  key={m.id}
                  title={m.title}
                  completed={completed}
                  dueDate={m.dueDate ? formatDate(m.dueDate) : undefined}
                  onToggle={() =>
                    setMilestoneOverrides((prev) => ({ ...prev, [m.id]: !completed }))
                  }
                />
              );
            })}
          </div>
        </PageSection>
      )}

      {tab === "documents" && (
        <PageSection title="Case Documents">
          {docs.length === 0 ? (
            <EmptyState title="No documents uploaded" description="Upload files related to this case to see them here." />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Uploaded</TableHead>
              </TableHeader>
              <TableBody>
                {docs.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-semibold">{d.name}</TableCell>
                    <TableCell>{d.category}</TableCell>
                    <TableCell>v{d.version}</TableCell>
                    <TableCell>{d.language}</TableCell>
                    <TableCell className="text-text-muted">{formatDate(d.uploadedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      )}

      {tab === "filings" && (
        <PageSection
          title="Court Filings"
          action={
            <Button onClick={() => setNewFilingOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Filing
            </Button>
          }
        >
          {filings.length === 0 ? (
            <EmptyState title="No filings for this case yet" />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Ref</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Filed By</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Summons</TableHead>
                <TableHead>Status</TableHead>
              </TableHeader>
              <TableBody>
                {filings.map((f) => (
                  <TableRow
                    key={f.id}
                    className={
                      focusFilingId === f.id
                        ? "bg-green-light/40 ring-1 ring-inset ring-green/30"
                        : undefined
                    }
                  >
                    <TableCell className="font-semibold">{f.filingRef}</TableCell>
                    <TableCell className="text-text-sec">{f.court}</TableCell>
                    <TableCell>{f.filingType}</TableCell>
                    <TableCell>{f.filedBy}</TableCell>
                    <TableCell>{formatCurrency(f.filingFee)}</TableCell>
                    <TableCell>{f.summonsDispatched ? "Sent" : "—"}</TableCell>
                    <TableCell>
                      <select
                        className="rounded-input border border-gray-200 bg-white px-2 py-1 text-xs"
                        value={f.status}
                        onChange={(e) =>
                          updateFiling(f.id, {
                            status: e.target.value as FilingStatus,
                          })
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {(["Draft", "Submitted", "Accepted", "Rejected"] as const).map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          )
                        )}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      )}

      <Modal
        open={newFilingOpen}
        onClose={() => setNewFilingOpen(false)}
        title="New Filing"
        className="max-w-xl"
      >
        <NewFilingForm
          defaultCaseId={caseData.id}
          onSubmit={handleCreateFiling}
          onCancel={() => setNewFilingOpen(false)}
        />
      </Modal>

      <Modal
        open={newHearingOpen}
        onClose={() => setNewHearingOpen(false)}
        title="Schedule Hearing"
        className="max-w-xl"
      >
        <NewHearingForm
          defaultCaseId={caseData.id}
          onSubmit={handleCreateHearing}
          onCancel={() => setNewHearingOpen(false)}
        />
      </Modal>

      {tab === "notes" && (
        <PageSection title="Notes & Internal Memos">
          {notes.length === 0 ? (
            <EmptyState title="No notes yet" description="Notes and internal memos for this case will appear here." />
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <div key={n.id} className={`rounded-card border p-3 ${n.isMemo ? "border-amber/30 bg-amber-light/30" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{n.author}</span>
                    <div className="flex items-center gap-2">
                      {n.isMemo && <Badge variant="amber">Internal Memo</Badge>}
                      <span className="text-xs text-text-muted">{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-text-sec">{n.content}</p>
                </div>
              ))}
            </div>
          )}
        </PageSection>
      )}

      {tab === "billing" && (
        <div className="space-y-4">
          <PageSection title="Invoices">
            {invoices.length === 0 ? (
              <EmptyState title="No invoices for this case" />
            ) : (
              <Table>
                <TableHeader>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} onClick={() => router.push(`/billing/invoices/${inv.id}`)}>
                      <TableCell className="font-semibold">{inv.invoiceNumber}</TableCell>
                      <TableCell>{formatCurrency(inv.amount)}</TableCell>
                      <TableCell><Badge variant={invoiceStatusVariant(inv.status)}>{inv.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PageSection>
          <PageSection title="Expenses">
            {expenses.length === 0 ? (
              <EmptyState title="No expenses logged for this case" />
            ) : (
              <Table>
                <TableHeader>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableHeader>
                <TableBody>
                  {expenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.description}</TableCell>
                      <TableCell>{e.category}</TableCell>
                      <TableCell>{formatCurrency(e.amount)}</TableCell>
                      <TableCell className="text-text-muted">{formatDate(e.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PageSection>
        </div>
      )}

      {tab === "thread" && (
        <PageSection title="Internal Case Thread">
          {comments.length === 0 ? (
            <EmptyState title="No comments yet" description="Start the internal discussion for this case." />
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="rounded-card border border-gray-200 bg-cream-card p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">{c.author}</span>
                    <span className="text-xs text-text-muted">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-text-sec">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </PageSection>
      )}
    </div>
  );
}

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="text-sm text-text-muted">Loading case...</div>}>
      <CaseDetailContent id={params.id} />
    </Suspense>
  );
}
