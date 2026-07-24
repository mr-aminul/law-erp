"use client";

import {
  monthLabel,
  parseISODate,
  shiftCalendarCursor,
  weekLabel,
} from "@/components/calendar/CalendarBoard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
import { Tabs } from "@/components/ui/Tabs";
import { UserAvatar } from "@/components/ui/UserChip";
import { mockStaff } from "@/lib/mock";
import { useStaffHrStore } from "@/lib/store/staffHrStore";
import type { AttendanceMark } from "@/lib/staff/attendanceLeave";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type DayStatus = Exclude<AttendanceMark, "">;
type ViewMode = "day" | "week" | "month";

const STATUSES: DayStatus[] = ["Present", "Absent", "Late", "Leave"];

const STATUS_BADGE: Record<
  DayStatus,
  { label: string; variant: "green" | "red" | "amber" | "blue" }
> = {
  Present: { label: "P", variant: "green" },
  Absent: { label: "A", variant: "red" },
  Late: { label: "L", variant: "amber" },
  Leave: { label: "Lv", variant: "blue" },
};

const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = "2026-06-03";

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
}

function weekDays(cursor: Date): Date[] {
  const start = startOfWeek(cursor);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function monthDays(cursor: Date): Date[] {
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) =>
    new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)
  );
}

function dayLabel(cursor: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(cursor);
}

function StatusDot({ status }: { status: AttendanceMark }) {
  if (!status) {
    return <span className="text-xs text-text-muted">—</span>;
  }
  const { label, variant } = STATUS_BADGE[status];
  return (
    <Badge variant={variant} className="min-w-7 justify-center px-1.5" title={status}>
      {label}
    </Badge>
  );
}

function StatusCell({
  status,
  employee,
  date,
  locked,
  onChange,
}: {
  status: AttendanceMark;
  employee: string;
  date: string;
  locked?: boolean;
  onChange: (next: AttendanceMark) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (locked) {
    return (
      <span
        className="inline-flex min-h-8 min-w-9 items-center justify-center"
        title="On approved leave"
        aria-label={`${employee} ${date}: Leave (approved)`}
      >
        <StatusDot status="Leave" />
      </span>
    );
  }

  return (
    <div ref={ref} className="relative inline-flex justify-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex min-h-8 min-w-9 items-center justify-center rounded-md hover:bg-cream-card",
          open && "bg-cream-card ring-1 ring-gray-200"
        )}
        aria-label={`${employee} ${date}${status ? `: ${status}` : " unmarked"}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <StatusDot status={status} />
      </button>
      {open ? (
        <div
          role="listbox"
          className="absolute left-1/2 top-full z-30 mt-1 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-gray-200 bg-surface p-1 shadow-md"
        >
          {STATUSES.map((s) => {
            const { label, variant } = STATUS_BADGE[s];
            const selected = status === s;
            return (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={selected}
                title={s}
                onClick={() => {
                  onChange(selected ? "" : s);
                  setOpen(false);
                }}
                className={cn(
                  "rounded-md p-0.5 hover:bg-cream-card",
                  selected && "ring-1 ring-primary"
                )}
              >
                <Badge variant={variant} className="min-w-7 justify-center px-1.5">
                  {label}
                </Badge>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function AttendanceBoard() {
  const [view, setView] = useState<ViewMode>("day");
  const [cursor, setCursor] = useState(() => parseISODate(TODAY));
  const getStatus = useStaffHrStore((s) => s.getStatus);
  const isOnApprovedLeave = useStaffHrStore((s) => s.isOnApprovedLeave);
  const setMark = useStaffHrStore((s) => s.setMark);
  const leaveRequests = useStaffHrStore((s) => s.leaveRequests);
  const marks = useStaffHrStore((s) => s.marks);

  const days = useMemo(() => {
    if (view === "day") return [new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())];
    if (view === "week") return weekDays(cursor);
    return monthDays(cursor);
  }, [cursor, view]);

  const rows = useMemo(() => {
    return mockStaff.map((s) => {
      const dayStatuses = days.map((d) => {
        const iso = toISODate(d);
        return {
          iso,
          status: getStatus(s.id, iso),
          locked: isOnApprovedLeave(s.id, iso),
        };
      });
      return {
        staff: s,
        dayStatuses,
        present: dayStatuses.filter((d) => d.status === "Present").length,
        absent: dayStatuses.filter((d) => d.status === "Absent").length,
        late: dayStatuses.filter((d) => d.status === "Late").length,
      };
    });
  }, [days, getStatus, isOnApprovedLeave, leaveRequests, marks]);

  function goToday() {
    setCursor(parseISODate(TODAY));
  }

  function shift(delta: number) {
    if (view === "day") {
      const next = new Date(cursor);
      next.setDate(next.getDate() + delta);
      setCursor(next);
      return;
    }
    setCursor(shiftCalendarCursor(cursor, view, delta));
  }

  const title =
    view === "day" ? "Daily Attendance" : view === "week" ? "Weekly Attendance" : "Monthly Attendance";

  return (
    <div className="space-y-4">
      <ListToolbar
        collapseFiltersOnMobile={false}
        filters={
          <div className="flex flex-wrap items-center gap-3">
            <Tabs
              tabs={[
                { id: "day", label: "Day" },
                { id: "week", label: "Week" },
                { id: "month", label: "Month" },
              ]}
              activeTab={view}
              onChange={(id) => setView(id as ViewMode)}
            />
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={goToday}>
                Today
              </Button>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Previous"
                  onClick={() => shift(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Next"
                  onClick={() => shift(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-sm font-semibold text-text-primary">
                {view === "month"
                  ? monthLabel(cursor)
                  : view === "week"
                    ? weekLabel(cursor)
                    : dayLabel(cursor)}
              </h2>
            </div>
          </div>
        }
      />

      <PageSection title={title}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableHead className="sticky left-0 z-10 bg-primary">Employee</TableHead>
              {view === "month" ? (
                <>
                  <TableHead className="px-2 text-center">
                    <span title="Present">P</span>
                  </TableHead>
                  <TableHead className="px-2 text-center">
                    <span title="Absent">A</span>
                  </TableHead>
                  <TableHead className="px-2 text-center">
                    <span title="Late">L</span>
                  </TableHead>
                </>
              ) : null}
              {view === "day" ? (
                <TableHead>Status</TableHead>
              ) : (
                days.map((d) => {
                  const iso = toISODate(d);
                  const isWeekend = d.getDay() === 5 || d.getDay() === 6; // Fri–Sat
                  const isToday = iso === TODAY;
                  return (
                    <TableHead key={iso} className="px-1 text-center">
                      <div
                        className={cn(
                          "mx-auto flex min-w-9 flex-col items-center rounded-md px-1 py-0.5 text-primary-foreground",
                          isToday && "bg-white/20",
                          isWeekend && "opacity-60"
                        )}
                      >
                        <span className="text-[10px] font-medium uppercase tracking-wide">
                          {WEEKDAY_SHORT[(d.getDay() + 6) % 7]}
                        </span>
                        <span className="text-xs font-semibold tabular-nums">
                          {d.getDate()}
                        </span>
                      </div>
                    </TableHead>
                  );
                })
              )}
            </TableHeader>
            <TableBody>
              {rows.map(({ staff: s, dayStatuses, present, absent, late }) => (
                  <TableRow key={s.id}>
                    <TableCell className="sticky left-0 z-10 bg-surface">
                      <span className="flex items-center gap-2.5 font-semibold">
                        <UserAvatar initials={s.initials} size="sm" />
                        <span className="whitespace-nowrap">{s.name}</span>
                      </span>
                    </TableCell>
                    {view === "month" ? (
                      <>
                        <TableCell className="px-2 text-center font-semibold tabular-nums text-status-completed">
                          {present}
                        </TableCell>
                        <TableCell className="px-2 text-center font-semibold tabular-nums text-red">
                          {absent}
                        </TableCell>
                        <TableCell className="px-2 text-center font-semibold tabular-nums text-status-pending">
                          {late}
                        </TableCell>
                      </>
                    ) : null}
                    {dayStatuses.map(({ iso, status, locked }) => (
                      <TableCell key={iso} className="px-1 text-center">
                        <StatusCell
                          status={status}
                          employee={s.name}
                          date={iso}
                          locked={locked}
                          onChange={(next) => setMark(s.id, iso, next)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}
