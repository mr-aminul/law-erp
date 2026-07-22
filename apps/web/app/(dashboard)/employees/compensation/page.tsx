"use client";

import { EmptyState } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockCompensation } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { useRouter } from "next/navigation";

export default function CompensationPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {mockCompensation.length === 0 ? (
        <EmptyState
          title="No payroll records"
          description="Payroll cycles will appear here once processing is connected."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Employee</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>TDS</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead>Paid</TableHead>
          </TableHeader>
          <TableBody>
            {mockCompensation.map((c) => (
              <TableRow key={c.id} onClick={() => router.push(`/employees/${c.staffId}`)}>
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
      )}
    </div>
  );
}
