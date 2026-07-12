"use client";

import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { filterCasesByStatus, mockCases } from "@/lib/mock/data";
import { useAppStore } from "@/lib/store/appStore";
import { CASE_STATUSES } from "@/lib/utils/caseStatus";
import type { CaseStatus } from "@/types/case";
import { useRouter } from "next/navigation";

const statusTabs = [
  { id: "All", label: "All" },
  ...CASE_STATUSES.map((s) => ({ id: s, label: s })),
];

export function CasesTable() {
  const router = useRouter();
  const { caseFilterStatus, setCaseFilterStatus } = useAppStore();
  const filtered = filterCasesByStatus(
    mockCases,
    caseFilterStatus as CaseStatus | "All"
  ).slice(0, 6);

  return (
    <div className="space-y-4">
      <Tabs
        tabs={statusTabs}
        activeTab={caseFilterStatus}
        onChange={(id) => setCaseFilterStatus(id as CaseStatus | "All")}
      />
      <Table>
        <TableHeader>
          <TableHead className="w-10">Sr</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Lawyer</TableHead>
          <TableHead>Status</TableHead>
        </TableHeader>
        <TableBody>
          {filtered.map((c, i) => (
            <TableRow key={c.id} onClick={() => router.push(`/cases/${c.id}`)}>
              <TableCell className="text-text-muted">{i + 1}</TableCell>
              <TableCell>{c.clientName}</TableCell>
              <TableCell className="max-w-[240px] truncate font-medium">
                {c.matter}
              </TableCell>
              <TableCell className="text-text-sec">
                {c.assignedLawyers[0]}
              </TableCell>
              <TableCell>
                <CaseStatusBadge status={c.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
