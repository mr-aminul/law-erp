import type { AttendanceRecord, LeaveRequest } from "@/types/staff";

export type AttendanceMark = AttendanceRecord["status"] | "";

export function attendanceKey(staffId: string, date: string) {
  return `${staffId}:${date}`;
}

/** Inclusive ISO date range (YYYY-MM-DD). */
export function eachIsoDate(from: string, to: string): string[] {
  const start = from <= to ? from : to;
  const end = from <= to ? to : from;
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const cursor = new Date(sy, sm - 1, sd);
  const last = new Date(ey, em - 1, ed);
  const dates: string[] = [];
  while (cursor <= last) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

/** staffId:date keys covered by approved leave. */
export function approvedLeaveKeys(requests: LeaveRequest[]): Set<string> {
  const keys = new Set<string>();
  for (const lr of requests) {
    if (lr.status !== "Approved") continue;
    for (const date of eachIsoDate(lr.from, lr.to)) {
      keys.add(attendanceKey(lr.staffId, date));
    }
  }
  return keys;
}

export function effectiveAttendance(
  marks: Record<string, AttendanceMark>,
  leaveKeys: Set<string>,
  staffId: string,
  date: string
): AttendanceMark {
  const key = attendanceKey(staffId, date);
  if (leaveKeys.has(key)) return "Leave";
  return marks[key] ?? "";
}
