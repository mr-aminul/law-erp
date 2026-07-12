"use client";

import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { CaseStatusSelect } from "@/components/cases/CaseStatusSelect";
import { NewServiceForm } from "@/components/cases/NewServiceForm";
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
import { mockServices, mockStaff } from "@/lib/mock/data";
import { CASE_STATUSES } from "@/lib/utils/caseStatus";
import { formatDate } from "@/lib/utils/formatDate";
import { clampPage, getPageSlice } from "@/lib/utils/pagination";
import type { CaseStatus } from "@/types/case";
import { SERVICE_TYPES } from "@/types/service";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const statusOptions = CASE_STATUSES.map((s) => ({ value: s, label: s }));

const typeOptions = SERVICE_TYPES.map((t) => ({ value: t, label: t }));

const lawyerOptions = mockStaff
  .filter((s) => s.role !== "Admin")
  .map((s) => ({ value: s.name, label: s.name, initials: s.initials }));

const DEFAULT_PAGE_SIZE = 15;

export default function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [lawyerFilters, setLawyerFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [newServiceOpen, setNewServiceOpen] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, CaseStatus>
  >({});

  useEffect(() => {
    setNewServiceOpen(searchParams.get("new") === "1");
  }, [searchParams]);

  const services = useMemo(() => {
    return mockServices.map((s) =>
      statusOverrides[s.id] ? { ...s, status: statusOverrides[s.id] } : s
    );
  }, [statusOverrides]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        !search ||
        s.serviceId.toLowerCase().includes(search.toLowerCase()) ||
        s.matter.toLowerCase().includes(search.toLowerCase()) ||
        s.clientName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(s.status);
      const matchesType =
        typeFilters.length === 0 || typeFilters.includes(s.type);
      const matchesLawyer =
        lawyerFilters.length === 0 ||
        s.assignedLawyers.some((lawyer) => lawyerFilters.includes(lawyer));
      return matchesSearch && matchesStatus && matchesType && matchesLawyer;
    });
  }, [services, search, statusFilters, typeFilters, lawyerFilters]);

  const { slice: paginated, totalPages } = getPageSlice(
    filtered,
    page,
    pageSize
  );

  useEffect(() => {
    const safe = clampPage(page, totalPages);
    if (safe !== page) setPage(safe);
  }, [page, totalPages]);

  function openNewServiceModal() {
    setNewServiceOpen(true);
    if (searchParams.get("new") !== "1") {
      router.replace("/cases/services?new=1", { scroll: false });
    }
  }

  function closeNewServiceModal() {
    setNewServiceOpen(false);
    if (searchParams.get("new")) {
      router.replace("/cases/services");
    }
  }

  function handleCreateService() {
    closeNewServiceModal();
    router.push("/cases/services/1");
  }

  function updateServiceStatus(serviceId: string, status: CaseStatus) {
    setStatusOverrides((prev) => ({ ...prev, [serviceId]: status }));
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
              label="Service Type"
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
          <Button type="button" onClick={openNewServiceModal}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Service
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
              <TableHead className="w-0 whitespace-nowrap">Due Date</TableHead>
              <TableHead className="w-0 whitespace-nowrap">Created</TableHead>
              <TableHead className="w-0 whitespace-nowrap" />
            </TableHeader>
            <TableBody>
              {paginated.map((s) => (
                <TableRow
                  key={s.id}
                  onClick={() => router.push(`/cases/services/${s.id}`)}
                >
                  <TableCell>
                    <Link
                      href={`/clients/${s.clientId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-text-primary transition-colors hover:underline"
                    >
                      {s.clientName}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{s.matter}</TableCell>
                  <TableCell className="w-0 whitespace-nowrap">{s.type}</TableCell>
                  <TableCell className="w-0 whitespace-nowrap">
                    <CaseStatusSelect
                      status={s.status}
                      onChange={(status) => updateServiceStatus(s.id, status)}
                    />
                  </TableCell>
                  <TableCell>
                    <AssignedLawyers lawyers={s.assignedLawyers} />
                  </TableCell>
                  <TableCell className="w-0 whitespace-nowrap tabular-nums">
                    {s.dueDate ? formatDate(s.dueDate) : "—"}
                  </TableCell>
                  <TableCell className="w-0 whitespace-nowrap tabular-nums">
                    {formatDate(s.createdAt)}
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
              No services match your filters.
            </p>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            itemLabel="services"
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            className="mt-0 rounded-b-lg border-divider px-4 py-2"
          />
        </CardContent>
      </Card>

      <Modal
        open={newServiceOpen}
        onClose={closeNewServiceModal}
        title="New Service"
        className="max-w-2xl"
      >
        <NewServiceForm
          onSubmit={handleCreateService}
          onCancel={closeNewServiceModal}
        />
      </Modal>
    </div>
  );
}
