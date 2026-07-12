"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
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
import { mockExpenses } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { Plus } from "lucide-react";

export default function ExpensesPage() {
  return (
    <div className="space-y-4">
      <SubNav items={billingSubNav} />
      <ListToolbar
        actions={
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Expense
          </Button>
        }
      />
      <PageSection title="Case Expenses" description="Court fees, stamp duty, travel — tracked per matter.">
        <Table compact>
          <TableHeader>
            <TableHead>Date</TableHead>
            <TableHead>Case</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Recorded By</TableHead>
          </TableHeader>
          <TableBody>
            {mockExpenses.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-text-muted">{formatDate(e.date)}</TableCell>
                <TableCell className="max-w-[180px] truncate font-semibold">{e.caseName}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell>{formatCurrency(e.amount)}</TableCell>
                <TableCell className="text-text-sec">{e.recordedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
