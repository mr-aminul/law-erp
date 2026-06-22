"use client";

import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  getCaseById,
  mockCaseComments,
  mockDocuments,
  mockExpenses,
  mockInvoices,
  mockMilestones,
  mockCaseNotes,
} from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

const stages = ["Filing", "Hearing", "Judgment", "Appeal", "Closed"];

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const caseData = getCaseById(params.id);
  const [tab, setTab] = useState("overview");

  if (!caseData) notFound();

  const docs = mockDocuments.filter((d) => d.caseId === caseData.id);
  const invoices = mockInvoices.filter((i) => i.caseId === caseData.caseId);
  const expenses = mockExpenses.filter((e) => e.caseId === caseData.id);
  const notes = mockCaseNotes.filter((n) => n.caseId === caseData.id);
  const comments = mockCaseComments.filter((c) => c.caseId === caseData.id);

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
      <div className="rounded-card border border-divider/70 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">{caseData.caseId}</h2>
              <CaseStatusBadge status={caseData.status} />
              <Badge variant="blue">{caseData.stage}</Badge>
            </div>
            <p className="mt-1 text-sm text-text-sec">{caseData.matter}</p>
            <p className="mt-0.5 text-xs text-text-muted">
              {caseData.clientName} · {caseData.type} · {caseData.courtName}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/calendar?case=${caseData.id}`}>
              <Button variant="secondary" size="sm">Schedule Hearing</Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={() => router.push("/cases")}>
              Back
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {caseData.assignedLawyers.map((l) => (
            <span key={l} className="rounded-badge bg-green-light px-2.5 py-1 text-xs font-semibold text-green">
              {l}
            </span>
          ))}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      {tab === "overview" && (
        <PageSection title="Case Overview">
          <div className="grid grid-cols-3 gap-4">
            <DetailField label="Case Number" value={caseData.caseNumber ?? "—"} />
            <DetailField label="Cause List Ref" value={caseData.causeListRef ?? "—"} />
            <DetailField label="Next Hearing" value={caseData.nextHearing ? formatDate(caseData.nextHearing) : "—"} />
            <DetailField label="Limitation Date" value={caseData.limitationDate ? formatDate(caseData.limitationDate) : "—"} />
            <DetailField label="Created" value={formatDate(caseData.createdAt)} />
            <DetailField label="Last Updated" value={formatDate(caseData.updatedAt)} />
            <DetailField label="Opposite Party" value={caseData.opposingParty?.name ?? "—"} />
            <DetailField label="Opposing Counsel" value={caseData.opposingParty?.counsel ?? "—"} />
            <DetailField label="Outcome" value={caseData.outcome ?? "Pending"} />
          </div>
          {caseData.description && (
            <p className="mt-4 text-sm text-text-sec">{caseData.description}</p>
          )}
        </PageSection>
      )}

      {tab === "pipeline" && (
        <PageSection title="Case Stage Pipeline">
          <div className="mb-6 flex items-center gap-1">
            {stages.map((stage, i) => {
              const currentIdx = stages.indexOf(caseData.stage);
              const done = i <= currentIdx;
              return (
                <div key={stage} className="flex flex-1 items-center">
                  <div className={`flex flex-col items-center ${done ? "text-green" : "text-text-muted"}`}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    <span className="mt-1 text-[10px] font-semibold">{stage}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className={`mx-1 h-0.5 flex-1 ${i < currentIdx ? "bg-green" : "bg-divider"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <h3 className="mb-3 text-xs font-bold uppercase text-text-muted">Milestones</h3>
          <div className="space-y-2">
            {mockMilestones.map((m) => (
              <label key={m.id} className="flex items-center gap-3 rounded-card border border-divider/60 px-3 py-2">
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
        <PageSection title="Case Documents" action={<Button size="sm">Upload Document</Button>}>
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

      {tab === "notes" && (
        <PageSection title="Notes & Internal Memos" action={<Button size="sm">Add Note</Button>}>
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className={`rounded-card border p-3 ${n.isMemo ? "border-amber/30 bg-amber-light/30" : "border-divider/60"}`}>
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
              <div key={c.id} className="rounded-card border border-divider/60 bg-cream-card p-3">
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
