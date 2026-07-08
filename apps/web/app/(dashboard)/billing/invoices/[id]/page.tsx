import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DetailField, PageSection } from "@/components/ui/PageSection";
import { mockInvoices, mockPayments } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { FileDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = mockInvoices.find((i) => i.id === params.id);
  if (!invoice) notFound();

  const payments = mockPayments.filter((p) => p.invoiceId === invoice.id);
  const vat = Math.round(invoice.amount * 0.15);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between rounded-card border border-divider/70 bg-surface p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{invoice.invoiceNumber}</h2>
            <Badge variant={invoice.status === "Paid" ? "green" : invoice.status === "Overdue" ? "red" : "amber"}>
              {invoice.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-text-sec">{invoice.clientName} · {invoice.caseName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><FileDown className="mr-1.5 h-4 w-4" />PDF</Button>
          <Link href="/billing/invoices"><Button variant="ghost" size="sm">Back</Button></Link>
        </div>
      </div>

      <PageSection title="Invoice Details">
        <div className="grid grid-cols-3 gap-4">
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
          <p className="text-sm text-text-muted">No payments recorded.</p>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex justify-between rounded-card border border-divider/60 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold">{formatCurrency(p.amount)}</p>
                  <p className="text-xs text-text-muted">{p.method} · Ref: {p.reference}</p>
                </div>
                <span className="text-xs text-text-muted">{formatDate(p.receivedAt)}</span>
              </div>
            ))}
          </div>
        )}
        <Button size="sm" className="mt-3">Log Payment</Button>
      </PageSection>
    </div>
  );
}
