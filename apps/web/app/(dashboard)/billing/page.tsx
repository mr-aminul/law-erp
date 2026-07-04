import { SubNav } from "@/components/layout/SubNav";
import { Badge } from "@/components/ui/Badge";
import { PageSection } from "@/components/ui/PageSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { billingSubNav } from "@/lib/config/navigation";
import { mockExpenses, mockInvoices, mockPayments } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
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
      <SubNav items={billingSubNav} />

      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Invoiced" icon={Receipt} accent="blue" primaryValue={formatCurrency(totalInvoiced)} primaryLabel="Total billed" metrics={[{ label: "Invoices", value: mockInvoices.length }]} />
        <StatCard title="Collected" icon={Wallet} accent="green" primaryValue={formatCurrency(collected)} primaryLabel="Payments received" metrics={[{ label: "Receipts", value: mockPayments.length, highlight: true }]} />
        <StatCard title="Outstanding" icon={TrendingUp} accent="amber" primaryValue={formatCurrency(outstanding)} primaryLabel="Awaiting payment" metrics={[{ label: "Overdue", value: formatCurrency(overdue), highlight: true }]} />
        <StatCard title="Expenses" icon={CreditCard} accent="sidebar" primaryValue={formatCurrency(totalExpenses)} primaryLabel="Case expenses logged" metrics={[{ label: "Entries", value: mockExpenses.length }]} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PageSection title="Recent Invoices">
          <div className="space-y-2">
            {mockInvoices.slice(0, 4).map((inv) => (
              <Link key={inv.id} href={`/billing/invoices/${inv.id}`} className="flex items-center justify-between rounded-card border border-divider/60 px-3 py-2 hover:bg-cream-card">
                <div>
                  <p className="text-sm font-semibold">{inv.invoiceNumber}</p>
                  <p className="text-xs text-text-muted">{inv.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(inv.amount)}</p>
                  <Badge variant={inv.status === "Paid" ? "green" : inv.status === "Overdue" ? "red" : "amber"}>{inv.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
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
