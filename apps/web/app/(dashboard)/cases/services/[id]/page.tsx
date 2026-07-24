"use client";

import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { CaseStatusSelect } from "@/components/cases/CaseStatusSelect";
import { UploadDocumentForm } from "@/components/cases/UploadDocumentForm";
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
  getServiceById,
  mockClients,
  mockExpenses,
  mockInvoices,
  mockServiceComments,
  mockServiceMilestones,
  mockServiceNotes,
  mockStaff,
} from "@/lib/mock";
import {
  type CreateDocumentInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate, toDateInputValue } from "@/lib/utils/formatDate";
import { invoiceStatusVariant } from "@/lib/utils/invoiceStatus";
import {
  SERVICE_TYPES,
  type ServiceStage,
  type ServiceType,
} from "@/types/service";
import { CheckCircle2, Circle, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

const stages: ServiceStage[] = [
  "Intake",
  "Drafting",
  "Review",
  "Delivery",
  "Closed",
];

function lawyerIdsFromNames(names: string[]) {
  return mockStaff.filter((s) => names.includes(s.name)).map((s) => s.id);
}

function namesFromLawyerIds(ids: string[]) {
  return mockStaff.filter((s) => ids.includes(s.id)).map((s) => s.name);
}

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const service = getServiceById(params.id);
  const documents = useDomainStore((s) => s.documents);
  const createDocument = useDomainStore((s) => s.createDocument);
  const [tab, setTab] = useState("overview");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [milestoneOverrides, setMilestoneOverrides] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState({
    matter: "",
    clientId: "",
    type: "",
    dueDate: "",
    stage: "",
    status: "",
    description: "",
    lawyerIds: [] as string[],
  });

  if (!service) notFound();

  // ponytail: reuse case-linked docs until service docs exist
  const docs = documents.filter((d) => d.caseId === service.id && !d.isTemplate);
  const invoices = mockInvoices.filter((i) => i.caseId === service.serviceId);
  const expenses = mockExpenses.filter((e) => e.caseId === service.id);
  const notes = mockServiceNotes.filter((n) => n.caseId === service.id);
  const comments = mockServiceComments.filter((c) => c.caseId === service.id);
  const lawyers = mockStaff.filter((s) => s.role !== "Admin");
  const activeClients = mockClients.filter((c) => c.status === "Active");

  const displayClientId = draft.clientId || service.clientId;
  const displayClientName =
    activeClients.find((c) => c.id === displayClientId)?.name ??
    service.clientName;
  const displayLawyers = editing
    ? namesFromLawyerIds(draft.lawyerIds)
    : draft.lawyerIds.length > 0
      ? namesFromLawyerIds(draft.lawyerIds)
      : service.assignedLawyers;
  const displayStatus = (draft.status || service.status) as typeof service.status;
  const displayDueDate = draft.dueDate || service.dueDate;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pipeline", label: "Pipeline" },
    { id: "documents", label: "Documents" },
    { id: "notes", label: "Notes & Memos" },
    { id: "billing", label: "Billing" },
    { id: "thread", label: "Team Thread" },
  ];

  function startEditing() {
    setDraft({
      matter: service!.matter,
      clientId: service!.clientId,
      type: service!.type,
      dueDate: toDateInputValue(service!.dueDate),
      stage: service!.stage,
      status: service!.status,
      description: service!.description ?? "",
      lawyerIds: lawyerIdsFromNames(service!.assignedLawyers),
    });
    setEditing(true);
  }

  function patchDraft(key: keyof typeof draft, value: string | string[]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
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
                <h2 className="text-lg font-bold">{draft.matter || service.matter}</h2>
              )}
              <CaseStatusBadge status={displayStatus} />
              <Badge variant="blue">{draft.stage || service.stage}</Badge>
            </div>
            <p className="mt-1 text-xs tabular-nums text-text-muted">{service.serviceId}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
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
            <Button
              variant="secondary"
              onClick={() => router.push("/cases/services")}
            >
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

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      {tab === "overview" && (
        <PageSection title="Service Overview">
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
              label="Service Type"
              value={draft.type || service.type}
              editing={editing}
              editValue={draft.type}
              onChange={(v) => patchDraft("type", v)}
              options={SERVICE_TYPES.map((t: ServiceType) => ({
                value: t,
                label: t,
              }))}
            />
            <DetailField
              label="Due Date"
              value={displayDueDate ? formatDate(displayDueDate) : "—"}
              editing={editing}
              editValue={draft.dueDate}
              onChange={(v) => patchDraft("dueDate", v)}
              inputType="date"
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
              label="Stage"
              value={draft.stage || service.stage}
              editing={editing}
              editValue={draft.stage}
              onChange={(v) => patchDraft("stage", v)}
              options={stages.map((s) => ({ value: s, label: s }))}
            />
            <DetailField label="Created" value={formatDate(service.createdAt)} />
            <DetailField
              label="Last Updated"
              value={formatDate(service.updatedAt)}
            />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              Description
            </p>
            {editing ? (
              <Textarea
                value={draft.description}
                onChange={(e) => patchDraft("description", e.target.value)}
                placeholder="Optional details about the service"
                className="mt-0.5"
              />
            ) : (
              <p className="mt-0.5 min-h-[1.25rem] text-sm font-medium text-text-primary">
                {draft.description || service.description || ""}
              </p>
            )}
          </div>
        </PageSection>
      )}

      {tab === "pipeline" && (
        <PageSection title="Service Stage Pipeline">
          <div className="mb-6 flex items-center gap-1 overflow-x-auto overscroll-x-contain pb-1">
            {stages.map((stage, i) => {
              const currentIdx = stages.indexOf(service.stage);
              const done = i <= currentIdx;
              return (
                <div key={stage} className="flex min-w-[4.5rem] flex-1 items-center">
                  <div
                    className={`flex flex-col items-center ${done ? "text-green" : "text-text-muted"}`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                    <span className="mt-1 text-center text-[10px] font-semibold">
                      {stage}
                    </span>
                  </div>
                  {i < stages.length - 1 && (
                    <div
                      className={`mx-1 h-0.5 min-w-4 flex-1 ${i < currentIdx ? "bg-green" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <h3 className="mb-3 text-xs font-bold uppercase text-text-muted">
            Milestones
          </h3>
          <div className="space-y-2">
            {mockServiceMilestones.map((m) => {
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
        <PageSection
          title="Service Documents"
          action={
            <Button onClick={() => setUploadOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Document
            </Button>
          }
        >
          {docs.length > 0 ? (
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
                  <TableRow
                    key={d.id}
                    onClick={() => router.push(`/documents/${d.id}`)}
                  >
                    <TableCell className="font-semibold">{d.name}</TableCell>
                    <TableCell>{d.category}</TableCell>
                    <TableCell>v{d.version}</TableCell>
                    <TableCell>{d.language}</TableCell>
                    <TableCell className="text-text-muted">
                      {formatDate(d.uploadedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState title="No documents uploaded yet" />
          )}
        </PageSection>
      )}

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Add Document"
      >
        <UploadDocumentForm
          defaultCaseId={service.id}
          onSubmit={(input: CreateDocumentInput) => {
            const created = createDocument(input);
            setUploadOpen(false);
            if (created) {
              router.push(`/documents/${created.id}`);
              return;
            }
            setTab("documents");
          }}
          onCancel={() => setUploadOpen(false)}
        />
      </Modal>

      {tab === "notes" && (
        <PageSection
          title="Notes & Internal Memos"
          action={
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Note
            </Button>
          }
        >
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-card border p-3 ${n.isMemo ? "border-amber/30 bg-amber-light/30" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{n.author}</span>
                    <div className="flex items-center gap-2">
                      {n.isMemo ? (
                        <Badge variant="amber">Internal Memo</Badge>
                      ) : null}
                      <span className="text-xs text-text-muted">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-text-sec">{n.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No notes yet" />
          )}
        </PageSection>
      )}

      {tab === "billing" && (
        <div className="space-y-4">
          <PageSection
            title="Invoices"
            action={
              <Link href="/billing/invoices?new=1">
                <Button>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create Invoice
                </Button>
              </Link>
            }
          >
            {invoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      onClick={() => router.push(`/billing/invoices/${inv.id}`)}
                    >
                      <TableCell className="font-semibold">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatCurrency(inv.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={invoiceStatusVariant(inv.status)}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="No invoices yet" />
            )}
          </PageSection>
          <PageSection title="Expenses">
            {expenses.length > 0 ? (
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
                      <TableCell className="text-text-muted">
                        {formatDate(e.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="No expenses yet" />
            )}
          </PageSection>
        </div>
      )}

      {tab === "thread" && (
        <PageSection
          title="Internal Service Thread"
          action={<Button>Post Comment</Button>}
        >
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-card border border-gray-200 bg-cream-card p-3"
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">{c.author}</span>
                    <span className="text-xs text-text-muted">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-text-sec">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No comments yet" />
          )}
        </PageSection>
      )}
    </div>
  );
}
