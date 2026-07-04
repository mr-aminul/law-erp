"use client";

import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockCases, mockStaff } from "@/lib/mock/data";
import { CASE_STATUSES } from "@/lib/utils/caseStatus";
import { formatDate } from "@/lib/utils/formatDate";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  ...CASE_STATUSES.map((s) => ({ value: s, label: s })),
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "Civil", label: "Civil" },
  { value: "Criminal", label: "Criminal" },
  { value: "Family", label: "Family" },
  { value: "Corporate", label: "Corporate" },
  { value: "Labour", label: "Labour" },
  { value: "Property", label: "Property" },
];

const lawyerOptions = [
  { value: "all", label: "All Lawyers" },
  ...mockStaff
    .filter((s) => s.role !== "Admin")
    .map((s) => ({ value: s.name, label: s.name })),
];

const PAGE_SIZE = 5;

export default function CasesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [lawyerFilter, setLawyerFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return mockCases.filter((c) => {
      const matchesSearch =
        !search ||
        c.caseId.toLowerCase().includes(search.toLowerCase()) ||
        c.matter.toLowerCase().includes(search.toLowerCase()) ||
        c.clientName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;
      const matchesType = typeFilter === "all" || c.type === typeFilter;
      const matchesLawyer =
        lawyerFilter === "all" ||
        c.assignedLawyers.some((l) => l === lawyerFilter);
      return matchesSearch && matchesStatus && matchesType && matchesLawyer;
    });
  }, [search, statusFilter, typeFilter, lawyerFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((c) => c.id)));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search cases, clients, case ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Link href="/cases/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            New Case
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Dropdown
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        />
        <Dropdown
          label="Case Type"
          options={typeOptions}
          value={typeFilter}
          onChange={(v) => {
            setTypeFilter(v);
            setPage(1);
          }}
        />
        <Dropdown
          label="Lawyer"
          options={lawyerOptions}
          value={lawyerFilter}
          onChange={(v) => {
            setLawyerFilter(v);
            setPage(1);
          }}
        />
        {selected.size > 0 && (
          <Button variant="secondary" size="sm" className="self-end">
            Bulk Update ({selected.size})
          </Button>
        )}
      </div>

      <Card>
        <CardContent>
        <Table>
          <TableHeader>
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={
                  paginated.length > 0 && selected.size === paginated.length
                }
                onChange={toggleSelectAll}
                className="rounded border-divider"
              />
            </TableHead>
            <TableHead>Case ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Lawyer</TableHead>
            <TableHead>Next Hearing</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-10" />
          </TableHeader>
          <TableBody>
            {paginated.map((c) => (
              <TableRow
                key={c.id}
                onClick={() => router.push(`/cases/${c.id}`)}
              >
                <TableCell>
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="rounded border-divider"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{c.caseId}</TableCell>
                <TableCell>{c.clientName}</TableCell>
                <TableCell className="text-text-sec">{c.type}</TableCell>
                <TableCell>
                  <CaseStatusBadge status={c.status} />
                </TableCell>
                <TableCell className="text-text-sec">
                  {c.assignedLawyers.join(", ")}
                </TableCell>
                <TableCell className="text-text-sec">
                  {c.nextHearing ? formatDate(c.nextHearing) : "—"}
                </TableCell>
                <TableCell className="text-text-muted">
                  {formatDate(c.createdAt)}
                </TableCell>
                <TableCell>
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="rounded p-1 text-text-muted hover:bg-cream-card hover:text-text-primary"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">
            No cases match your filters.
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-divider pt-4">
            <p className="text-sm text-text-muted">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
