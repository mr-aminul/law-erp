"use client";

import { NewFilingForm } from "@/components/court-filing/NewFilingForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { Modal } from "@/components/ui/Modal";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { EmptyState } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockStaff } from "@/lib/mock";
import {
  type CreateFilingInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { FilingStatus } from "@/types/filing";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

const statusOptions: { value: FilingStatus; label: string }[] = [
  { value: "Draft", label: "Draft" },
  { value: "Submitted", label: "Submitted" },
  { value: "Accepted", label: "Accepted" },
  { value: "Rejected", label: "Rejected" },
];

const typeOptions = [
  "Writ Petition",
  "Plaint",
  "Appeal",
  "Review",
  "Misc. Application",
].map((t) => ({ value: t, label: t }));

const filedByOptions = mockStaff
  .filter((s) => s.role !== "Admin")
  .map((s) => ({ value: s.name, label: s.name, initials: s.initials }));

const statusVariant = (s: string) =>
  s === "Accepted" ? "green" : s === "Rejected" ? "red" : s === "Submitted" ? "blue" : "muted";

function CourtFilingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [filedByFilters, setFiledByFilters] = useState<string[]>([]);
  const [newFilingOpen, setNewFilingOpen] = useState(false);
  const filings = useDomainStore((s) => s.filings);
  const createFiling = useDomainStore((s) => s.createFiling);

  const prefillCaseId = searchParams.get("case") ?? undefined;

  useEffect(() => {
    setNewFilingOpen(searchParams.get("new") === "1");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return filings.filter((f) => {
      const matchesSearch =
        !q ||
        f.filingRef.toLowerCase().includes(q) ||
        f.caseName.toLowerCase().includes(q) ||
        f.court.toLowerCase().includes(q) ||
        f.filedBy.toLowerCase().includes(q);
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(f.status);
      const matchesType =
        typeFilters.length === 0 || typeFilters.includes(f.filingType);
      const matchesFiledBy =
        filedByFilters.length === 0 || filedByFilters.includes(f.filedBy);
      return matchesSearch && matchesStatus && matchesType && matchesFiledBy;
    });
  }, [filings, search, statusFilters, typeFilters, filedByFilters]);

  function openNewFilingModal() {
    setNewFilingOpen(true);
    if (searchParams.get("new") !== "1") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("new", "1");
      router.replace(`/court-filing?${params}`, { scroll: false });
    }
  }

  function closeNewFilingModal() {
    setNewFilingOpen(false);
    if (searchParams.get("new")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("new");
      const qs = params.toString();
      router.replace(qs ? `/court-filing?${qs}` : "/court-filing");
    }
  }

  function handleCreateFiling(input: CreateFilingInput) {
    const created = createFiling(input);
    closeNewFilingModal();
    if (created) {
      router.push(`/cases/${created.caseId}?tab=filings&filing=${created.id}`);
    }
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={
          statusFilters.length + typeFilters.length + filedByFilters.length
        }
        onClearFilters={() => {
          setStatusFilters([]);
          setTypeFilters([]);
          setFiledByFilters([]);
        }}
        filters={
          <>
            <MultiSelectDropdown
              label="Status"
              options={statusOptions}
              value={statusFilters}
              placeholder="All Statuses"
              onChange={setStatusFilters}
            />
            <MultiSelectDropdown
              label="Filing Type"
              options={typeOptions}
              value={typeFilters}
              placeholder="All Types"
              onChange={setTypeFilters}
            />
            <MultiSelectDropdown
              label="Filed By"
              options={filedByOptions}
              value={filedByFilters}
              placeholder="All Lawyers"
              showChips
              onChange={setFiledByFilters}
            />
          </>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search refs, cases, courts...",
        }}
        actions={
          <Button type="button" onClick={openNewFilingModal}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Filing
          </Button>
        }
      />
      {filtered.length === 0 ? (
        <EmptyState
          title="No filings match your filters"
          description="Try clearing filters or search terms."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Ref</TableHead>
            <TableHead>Case</TableHead>
            <TableHead>Court</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Filed By</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Summons</TableHead>
            <TableHead>Status</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((f) => (
              <TableRow
                key={f.id}
                onClick={() =>
                  router.push(`/cases/${f.caseId}?tab=filings&filing=${f.id}`)
                }
              >
                <TableCell className="font-semibold">{f.filingRef}</TableCell>
                <TableCell className="max-w-[160px] truncate">{f.caseName}</TableCell>
                <TableCell className="text-text-sec">{f.court}</TableCell>
                <TableCell>{f.filingType}</TableCell>
                <TableCell>{f.filedBy}</TableCell>
                <TableCell>{formatCurrency(f.filingFee)}</TableCell>
                <TableCell>{f.summonsDispatched ? "Sent" : "—"}</TableCell>
                <TableCell><Badge variant={statusVariant(f.status)}>{f.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        open={newFilingOpen}
        onClose={closeNewFilingModal}
        title="New Filing"
        className="max-w-xl"
      >
        <NewFilingForm
          key={prefillCaseId ?? "any-case"}
          defaultCaseId={prefillCaseId}
          onSubmit={handleCreateFiling}
          onCancel={closeNewFilingModal}
        />
      </Modal>
    </div>
  );
}

export default function CourtFilingPage() {
  return (
    <Suspense fallback={<div className="text-sm text-text-muted">Loading filings...</div>}>
      <CourtFilingContent />
    </Suspense>
  );
}
