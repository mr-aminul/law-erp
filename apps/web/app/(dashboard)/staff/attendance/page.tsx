"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { staffSubNav } from "@/lib/config/navigation";
import { mockAttendance, mockStaff } from "@/lib/mock";
import { useState } from "react";

export default function AttendancePage() {
  const [date, setDate] = useState("2026-06-03");

  return (
    <div className="space-y-4">
      <SubNav items={staffSubNav} />
      <ListToolbar
        filters={
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-sec">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-44"
            />
          </div>
        }
        actions={<Button>Save Attendance</Button>}
      />

      <PageSection title="Daily Attendance" description="Mark present / absent per staff member.">
        <div className="space-y-2">
          {mockStaff.map((s) => {
            const record = mockAttendance.find((a) => a.staffId === s.id && a.date === date);
            return (
              <div key={s.id} className="flex items-center justify-between rounded-card border border-gray-200 px-3 py-2">
                <span className="text-sm font-semibold">{s.name}</span>
                <div className="flex gap-2">
                  {(["Present", "Absent", "Late", "Leave"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`rounded-badge px-2.5 py-1 text-xs font-semibold ${
                        record?.status === status
                          ? "bg-active-nav text-white"
                          : "bg-cream-card text-text-sec hover:bg-gray-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PageSection>
    </div>
  );
}
