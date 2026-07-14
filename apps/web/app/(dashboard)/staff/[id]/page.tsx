"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipStatusSelect } from "@/components/ui/ChipStatusSelect";
import { DetailField, PageSection } from "@/components/ui/PageSection";
import { Tabs } from "@/components/ui/Tabs";
import { getStaffById, mockCases, mockStaff } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate, toDateInputValue } from "@/lib/utils/formatDate";
import { emailError, phoneError } from "@/lib/utils/validateContact";
import { STAFF_EMPLOYEE_TYPES } from "@/components/staff/NewEmployeeForm";
import type { EmployeeType, StaffStatus } from "@/types/staff";
import { Pencil } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

const STAFF_STATUS_OPTIONS = [
  { value: "Active" as const, label: "Active", variant: "green" as const },
  { value: "On Leave" as const, label: "On Leave", variant: "amber" as const },
  { value: "Inactive" as const, label: "Inactive", variant: "muted" as const },
];

export default function StaffProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const staff = getStaffById(params.id);
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [contactErrors, setContactErrors] = useState<{
    email: string | null;
    phone: string | null;
  }>({ email: null, phone: null });
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    status: "" as StaffStatus | "",
    employeeId: "",
    designation: "",
    employeeType: "" as EmployeeType | "",
    department: "",
    lineManager: "",
    barCouncilNo: "",
    joinDate: "",
    phone: "",
    salary: "",
    cleHours: "",
  });

  if (!staff) notFound();

  const assignedCases = mockCases.filter((c) =>
    c.assignedLawyers.some((l) => l.includes(staff.name.replace("Adv. ", "")) || l === staff.name)
  );
  const workloadPct = staff.capacity
    ? Math.round((staff.activeCases / staff.capacity) * 100)
    : 0;
  const displayStatus = (draft.status || staff.status) as StaffStatus;
  const displayJoinDate = draft.joinDate || staff.joinDate;
  const displayDesignation = draft.designation || staff.role;
  const displayEmployeeType = draft.employeeType || staff.employeeType;

  function startEditing() {
    setDraft({
      name: staff!.name,
      email: staff!.email ?? "",
      status: staff!.status,
      employeeId: staff!.employeeId ?? "",
      designation: staff!.role,
      employeeType: staff!.employeeType,
      department: staff!.department ?? "",
      lineManager: staff!.lineManager ?? "",
      barCouncilNo: staff!.barCouncilNo ?? "",
      joinDate: toDateInputValue(staff!.joinDate),
      phone: staff!.phone ?? "",
      salary: staff!.salary != null ? String(staff!.salary) : "",
      cleHours: staff!.cleHours != null ? String(staff!.cleHours) : "",
    });
    setContactErrors({ email: null, phone: null });
    setEditing(true);
  }

  function finishEditing() {
    const next = {
      email: emailError(draft.email),
      phone: phoneError(draft.phone),
    };
    setContactErrors(next);
    if (next.email || next.phone) return;
    setEditing(false);
  }

  function patchDraft(key: keyof typeof draft, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (key === "email") {
      setContactErrors((prev) => ({ ...prev, email: emailError(value) }));
    }
    if (key === "phone") {
      setContactErrors((prev) => ({ ...prev, phone: phoneError(value) }));
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-gray-200 bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sidebar text-lg font-bold text-on-sidebar">
            {staff.initials}
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <input
                type="text"
                value={draft.name}
                onChange={(e) => patchDraft("name", e.target.value)}
                className="w-full border-0 border-b border-gray-300 bg-transparent py-0.5 text-lg font-bold text-text-primary outline-none focus:border-text-primary"
              />
            ) : (
              <h2 className="text-lg font-bold">{draft.name || staff.name}</h2>
            )}
            {editing ? (
              <>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => patchDraft("email", e.target.value)}
                  aria-invalid={Boolean(contactErrors.email) || undefined}
                  className={`mt-0.5 w-full truncate border-0 border-b bg-transparent py-0.5 text-sm text-text-sec outline-none focus:border-text-primary ${
                    contactErrors.email
                      ? "border-red focus:border-red"
                      : "border-gray-300"
                  }`}
                />
                {contactErrors.email ? (
                  <p className="mt-1 text-xs text-red">{contactErrors.email}</p>
                ) : null}
              </>
            ) : (
              <p className="truncate text-sm text-text-sec">
                {displayDesignation} · {draft.email || staff.email}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:ml-auto">
            {editing ? (
              <ChipStatusSelect
                value={displayStatus}
                onChange={(v) => patchDraft("status", v)}
                options={STAFF_STATUS_OPTIONS}
              />
            ) : (
              <Badge
                variant={
                  displayStatus === "Active"
                    ? "green"
                    : displayStatus === "On Leave"
                      ? "amber"
                      : "muted"
                }
              >
                {displayStatus}
              </Badge>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => (editing ? finishEditing() : startEditing())}
            >
              {editing ? (
                "Done"
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "profile", label: "Profile" },
          { id: "cases", label: "Assigned Cases" },
          { id: "workload", label: "Workload" },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === "profile" && (
        <PageSection title="Employee Profile">
          <div className="grid-fields-3">
            <DetailField
              label="Employee ID"
              value={draft.employeeId || staff.employeeId || "—"}
              editing={editing}
              editValue={draft.employeeId}
              onChange={(v) => patchDraft("employeeId", v)}
            />
            <DetailField
              label="Designation"
              value={displayDesignation}
              editing={editing}
              editValue={draft.designation}
              onChange={(v) => patchDraft("designation", v)}
              options={[
                "Partner",
                "Advocate",
                "Associate",
                "Junior Associate",
                "Paralegal",
                "Clerk",
                "Admin",
              ].map((r) => ({ value: r, label: r }))}
            />
            <DetailField
              label="Employee Type"
              value={displayEmployeeType}
              editing={editing}
              editValue={draft.employeeType}
              onChange={(v) => patchDraft("employeeType", v)}
              options={STAFF_EMPLOYEE_TYPES.map((t) => ({ value: t, label: t }))}
            />
            <DetailField
              label="Department"
              value={draft.department || staff.department || "—"}
              editing={editing}
              editValue={draft.department}
              onChange={(v) => patchDraft("department", v)}
            />
            <DetailField
              label="Line Manager"
              value={draft.lineManager || staff.lineManager || "—"}
              editing={editing}
              editValue={draft.lineManager}
              onChange={(v) => patchDraft("lineManager", v)}
              options={[
                { value: "", label: "None" },
                ...mockStaff
                  .filter((s) => s.id !== staff.id)
                  .map((s) => ({ value: s.name, label: s.name })),
              ]}
            />
            <DetailField
              label="Bar Council No."
              value={draft.barCouncilNo || staff.barCouncilNo || "—"}
              editing={editing}
              editValue={draft.barCouncilNo}
              onChange={(v) => patchDraft("barCouncilNo", v)}
            />
            <DetailField
              label="Join Date"
              value={displayJoinDate ? formatDate(displayJoinDate) : "—"}
              editing={editing}
              editValue={draft.joinDate}
              onChange={(v) => patchDraft("joinDate", v)}
              inputType="date"
            />
            <DetailField
              label="Phone"
              value={draft.phone || staff.phone || "—"}
              editing={editing}
              editValue={draft.phone}
              onChange={(v) => patchDraft("phone", v)}
              inputType="tel"
              error={editing ? contactErrors.phone : null}
            />
            <DetailField
              label="Salary (BDT)"
              value={
                draft.salary
                  ? formatCurrency(Number(draft.salary) || 0)
                  : staff.salary
                    ? formatCurrency(staff.salary)
                    : "—"
              }
              editing={editing}
              editValue={draft.salary}
              onChange={(v) => patchDraft("salary", v)}
              inputType="number"
            />
            <DetailField
              label="CLE Hours"
              value={draft.cleHours || (staff.cleHours ?? "—")}
              editing={editing}
              editValue={draft.cleHours}
              onChange={(v) => patchDraft("cleHours", v)}
              inputType="number"
            />
            <DetailField label="Attendance" value={`${staff.attendancePercent}%`} />
          </div>
        </PageSection>
      )}

      {tab === "cases" && (
        <PageSection title="Assigned Cases">
          <div className="space-y-2">
            {assignedCases.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => router.push(`/cases/${c.id}`)}
                className="flex w-full justify-between rounded-card border border-gray-200 px-3 py-2 text-left hover:bg-cream-card"
              >
                <span className="text-sm font-semibold">{c.caseId} — {c.matter}</span>
                <Badge variant="blue">{c.status}</Badge>
              </button>
            ))}
          </div>
        </PageSection>
      )}

      {tab === "workload" && (
        <PageSection title="Capacity vs. Active Cases">
          <div className="mb-2 flex justify-between text-sm">
            <span>{staff.activeCases} active cases</span>
            <span className="text-text-muted">Capacity: {staff.capacity ?? "—"}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-cream-card">
            <div
              className={`h-full rounded-full ${workloadPct > 90 ? "bg-red" : workloadPct > 70 ? "bg-amber" : "bg-green"}`}
              style={{ width: `${Math.min(workloadPct, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-text-muted">{workloadPct}% utilization</p>
        </PageSection>
      )}
    </div>
  );
}
