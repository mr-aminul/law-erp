"use client";

import { Badge } from "@/components/ui/Badge";
import { DetailField, PageSection } from "@/components/ui/PageSection";
import { Tabs } from "@/components/ui/Tabs";
import { getStaffById, mockCases } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

export default function StaffProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const staff = getStaffById(params.id);
  const [tab, setTab] = useState("profile");

  if (!staff) notFound();

  const assignedCases = mockCases.filter((c) =>
    c.assignedLawyers.some((l) => l.includes(staff.name.replace("Adv. ", "")) || l === staff.name)
  );
  const workloadPct = staff.capacity
    ? Math.round((staff.activeCases / staff.capacity) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-gray-200 bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sidebar text-lg font-bold text-white">
            {staff.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold">{staff.name}</h2>
            <p className="truncate text-sm text-text-sec">{staff.role} · {staff.email}</p>
          </div>
          <Badge variant={staff.status === "Active" ? "green" : "amber"} className="sm:ml-auto">
            {staff.status}
          </Badge>
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
            <DetailField label="Bar Council No." value={staff.barCouncilNo ?? "—"} />
            <DetailField label="Join Date" value={staff.joinDate ? formatDate(staff.joinDate) : "—"} />
            <DetailField label="Phone" value={staff.phone ?? "—"} />
            <DetailField label="Salary (BDT)" value={staff.salary ? formatCurrency(staff.salary) : "—"} />
            <DetailField label="CLE Hours" value={staff.cleHours ?? "—"} />
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
