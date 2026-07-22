"use client";

import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { EmptyState } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockInvoices } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { invoiceStatusVariant } from "@/lib/utils/invoiceStatus";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function InvoicesPage() {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockInvoices.filter((inv) => {
      const matchStatus = status === "all" || inv.status === status;
      const matchSearch =
        !q ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.caseName.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [status, search]);

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={status !== "all" ? 1 : 0}
        onClearFilters={() => setStatus("all")}
        filters={
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
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search invoices...",
        }}
      />
      {filtered.length === 0 ? (
        <EmptyState
          title="No invoices found"
          description="Try clearing filters or generate a new invoice."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Case</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((inv) => (
              <TableRow key={inv.id} onClick={() => router.push(`/billing/invoices/${inv.id}`)}>
                <TableCell className="font-semibold">{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.clientName}</TableCell>
                <TableCell className="max-w-[180px] truncate text-text-sec">{inv.caseName}</TableCell>
                <TableCell>{formatCurrency(inv.amount)}</TableCell>
                <TableCell><Badge variant={invoiceStatusVariant(inv.status)}>{inv.status}</Badge></TableCell>
                <TableCell className="text-text-muted">{formatDate(inv.dueDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
