"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { UserAvatar } from "@/components/ui/UserChip";
import { mockAttendance, mockStaff } from "@/lib/mock";
import type { AttendanceRecord } from "@/types/staff";
import { useMemo, useState } from "react";

type DayStatus = AttendanceRecord["status"];

const STATUSES: DayStatus[] = ["Present", "Absent", "Late", "Leave"];

function buildMarksForDate(date: string): Record<string, DayStatus | ""> {
  const marks: Record<string, DayStatus | ""> = {};
  for (const s of mockStaff) {
    const record = mockAttendance.find(
      (a) => a.staffId === s.id && a.date === date
    );
    marks[s.id] = record?.status ?? "";
  }
  return marks;
}

export default function AttendancePage() {
  const [date, setDate] = useState("2026-06-03");
  const [marks, setMarks] = useState<Record<string, DayStatus | "">>(() =>
    buildMarksForDate("2026-06-03")
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const markedCount = useMemo(
    () => Object.values(marks).filter(Boolean).length,
    [marks]
  );

  function handleDateChange(next: string) {
    setDate(next);
    setMarks(buildMarksForDate(next));
    setDirty(false);
    setSavedAt(null);
  }

  function setStatus(staffId: string, status: DayStatus) {
    setMarks((prev) => ({
      ...prev,
      [staffId]: prev[staffId] === status ? "" : status,
    }));
    setDirty(true);
    setSavedAt(null);
  }

  function handleSave() {
    setDirty(false);
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        filters={
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-sec">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-44"
            />
          </div>
        }
        actions={
          <Button type="button" onClick={handleSave} disabled={!dirty}>
            Save Attendance
          </Button>
        }
      />

      <PageSection
        title="Daily Attendance"
        description={
          savedAt
            ? `Saved at ${savedAt} · ${markedCount} of ${mockStaff.length} marked`
            : `Mark present / absent per employee · ${markedCount} of ${mockStaff.length} marked`
        }
      >
        <div className="space-y-2">
          {mockStaff.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-card border border-gray-200 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold">
                <UserAvatar initials={s.initials} size="sm" />
                {s.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus(s.id, status)}
                    className={`rounded-badge px-2.5 py-1 text-xs font-semibold ${
                      marks[s.id] === status
                        ? "bg-active-nav text-on-active-nav"
                        : "bg-cream-card text-text-sec hover:bg-gray-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
