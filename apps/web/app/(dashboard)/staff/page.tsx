"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { ListToolbar } from "@/components/ui/ListToolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { staffSubNav } from "@/lib/config/navigation";
import { mockStaff } from "@/lib/mock";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function StaffPage() {
  const router = useRouter();
  const [role, setRole] = useState("all");
  const filtered = useMemo(
    () => (role === "all" ? mockStaff : mockStaff.filter((s) => s.role === role)),
    [role]
  );

  return (
    <div className="space-y-4">
      <SubNav items={staffSubNav} />
      <ListToolbar
        activeFilterCount={role !== "all" ? 1 : 0}
        onClearFilters={() => setRole("all")}
        filters={
          <Dropdown
            label="Role"
            options={[
              { value: "all", label: "All Roles" },
              ...[
                "Partner",
                "Advocate",
                "Associate",
                "Junior Associate",
                "Paralegal",
                "Clerk",
                "Admin",
              ].map((r) => ({
                value: r,
                label: r,
              })),
            ]}
            value={role}
            onChange={setRole}
          />
        }
      />
      <Table compact>
          <TableHeader>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Bar Council #</TableHead>
            <TableHead>Active Cases</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Status</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id} onClick={() => router.push(`/staff/${s.id}`)}>
                <TableCell className="font-semibold">{s.name}</TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell className="text-text-muted">{s.barCouncilNo ?? "—"}</TableCell>
                <TableCell>{s.activeCases}</TableCell>
                <TableCell className="text-green">{s.attendancePercent}%</TableCell>
                <TableCell>
                  <Badge variant={s.status === "Active" ? "green" : s.status === "On Leave" ? "amber" : "muted"}>
                    {s.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
