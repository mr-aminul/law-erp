"use client";

import { NewEmployeeForm, STAFF_DEPARTMENTS, STAFF_DESIGNATIONS } from "@/components/employees/NewEmployeeForm";
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
import { UserAvatar } from "@/components/ui/UserChip";
import { mockStaff } from "@/lib/mock";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

const designationOptions = STAFF_DESIGNATIONS.map((r) => ({
  value: r,
  label: r,
}));

const departmentOptions = STAFF_DEPARTMENTS.map((d) => ({
  value: d,
  label: d,
}));

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "On Leave", label: "On Leave" },
  { value: "Inactive", label: "Inactive" },
];

function EmployeesDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [designationFilters, setDesignationFilters] = useState<string[]>([]);
  const [departmentFilters, setDepartmentFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [newEmployeeOpen, setNewEmployeeOpen] = useState(false);

  useEffect(() => {
    setNewEmployeeOpen(searchParams.get("new") === "1");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return mockStaff.filter((s) => {
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.employeeId?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q);
      const matchDesignation =
        designationFilters.length === 0 || designationFilters.includes(s.role);
      const matchDepartment =
        departmentFilters.length === 0 ||
        (s.department != null && departmentFilters.includes(s.department));
      const matchStatus =
        statusFilters.length === 0 || statusFilters.includes(s.status);
      return matchSearch && matchDesignation && matchDepartment && matchStatus;
    });
  }, [search, designationFilters, departmentFilters, statusFilters]);

  function openNewEmployeeModal() {
    setNewEmployeeOpen(true);
    if (searchParams.get("new") !== "1") {
      router.replace("/employees?new=1", { scroll: false });
    }
  }

  function closeNewEmployeeModal() {
    setNewEmployeeOpen(false);
    if (searchParams.get("new")) {
      router.replace("/employees");
    }
  }

  function handleCreateEmployee() {
    closeNewEmployeeModal();
    router.push("/employees/1");
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={
          designationFilters.length +
          departmentFilters.length +
          statusFilters.length
        }
        onClearFilters={() => {
          setDesignationFilters([]);
          setDepartmentFilters([]);
          setStatusFilters([]);
        }}
        filters={
          <>
            <MultiSelectDropdown
              label="Designation"
              options={designationOptions}
              value={designationFilters}
              placeholder="All Designations"
              onChange={setDesignationFilters}
            />
            <MultiSelectDropdown
              label="Department"
              options={departmentOptions}
              value={departmentFilters}
              placeholder="All Departments"
              onChange={setDepartmentFilters}
            />
            <MultiSelectDropdown
              label="Status"
              options={statusOptions}
              value={statusFilters}
              placeholder="All Statuses"
              onChange={setStatusFilters}
            />
          </>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search name, ID, email…",
        }}
        actions={
          <Button type="button" onClick={openNewEmployeeModal}>
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        }
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="Try clearing filters or add a new employee to the directory."
          action={
            <Button type="button" onClick={openNewEmployeeModal}>
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          }
        />
      ) : (
        <Table compact>
          <TableHeader>
            <TableHead>Employee ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Employee Type</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Line Manager</TableHead>
            <TableHead>Bar Council #</TableHead>
            <TableHead>Status</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id} onClick={() => router.push(`/employees/${s.id}`)}>
                <TableCell className="tabular-nums">
                  {s.employeeId ?? "—"}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2.5">
                    <UserAvatar initials={s.initials} size="sm" />
                    <span className="font-semibold">{s.name}</span>
                  </span>
                </TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell>{s.employeeType}</TableCell>
                <TableCell>{s.department ?? "—"}</TableCell>
                <TableCell className="text-text-sec">
                  {s.lineManager ?? "—"}
                </TableCell>
                <TableCell className="text-text-muted">
                  {s.barCouncilNo ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      s.status === "Active"
                        ? "green"
                        : s.status === "On Leave"
                          ? "amber"
                          : "muted"
                    }
                  >
                    {s.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        open={newEmployeeOpen}
        onClose={closeNewEmployeeModal}
        title="Add Employee"
        className="max-w-2xl"
      >
        <NewEmployeeForm
          onSubmit={handleCreateEmployee}
          onCancel={closeNewEmployeeModal}
        />
      </Modal>
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={null}>
      <EmployeesDirectoryContent />
    </Suspense>
  );
}
