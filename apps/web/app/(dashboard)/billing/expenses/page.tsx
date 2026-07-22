"use client";

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
import { mockExpenses } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { useMemo, useState } from "react";

export default function ExpensesPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockExpenses.filter(
      (e) =>
        !q ||
        e.description.toLowerCase().includes(q) ||
        e.caseName.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <ListToolbar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search expenses...",
        }}
      />
      {filtered.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="Try clearing your search or add a new expense."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Date</TableHead>
            <TableHead>Case</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Recorded By</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
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
      )}
    </div>
  );
}
