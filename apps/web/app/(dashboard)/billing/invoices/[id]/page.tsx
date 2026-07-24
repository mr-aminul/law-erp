"use client";

import { UploadDocumentForm } from "@/components/cases/UploadDocumentForm";
import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DetailField, EmptyState, PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockPayments } from "@/lib/mock";
import {
  type CreateDocumentInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { invoiceStatusVariant } from "@/lib/utils/invoiceStatus";
import { documentAccessUsers } from "@/types/document";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const ready = useDomainStore((s) => s.hydrated);
  const invoices = useDomainStore((s) => s.invoices);
  const documents = useDomainStore((s) => s.documents);
  const createDocument = useDomainStore((s) => s.createDocument);
  const invoice = invoices.find((i) => i.id === params.id);
  const [uploadOpen, setUploadOpen] = useState(false);

  if (ready && !invoice) notFound();
  if (!invoice) return null;

  const payments = mockPayments.filter((p) => p.invoiceId === invoice.id);
  const files = documents.filter((d) => d.invoiceId === invoice.id);
  const vat = Math.round(invoice.amount * 0.15);

  function handleCreateDocument(input: CreateDocumentInput) {
    const created = createDocument(input);
    setUploadOpen(false);
    if (created) router.push(`/documents/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-card border border-gray-200 bg-surface p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">{invoice.invoiceNumber}</h2>
            <Badge variant={invoiceStatusVariant(invoice.status)}>
              {invoice.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-text-sec">{invoice.clientName} · {invoice.caseName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/billing/invoices"><Button variant="secondary">Back to list</Button></Link>
        </div>
      </div>

      <PageSection title="Invoice Details">
        <div className="grid-fields-3">
          <DetailField label="Amount (BDT)" value={formatCurrency(invoice.amount)} />
          <DetailField label="VAT (15%)" value={formatCurrency(vat)} />
          <DetailField label="Total" value={formatCurrency(invoice.amount + vat)} />
          <DetailField label="Due Date" value={formatDate(invoice.dueDate)} />
          <DetailField label="Created" value={formatDate(invoice.createdAt)} />
          <DetailField label="Case Ref" value={invoice.caseId} />
        </div>
      </PageSection>

      <PageSection
        title="Files"
        description="Invoice PDFs, receipts, and supporting records — same access model as Documents."
        action={
          <Button type="button" onClick={() => setUploadOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Document
          </Button>
        }
      >
        {files.length === 0 ? (
          <EmptyState
            title="No files attached"
            description="Upload the invoice PDF, payment receipts, or supporting docs."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Document</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Uploaded</TableHead>
            </TableHeader>
            <TableBody>
              {files.map((doc) => (
                <TableRow
                  key={doc.id}
                  onClick={() => router.push(`/documents/${doc.id}`)}
                >
                  <TableCell className="font-semibold">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-text-muted" />
                      {doc.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-muted">
                    v{doc.version} · {doc.language} · {doc.size}
                  </TableCell>
                  <TableCell>
                    <AssignedLawyers lawyers={documentAccessUsers(doc)} />
                  </TableCell>
                  <TableCell className="text-text-muted">
                    {formatDate(doc.uploadedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PageSection>

      <PageSection title="Payment Receipts">
        {payments.length === 0 ? (
          <EmptyState title="No payments recorded" />
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Received</TableHead>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-semibold">{formatCurrency(p.amount)}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell className="text-text-sec">{p.reference}</TableCell>
                  <TableCell className="text-text-muted">{formatDate(p.receivedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PageSection>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Add Invoice Document"
        className="max-w-xl"
      >
        <UploadDocumentForm
          key={invoice.id}
          defaultInvoiceId={invoice.id}
          onSubmit={handleCreateDocument}
          onCancel={() => setUploadOpen(false)}
        />
      </Modal>
    </div>
  );
}
