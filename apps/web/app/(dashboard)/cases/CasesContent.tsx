"use client";

import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { CaseStatusSelect } from "@/components/cases/CaseStatusSelect";
import { NewCaseForm } from "@/components/cases/NewCaseForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
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
import { clampPage, getPageSlice } from "@/lib/utils/pagination";
import type { CaseStatus } from "@/types/case";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const statusOptions = CASE_STATUSES.map((s) => ({ value: s, label: s }));

const typeOptions = [
  { value: "Civil", label: "Civil" },
  { value: "Criminal", label: "Criminal" },
  { value: "Family", label: "Family" },
  { value: "Corporate", label: "Corporate" },
  { value: "Labour", label: "Labour" },
  { value: "Property", label: "Property" },
];

const lawyerOptions = mockStaff
  .filter((s) => s.role !== "Admin")
  .map((s) => ({ value: s.name, label: s.name, initials: s.initials }));

const DEFAULT_PAGE_SIZE = 15;

export default function CasesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [lawyerFilters, setLawyerFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, CaseStatus>
  >({});

  useEffect(() => {
    setNewCaseOpen(searchParams.get("new") === "1");
  }, [searchParams]);

  const cases = useMemo(() => {
    return mockCases.map((c) =>
      statusOverrides[c.id] ? { ...c, status: statusOverrides[c.id] } : c
    );
  }, [statusOverrides]);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        !search ||
        c.caseId.toLowerCase().includes(search.toLowerCase()) ||
        c.matter.toLowerCase().includes(search.toLowerCase()) ||
        c.clientName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(c.status);
      const matchesType =
        typeFilters.length === 0 || typeFilters.includes(c.type);
      const matchesLawyer =
        lawyerFilters.length === 0 ||
        c.assignedLawyers.some((lawyer) => lawyerFilters.includes(lawyer));
      return matchesSearch && matchesStatus && matchesType && matchesLawyer;
    });
  }, [cases, search, statusFilters, typeFilters, lawyerFilters]);

  const { slice: paginated, totalPages } = getPageSlice(
    filtered,
    page,
    pageSize
  );

  useEffect(() => {
    const safe = clampPage(page, totalPages);
    if (safe !== page) setPage(safe);
  }, [page, totalPages]);

  function openNewCaseModal() {
    setNewCaseOpen(true);
    if (searchParams.get("new") !== "1") {
      router.replace("/cases?new=1", { scroll: false });
    }
  }

  function closeNewCaseModal() {
    setNewCaseOpen(false);
    if (searchParams.get("new")) {
      router.replace("/cases");
    }
  }

  function handleCreateCase() {
    closeNewCaseModal();
    router.push("/cases/1");
  }

  function updateCaseStatus(caseId: string, status: CaseStatus) {
    setStatusOverrides((prev) => ({ ...prev, [caseId]: status }));
  }

  function handlePageSizeChange(next: number) {
    setPageSize(next);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={
          statusFilters.length + typeFilters.length + lawyerFilters.length
        }
        onClearFilters={() => {
          setStatusFilters([]);
          setTypeFilters([]);
          setLawyerFilters([]);
          setPage(1);
        }}
        filters={
          <>
            <MultiSelectDropdown
              label="Status"
              options={statusOptions}
              value={statusFilters}
              placeholder="All Statuses"
              onChange={(values) => {
                setStatusFilters(values);
                setPage(1);
              }}
            />
            <MultiSelectDropdown
              label="Case Type"
              options={typeOptions}
              value={typeFilters}
              placeholder="All Types"
              onChange={(values) => {
                setTypeFilters(values);
                setPage(1);
              }}
            />
            <MultiSelectDropdown
              label="Lawyer"
              options={lawyerOptions}
              value={lawyerFilters}
              placeholder="All Lawyers"
              showChips
              onChange={(values) => {
                setLawyerFilters(values);
                setPage(1);
              }}
            />
          </>
        }
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
          placeholder: "Search titles, clients...",
        }}
        actions={
          <Button type="button" onClick={openNewCaseModal}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Case
          </Button>
        }
      />

      <Card className="overflow-hidden border border-divider py-0 shadow-sm ring-0">
        <CardContent className="p-0">
        <Table rounded="top">
          <TableHeader>
            <TableHead>Client</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-0 whitespace-nowrap">Type</TableHead>
            <TableHead className="w-0 whitespace-nowrap">Status</TableHead>
            <TableHead>Assigned Lawyer</TableHead>
            <TableHead className="w-0 whitespace-nowrap">Next Hearing</TableHead>
            <TableHead className="w-0 whitespace-nowrap">Created</TableHead>
            <TableHead className="w-0 whitespace-nowrap" />
          </TableHeader>
          <TableBody>
            {paginated.map((c) => (
              <TableRow
                key={c.id}
                onClick={() => router.push(`/cases/${c.id}`)}
              >
                <TableCell>
                  <Link
                    href={`/clients/${c.clientId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-text-primary transition-colors hover:underline"
                  >
                    {c.clientName}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">{c.matter}</TableCell>
                <TableCell className="w-0 whitespace-nowrap">{c.type}</TableCell>
                <TableCell className="w-0 whitespace-nowrap">
                  <CaseStatusSelect
                    status={c.status}
                    onChange={(status) => updateCaseStatus(c.id, status)}
                  />
                </TableCell>
                <TableCell>
                  <AssignedLawyers lawyers={c.assignedLawyers} />
                </TableCell>
                <TableCell className="w-0 whitespace-nowrap tabular-nums">
                  {c.nextHearing ? formatDate(c.nextHearing) : "—"}
                </TableCell>
                <TableCell className="w-0 whitespace-nowrap tabular-nums">
                  {formatDate(c.createdAt)}
                </TableCell>
                <TableCell className="w-0 whitespace-nowrap">
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="rounded-input p-1.5 text-text-primary transition-all hover:bg-cream-card group-hover:opacity-80"
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
          <p className="py-12 text-center text-sm text-text-primary">
            No cases match your filters.
          </p>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          itemLabel="cases"
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          className="mt-0 rounded-b-lg border-divider px-4 py-2"
        />
        </CardContent>
      </Card>

      <Modal
        open={newCaseOpen}
        onClose={closeNewCaseModal}
        title="New Case"
        className="max-w-2xl"
      >
        <NewCaseForm onSubmit={handleCreateCase} onCancel={closeNewCaseModal} />
      </Modal>
    </div>
  );
}
