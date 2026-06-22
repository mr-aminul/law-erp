"use client";

import { SubNav } from "@/components/layout/SubNav";
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
import { billingSubNav } from "@/lib/config/navigation";
import { mockTimeEntries } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { Plus } from "lucide-react";
import { useMemo } from "react";

export default function TimeTrackingPage() {
  const byLawyer = useMemo(() => {
    const map = new Map<string, { hours: number; amount: number }>();
    mockTimeEntries.forEach((t) => {
      const cur = map.get(t.lawyer) ?? { hours: 0, amount: 0 };
      map.set(t.lawyer, {
        hours: cur.hours + t.hours,
        amount: cur.amount + t.hours * t.rate,
      });
    });
    return Array.from(map.entries());
  }, []);

  return (
    <div className="space-y-4">
      <SubNav items={billingSubNav} />
      <div className="flex justify-end">
        <Button><Plus className="mr-1.5 h-4 w-4" />Log Hours</Button>
      </div>

      <PageSection title="Billable Hours Log">
        <Table compact>
          <TableHeader>
            <TableHead>Date</TableHead>
            <TableHead>Lawyer</TableHead>
            <TableHead>Case</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Amount</TableHead>
          </TableHeader>
          <TableBody>
            {mockTimeEntries.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-text-muted">{formatDate(t.date)}</TableCell>
                <TableCell className="font-semibold">{t.lawyer}</TableCell>
                <TableCell className="max-w-[160px] truncate">{t.caseName}</TableCell>
                <TableCell className="text-text-sec">{t.description}</TableCell>
                <TableCell>{t.hours}h</TableCell>
                <TableCell>{formatCurrency(t.rate)}/hr</TableCell>
                <TableCell className="font-semibold">{formatCurrency(t.hours * t.rate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>

      <PageSection title="Weekly Summary by Lawyer">
        <div className="grid grid-cols-3 gap-3">
          {byLawyer.map(([lawyer, data]) => (
            <div key={lawyer} className="rounded-card border border-divider/60 p-3">
              <p className="text-sm font-semibold">{lawyer}</p>
              <p className="mt-1 text-lg font-bold text-green">{data.hours}h</p>
              <p className="text-xs text-text-muted">{formatCurrency(data.amount)} billable</p>
              <Button size="sm" variant="outline" className="mt-2">Export to Invoice</Button>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
