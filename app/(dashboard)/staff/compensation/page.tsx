"use client";

import { SubNav } from "@/components/layout/SubNav";
import { PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { staffSubNav } from "@/lib/config/navigation";
import { mockCompensation } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { Button } from "@/components/ui/Button";

export default function CompensationPage() {
  return (
    <div className="space-y-4">
      <SubNav items={staffSubNav} />
      <div className="flex justify-end">
        <Button size="sm">Run Payroll</Button>
      </div>
      <PageSection title="Payroll Records" description="BDT salary with TDS deduction — May 2026 cycle.">
        <Table compact>
          <TableHeader>
            <TableHead>Staff</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>TDS</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead>Paid</TableHead>
          </TableHeader>
          <TableBody>
            {mockCompensation.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-semibold">{c.staffName}</TableCell>
                <TableCell>{c.month}</TableCell>
                <TableCell>{formatCurrency(c.grossSalary)}</TableCell>
                <TableCell className="text-red">{formatCurrency(c.tds)}</TableCell>
                <TableCell className="font-bold text-green">{formatCurrency(c.netSalary)}</TableCell>
                <TableCell className="text-text-muted">{c.paidAt ? formatDate(c.paidAt) : "Pending"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
