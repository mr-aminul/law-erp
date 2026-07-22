"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
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
        <Table>
          <TableHeader>
            <TableHead>Employee</TableHead>
            <TableHead>Status</TableHead>
          </TableHeader>
          <TableBody>
            {mockStaff.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <span className="flex items-center gap-2.5 font-semibold">
                    <UserAvatar initials={s.initials} size="sm" />
                    {s.name}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((status) => (
                      <Button
                        key={status}
                        type="button"
                        variant={marks[s.id] === status ? "default" : "outline"}
                        onClick={() => setStatus(s.id, status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
