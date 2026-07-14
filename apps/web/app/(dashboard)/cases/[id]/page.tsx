"use client";

import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { CaseStatusSelect } from "@/components/cases/CaseStatusSelect";
import { UploadDocumentForm } from "@/components/cases/UploadDocumentForm";
import { NewFilingForm } from "@/components/court-filing/NewFilingForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { DetailField, PageSection } from "@/components/ui/PageSection";
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
  getCaseById,
  mockCaseComments,
  mockClients,
  mockDocuments,
  mockExpenses,
  mockFilings,
  mockInvoices,
  mockMilestones,
  mockCaseNotes,
  mockStaff,
} from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate, toDateInputValue } from "@/lib/utils/formatDate";
import type { CaseType } from "@/types/case";
import type { FilingStatus } from "@/types/filing";
import type { CourtLevel } from "@/types/hearing";
import { CheckCircle2, Circle, Pencil } from "lucide-react";
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

const filingStatusVariant = (s: FilingStatus) =>
  s === "Accepted" ? "green" : s === "Rejected" ? "red" : s === "Submitted" ? "blue" : "muted";

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
  const caseData = getCaseById(id);
  const tabParam = searchParams.get("tab");
  const filingParam = searchParams.get("filing");
  const initialTab =
    tabParam && (CASE_TABS as readonly string[]).includes(tabParam)
      ? tabParam
      : filingParam
        ? "filings"
        : "overview";
  const [tab, setTab] = useState(initialTab);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [newFilingOpen, setNewFilingOpen] = useState(false);
  const [editing, setEditing] = useState(false);
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
    const nextTab = searchParams.get("tab");
    if (nextTab && (CASE_TABS as readonly string[]).includes(nextTab)) {
      setTab(nextTab);
      return;
    }
    if (searchParams.get("filing")) setTab("filings");
  }, [searchParams]);

  const docs = mockDocuments.filter((d) => d.caseId === id);
  const filings = mockFilings.filter((f) => f.caseId === id);
  const invoices = mockInvoices.filter((i) => i.caseId === caseData?.caseId);
  const expenses = mockExpenses.filter((e) => e.caseId === id);
  const notes = mockCaseNotes.filter((n) => n.caseId === id);
  const comments = mockCaseComments.filter((c) => c.caseId === id);
  const lawyers = mockStaff.filter((s) => s.role !== "Admin");
  const activeClients = mockClients.filter((c) => c.status === "Active");
  const focusFilingId = searchParams.get("filing");

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
    // ponytail: use route id — caseData narrows don't carry into nested fns
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

  function patchDraft(key: keyof typeof draft, value: string | string[]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-gray-200 bg-surface p-4">
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
              size="sm"
              onClick={() => (editing ? setEditing(false) : startEditing())}
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
            <Link href={`/calendar?case=${caseData.id}`}>
              <Button variant="secondary" size="sm">Schedule Hearing</Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={() => router.push("/cases")}>
              Back
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
            {mockMilestones.map((m) => (
              <label key={m.id} className="flex items-center gap-3 rounded-card border border-gray-200 px-3 py-2">
                <input type="checkbox" defaultChecked={m.completed} />
                <span className={`flex-1 text-sm ${m.completed ? "text-text-muted line-through" : "font-medium"}`}>
                  {m.title}
                </span>
                {m.dueDate && <span className="text-xs text-text-muted">{formatDate(m.dueDate)}</span>}
              </label>
            ))}
          </div>
        </PageSection>
      )}

      {tab === "documents" && (
        <PageSection
          title="Case Documents"
          action={
            <Button size="sm" onClick={() => setUploadOpen(true)}>
              Upload Document
            </Button>
          }
        >
          <Table compact>
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
        </PageSection>
      )}

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Document"
      >
        <UploadDocumentForm
          onSubmit={() => setUploadOpen(false)}
          onCancel={() => setUploadOpen(false)}
        />
      </Modal>

      {tab === "filings" && (
        <PageSection
          title="Court Filings"
          action={
            <Button size="sm" onClick={() => setNewFilingOpen(true)}>
              New Filing
            </Button>
          }
        >
          {filings.length === 0 ? (
            <p className="text-sm text-text-muted">No filings for this case yet.</p>
          ) : (
            <Table compact>
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
                      <Badge variant={filingStatusVariant(f.status)}>{f.status}</Badge>
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
          onSubmit={() => setNewFilingOpen(false)}
          onCancel={() => setNewFilingOpen(false)}
        />
      </Modal>

      {tab === "notes" && (
        <PageSection title="Notes & Internal Memos" action={<Button size="sm">Add Note</Button>}>
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
        </PageSection>
      )}

      {tab === "billing" && (
        <div className="space-y-4">
          <PageSection title="Invoices" action={<Link href="/billing/invoices"><Button size="sm">Create Invoice</Button></Link>}>
            <Table compact>
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
                    <TableCell><Badge variant={inv.status === "Paid" ? "green" : inv.status === "Overdue" ? "red" : "amber"}>{inv.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageSection>
          <PageSection title="Expenses">
            <Table compact>
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
          </PageSection>
        </div>
      )}

      {tab === "thread" && (
        <PageSection title="Internal Case Thread" action={<Button size="sm">Post Comment</Button>}>
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
