"use client";

import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { UploadDocumentForm } from "@/components/cases/UploadDocumentForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
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
import {
  getServiceById,
  mockDocuments,
  mockExpenses,
  mockInvoices,
  mockServiceComments,
  mockServiceMilestones,
  mockServiceNotes,
} from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import type { ServiceStage } from "@/types/service";
import { CheckCircle2, Circle } from "lucide-react";
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

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const service = getServiceById(params.id);
  const [tab, setTab] = useState("overview");
  const [uploadOpen, setUploadOpen] = useState(false);

  if (!service) notFound();

  // ponytail: reuse case-linked docs until service docs exist
  const docs = mockDocuments.filter((d) => d.caseId === service.id);
  const invoices = mockInvoices.filter((i) => i.caseId === service.serviceId);
  const expenses = mockExpenses.filter((e) => e.caseId === service.id);
  const notes = mockServiceNotes.filter((n) => n.caseId === service.id);
  const comments = mockServiceComments.filter((c) => c.caseId === service.id);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pipeline", label: "Pipeline" },
    { id: "documents", label: "Documents" },
    { id: "notes", label: "Notes & Memos" },
    { id: "billing", label: "Billing" },
    { id: "thread", label: "Team Thread" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-gray-200 bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">{service.matter}</h2>
              <CaseStatusBadge status={service.status} />
              <Badge variant="blue">{service.stage}</Badge>
            </div>
            <p className="mt-1 text-xs tabular-nums text-text-muted">{service.serviceId}</p>
            <p className="mt-0.5 text-xs text-text-muted">
              {service.clientName} · {service.type}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/cases/services")}
            >
              Back
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {service.assignedLawyers.map((lawyer) => (
            <span
              key={lawyer}
              className="rounded-badge border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-green shadow-none"
            >
              {lawyer}
            </span>
          ))}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      {tab === "overview" && (
        <PageSection title="Service Overview">
          <div className="grid-fields-3">
            <DetailField label="Type" value={service.type} />
            <DetailField
              label="Due Date"
              value={service.dueDate ? formatDate(service.dueDate) : "—"}
            />
            <DetailField label="Stage" value={service.stage} />
            <DetailField label="Created" value={formatDate(service.createdAt)} />
            <DetailField
              label="Last Updated"
              value={formatDate(service.updatedAt)}
            />
            <DetailField
              label="Client"
              value={
                <Link
                  href={`/clients/${service.clientId}`}
                  className="font-medium hover:underline"
                >
                  {service.clientName}
                </Link>
              }
            />
            <DetailField label="Status" value={service.status} />
          </div>
          {service.description ? (
            <p className="mt-4 text-sm text-text-sec">{service.description}</p>
          ) : null}
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
            {mockServiceMilestones.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-3 rounded-card border border-gray-200 px-3 py-2"
              >
                <input type="checkbox" defaultChecked={m.completed} />
                <span
                  className={`flex-1 text-sm ${m.completed ? "text-text-muted line-through" : "font-medium"}`}
                >
                  {m.title}
                </span>
                {m.dueDate ? (
                  <span className="text-xs text-text-muted">
                    {formatDate(m.dueDate)}
                  </span>
                ) : null}
              </label>
            ))}
          </div>
        </PageSection>
      )}

      {tab === "documents" && (
        <PageSection
          title="Service Documents"
          action={
            <Button size="sm" onClick={() => setUploadOpen(true)}>
              Upload Document
            </Button>
          }
        >
          {docs.length > 0 ? (
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
                    <TableCell className="text-text-muted">
                      {formatDate(d.uploadedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-sm text-text-muted">
              No documents uploaded yet.
            </p>
          )}
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

      {tab === "notes" && (
        <PageSection
          title="Notes & Internal Memos"
          action={<Button size="sm">Add Note</Button>}
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
            <p className="py-8 text-center text-sm text-text-muted">
              No notes yet.
            </p>
          )}
        </PageSection>
      )}

      {tab === "billing" && (
        <div className="space-y-4">
          <PageSection
            title="Invoices"
            action={
              <Link href="/billing/invoices">
                <Button size="sm">Create Invoice</Button>
              </Link>
            }
          >
            {invoices.length > 0 ? (
              <Table compact>
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
                        <Badge
                          variant={
                            inv.status === "Paid"
                              ? "green"
                              : inv.status === "Overdue"
                                ? "red"
                                : "amber"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-sm text-text-muted">
                No invoices yet.
              </p>
            )}
          </PageSection>
          <PageSection title="Expenses">
            {expenses.length > 0 ? (
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
                      <TableCell className="text-text-muted">
                        {formatDate(e.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-sm text-text-muted">
                No expenses yet.
              </p>
            )}
          </PageSection>
        </div>
      )}

      {tab === "thread" && (
        <PageSection
          title="Internal Service Thread"
          action={<Button size="sm">Post Comment</Button>}
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
            <p className="py-8 text-center text-sm text-text-muted">
              No comments yet.
            </p>
          )}
        </PageSection>
      )}
    </div>
  );
}
