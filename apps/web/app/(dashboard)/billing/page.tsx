import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { StatCard } from "@/components/dashboard/StatCard";
import { mockExpenses, mockInvoices, mockPayments } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { invoiceStatusVariant } from "@/lib/utils/invoiceStatus";
import { CreditCard, Receipt, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const totalInvoiced = mockInvoices.reduce((s, i) => s + i.amount, 0);
  const collected = mockPayments.reduce((s, p) => s + p.amount, 0);
  const outstanding = totalInvoiced - collected;
  const overdue = mockInvoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const totalExpenses = mockExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid-stats">
        <StatCard title="Invoiced" icon={Receipt} accent="blue" primaryValue={formatCurrency(totalInvoiced)} primaryLabel="Total billed" metrics={[{ label: "Invoices", value: mockInvoices.length }]} />
        <StatCard title="Collected" icon={Wallet} accent="green" primaryValue={formatCurrency(collected)} primaryLabel="Payments received" metrics={[{ label: "Receipts", value: mockPayments.length, highlight: true }]} />
        <StatCard title="Outstanding" icon={TrendingUp} accent="amber" primaryValue={formatCurrency(outstanding)} primaryLabel="Awaiting payment" metrics={[{ label: "Overdue", value: formatCurrency(overdue), highlight: true }]} />
        <StatCard title="Expenses" icon={CreditCard} accent="sidebar" primaryValue={formatCurrency(totalExpenses)} primaryLabel="Case expenses logged" metrics={[{ label: "Entries", value: mockExpenses.length }]} />
      </div>

      <div className="grid-pair">
        <PageSection
          title="Recent Invoices"
          action={
            <Link href="/billing/invoices">
              <Button variant="ghost">View all</Button>
            </Link>
          }
        >
          <Table>
            <TableHeader>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableHeader>
            <TableBody>
              {mockInvoices.slice(0, 4).map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-semibold">
                    <Link href={`/billing/invoices/${inv.id}`} className="hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-text-sec">{inv.clientName}</TableCell>
                  <TableCell>{formatCurrency(inv.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={invoiceStatusVariant(inv.status)}>{inv.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PageSection>

        <PageSection title="VAT / AIT Compliance">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between rounded-card bg-cream-card px-3 py-2">
              <span className="text-text-sec">VAT (15%)</span>
              <span className="font-semibold">{formatCurrency(Math.round(totalInvoiced * 0.15))}</span>
            </div>
            <div className="flex justify-between rounded-card bg-cream-card px-3 py-2">
              <span className="text-text-sec">AIT withheld</span>
              <span className="font-semibold">{formatCurrency(Math.round(collected * 0.1))}</span>
            </div>
            <p className="text-xs text-text-muted">Calculated per NBR professional services rules. Export reports for filing.</p>
          </div>
        </PageSection>
      </div>
    </div>
  );
}
