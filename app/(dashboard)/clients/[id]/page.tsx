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
  getCasesByClientId,
  getClientById,
  getInvoicesByClientId,
  mockContactLogs,
} from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const client = getClientById(params.id);
  const [tab, setTab] = useState("overview");

  if (!client) notFound();

  const cases = getCasesByClientId(client.id);
  const invoices = getInvoicesByClientId(client.id);
  const contacts = mockContactLogs.filter((c) => c.clientId === client.id);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "cases", label: "Cases" },
    { id: "invoices", label: "Invoices" },
    { id: "contacts", label: "Contact History" },
    { id: "kyc", label: "KYC Vault" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between rounded-card border border-divider/70 bg-white p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">{client.name}</h2>
            <Badge variant={client.status === "Active" ? "green" : "muted"}>
              {client.status}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-text-sec">
            {client.clientId} · {client.type}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.push("/clients")}>
          Back to list
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      {tab === "overview" && (
        <PageSection title="Profile">
          <div className="grid grid-cols-3 gap-4">
            <DetailField label="Email" value={client.email ?? "—"} />
            <DetailField label="Phone" value={client.phone ?? "—"} />
            <DetailField label="NID / Reg. No." value={client.nid ?? client.registrationNo ?? "—"} />
            <DetailField label="Address" value={client.address ?? "—"} />
            <DetailField label="Referral Source" value={client.referralSource ?? "—"} />
            <DetailField label="Member Since" value={formatDate(client.createdAt)} />
            <DetailField
              label="Conflict Check"
              value={
                client.conflictChecked ? (
                  <Badge variant="green">Cleared</Badge>
                ) : (
                  <Badge variant="amber">Pending</Badge>
                )
              }
            />
            <DetailField label="Active Cases" value={client.activeCases} />
            <DetailField label="Total Billed" value={formatCurrency(client.totalBilled)} />
          </div>
        </PageSection>
      )}

      {tab === "cases" && (
        <PageSection title="Linked Cases">
          <Table compact>
            <TableHeader>
              <TableHead>Case ID</TableHead>
              <TableHead>Matter</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id} onClick={() => router.push(`/cases/${c.id}`)}>
                  <TableCell className="font-semibold">{c.caseId}</TableCell>
                  <TableCell>{c.matter}</TableCell>
                  <TableCell className="text-text-sec">{c.type}</TableCell>
                  <TableCell><CaseStatusBadge status={c.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PageSection>
      )}

      {tab === "invoices" && (
        <PageSection title="Invoices">
          <Table compact>
            <TableHeader>
              <TableHead>Invoice #</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} onClick={() => router.push(`/billing/invoices/${inv.id}`)}>
                  <TableCell className="font-semibold">{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.caseName}</TableCell>
                  <TableCell>{formatCurrency(inv.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "Paid" ? "green" : inv.status === "Overdue" ? "red" : inv.status === "Draft" ? "muted" : "amber"}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-muted">{formatDate(inv.dueDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PageSection>
      )}

      {tab === "contacts" && (
        <PageSection title="Contact History">
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <p className="text-sm text-text-muted">No contact logs yet.</p>
            ) : (
              contacts.map((log) => (
                <div key={log.id} className="rounded-card border border-divider/60 bg-cream-card p-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="blue">{log.type}</Badge>
                    <span className="text-xs text-text-muted">{formatDate(log.loggedAt)}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{log.subject}</p>
                  <p className="mt-1 text-xs text-text-sec">{log.notes}</p>
                  <p className="mt-2 text-[11px] text-text-muted">Logged by {log.loggedBy}</p>
                </div>
              ))
            )}
          </div>
        </PageSection>
      )}

      {tab === "kyc" && (
        <PageSection title="KYC Document Vault">
          <div className="space-y-2">
            {(client.kycDocuments ?? []).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-card border border-divider/60 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold">{doc.type}</p>
                  {doc.expiryDate && (
                    <p className="text-xs text-text-muted">Expires {formatDate(doc.expiryDate)}</p>
                  )}
                </div>
                <Badge variant={doc.verified ? "green" : "amber"}>
                  {doc.verified ? "Verified" : "Pending"}
                </Badge>
              </div>
            ))}
            {!client.kycDocuments?.length && (
              <p className="text-sm text-text-muted">No KYC documents uploaded.</p>
            )}
          </div>
        </PageSection>
      )}
    </div>
  );
}
