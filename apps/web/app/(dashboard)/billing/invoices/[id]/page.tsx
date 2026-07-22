import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DetailField, EmptyState, PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockInvoices, mockPayments } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { invoiceStatusVariant } from "@/lib/utils/invoiceStatus";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = mockInvoices.find((i) => i.id === params.id);
  if (!invoice) notFound();

  const payments = mockPayments.filter((p) => p.invoiceId === invoice.id);
  const vat = Math.round(invoice.amount * 0.15);

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
    </div>
  );
}
