import { FYTable } from "@/components/dashboard/FYTable";
import { MonthlyCasesChart } from "@/components/dashboard/MonthlyCasesChart";
import { StatusDonut } from "@/components/dashboard/StatusDonut";
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
import { mockCases, mockHearings, mockInvoices, mockStaff } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const byPractice = Object.entries(
    mockCases.reduce<Record<string, number>>((acc, c) => {
      acc[c.type] = (acc[c.type] ?? 0) + 1;
      return acc;
    }, {})
  );

  const byLawyer = mockStaff
    .filter((s) => s.role !== "Admin")
    .map((s) => ({ name: s.name, cases: s.activeCases }));

  const upcomingHearings = mockHearings.filter((h) => h.date >= "2026-06-03").slice(0, 5);
  const overdueInvoices = mockInvoices.filter((i) => i.status === "Overdue");

  return (
    <div className="space-y-4">
      <PageSection
        title="Monthly Revenue Summary"
        action={
          <div className="flex gap-2">
            <Button variant="secondary">
              <Download className="mr-1.5 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="secondary">
              <Download className="mr-1.5 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-card bg-green-light p-4 text-center">
            <p className="text-2xl font-bold text-green">{formatCurrency(1845000)}</p>
            <p className="text-xs text-text-sec">Invoiced (May)</p>
          </div>
          <div className="rounded-card bg-blue-light p-4 text-center">
            <p className="text-2xl font-bold text-blue">{formatCurrency(1420000)}</p>
            <p className="text-xs text-text-sec">Collected (May)</p>
          </div>
          <div className="rounded-card bg-amber-light p-4 text-center">
            <p className="text-2xl font-bold text-amber">{formatCurrency(425000)}</p>
            <p className="text-xs text-text-sec">Outstanding</p>
          </div>
        </div>
      </PageSection>

      <div className="grid-pair">
        <PageSection title="Active Cases by Practice Area">
          <div className="space-y-2">
            {byPractice.map(([area, count]) => (
              <div key={area} className="flex justify-between rounded-card bg-cream-card px-3 py-2 text-sm">
                <span>{area}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection title="Cases by Lawyer">
          <Table compact>
            <TableHeader>
              <TableHead>Lawyer</TableHead>
              <TableHead>Active Cases</TableHead>
            </TableHeader>
            <TableBody>
              {byLawyer.map((l) => (
                <TableRow key={l.name}>
                  <TableCell className="font-semibold">{l.name}</TableCell>
                  <TableCell>{l.cases}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PageSection>
      </div>

      <div className="grid-pair">
        <PageSection title="Case Status Distribution">
          <StatusDonut />
        </PageSection>
        <PageSection title="Monthly Cases Due">
          <MonthlyCasesChart />
        </PageSection>
      </div>

      <PageSection title="FY Wise Case Status Report">
        <FYTable />
      </PageSection>

      <div className="grid-pair">
        <PageSection title="Upcoming Hearings (Next 7 Days)">
          <div className="space-y-2">
            {upcomingHearings.map((h) => (
              <div key={h.id} className="flex justify-between rounded-card border border-gray-200 px-3 py-2 text-sm">
                <span className="truncate">{h.caseName}</span>
                <span className="shrink-0 text-text-muted">{formatDate(h.date)}</span>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection title="Overdue Payments Aging">
          {overdueInvoices.length === 0 ? (
            <p className="text-sm text-text-muted">No overdue invoices.</p>
          ) : (
            <div className="space-y-2">
              {overdueInvoices.map((inv) => (
                <div key={inv.id} className="flex justify-between rounded-card border border-red/20 bg-red-light/30 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold">{inv.clientName}</p>
                    <p className="text-xs text-text-muted">{inv.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red">{formatCurrency(inv.amount)}</p>
                    <Badge variant="red">Overdue</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PageSection>
      </div>
    </div>
  );
}
