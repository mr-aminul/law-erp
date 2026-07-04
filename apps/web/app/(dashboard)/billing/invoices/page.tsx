"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { billingSubNav } from "@/lib/config/navigation";
import { mockInvoices } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { FileDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const statusVariant = (s: string) =>
  s === "Paid" ? "green" : s === "Overdue" ? "red" : s === "Draft" ? "muted" : "amber";

export default function InvoicesPage() {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const filtered = useMemo(
    () => (status === "all" ? mockInvoices : mockInvoices.filter((i) => i.status === status)),
    [status]
  );

  return (
    <div className="space-y-4">
      <SubNav items={billingSubNav} />
      <div className="flex items-center justify-between">
        <Dropdown
          label="Status"
          options={[
            { value: "all", label: "All" },
            { value: "Draft", label: "Draft" },
            { value: "Sent", label: "Sent" },
            { value: "Paid", label: "Paid" },
            { value: "Overdue", label: "Overdue" },
          ]}
          value={status}
          onChange={setStatus}
        />
        <Button><Plus className="mr-1.5 h-4 w-4" />Generate Invoice</Button>
      </div>
      <div className="rounded-card border border-divider/70 bg-white p-4 shadow-sm">
        <Table compact>
          <TableHeader>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Case</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead />
          </TableHeader>
          <TableBody>
            {filtered.map((inv) => (
              <TableRow key={inv.id} onClick={() => router.push(`/billing/invoices/${inv.id}`)}>
                <TableCell className="font-semibold">{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.clientName}</TableCell>
                <TableCell className="max-w-[180px] truncate text-text-sec">{inv.caseName}</TableCell>
                <TableCell>{formatCurrency(inv.amount)}</TableCell>
                <TableCell><Badge variant={statusVariant(inv.status)}>{inv.status}</Badge></TableCell>
                <TableCell className="text-text-muted">{formatDate(inv.dueDate)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <FileDown className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
