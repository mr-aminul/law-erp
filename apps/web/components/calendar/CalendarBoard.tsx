"use client";

import { EventFlyout } from "@/components/calendar/EventFlyout";
import { cn } from "@/lib/utils/cn";
import type { Hearing } from "@/types/hearing";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_START = 8;
const HOUR_END = 18;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

const eventTone: Record<string, string> = {
  "Court Hearing": "bg-green text-on-green",
  "Filing Deadline": "bg-amber text-white",
  "Internal Meeting": "bg-blue text-white",
};

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfWeek(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7; // Mon=0
  date.setDate(date.getDate() - day);
  return date;
}

function monthCells(cursor: Date): Date[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => {
    const cell = new Date(start);
    cell.setDate(start.getDate() + i);
    return cell;
  });
}

function weekDays(cursor: Date): Date[] {
  const start = startOfWeek(cursor);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function parseHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + (m || 0) / 60;
}

export function monthLabel(cursor: Date): string {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(cursor);
}

export function weekLabel(cursor: Date): string {
  const days = weekDays(cursor);
  const a = days[0];
  const b = days[6];
  const sameMonth = a.getMonth() === b.getMonth();
  if (sameMonth) {
    return `${a.getDate()} – ${b.getDate()} ${monthLabel(a)}`;
  }
  const short = (d: Date) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
  return `${short(a)} – ${short(b)} ${b.getFullYear()}`;
}

type ViewMode = "week" | "month";

export function shiftCalendarCursor(cursor: Date, view: ViewMode, delta: number): Date {
  const next = new Date(cursor);
  if (view === "month") next.setMonth(next.getMonth() + delta);
  else next.setDate(next.getDate() + delta * 7);
  return next;
}

interface CalendarBoardProps {
  hearings: Hearing[];
  view: ViewMode;
  cursor: Date;
  today: string;
  onCursorChange: (next: Date) => void;
  onDaySelect?: (day: Date) => void;
  onEventClick: (hearing: Hearing) => void;
}

export function CalendarBoard({
  hearings,
  view,
  cursor,
  today,
  onCursorChange,
  onDaySelect,
  onEventClick,
}: CalendarBoardProps) {
  const byDate = new Map<string, Hearing[]>();
  for (const h of hearings) {
    const list = byDate.get(h.date) ?? [];
    list.push(h);
    byDate.set(h.date, list);
  }
  for (const list of Array.from(byDate.values())) {
    list.sort((a, b) => a.time.localeCompare(b.time));
  }

  return (
    <div className="overflow-hidden rounded-card border border-gray-200 bg-surface">
      {view === "month" ? (
        <MonthGrid
          cursor={cursor}
          today={today}
          byDate={byDate}
          onEventClick={onEventClick}
          onDayClick={(d) => (onDaySelect ?? onCursorChange)(d)}
        />
      ) : (
        <WeekGrid cursor={cursor} today={today} byDate={byDate} onEventClick={onEventClick} />
      )}
    </div>
  );
}

function MonthGrid({
  cursor,
  today,
  byDate,
  onEventClick,
  onDayClick,
}: {
  cursor: Date;
  today: string;
  byDate: Map<string, Hearing[]>;
  onEventClick: (h: Hearing) => void;
  onDayClick: (d: Date) => void;
}) {
  const cells = monthCells(cursor);
  const month = cursor.getMonth();

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-muted-bg/40">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-2 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-[minmax(6.5rem,1fr)]">
        {cells.map((day) => {
          const iso = toISODate(day);
          const events = byDate.get(iso) ?? [];
          const inMonth = day.getMonth() === month;
          const isToday = iso === today;
          const visible = events.slice(0, 3);
          const more = events.length - visible.length;

          return (
            <div
              key={iso}
              className={cn(
                "min-h-[6.5rem] border-b border-r border-gray-200 p-1 last:border-r-0",
                !inMonth && "bg-muted-bg/30"
              )}
            >
              <button
                type="button"
                onClick={() => onDayClick(day)}
                className={cn(
                  "mb-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday && "bg-green text-on-green",
                  !isToday && inMonth && "text-text-primary hover:bg-cream-card",
                  !isToday && !inMonth && "text-text-muted"
                )}
              >
                {day.getDate()}
              </button>
              <div className="space-y-0.5">
                {visible.map((h) => (
                  <EventFlyout key={h.id} hearing={h} onOpenCase={onEventClick}>
                    <button
                      type="button"
                      onClick={() => onEventClick(h)}
                      className={cn(
                        "block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium leading-tight",
                        eventTone[h.type] ?? "bg-gray-500 text-white"
                      )}
                    >
                      {h.time} {h.caseName}
                    </button>
                  </EventFlyout>
                ))}
                {more > 0 && (
                  <p className="px-1 text-[10px] font-medium text-text-muted">+{more} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({
  cursor,
  today,
  byDate,
  onEventClick,
}: {
  cursor: Date;
  today: string;
  byDate: Map<string, Hearing[]>;
  onEventClick: (h: Hearing) => void;
}) {
  const days = weekDays(cursor);
  const hourHeight = 48;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] border-b border-gray-200">
          <div />
          {days.map((d) => {
            const iso = toISODate(d);
            const isToday = iso === today;
            return (
              <div key={iso} className="border-l border-gray-200 px-1 py-2 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  {WEEKDAYS[(d.getDay() + 6) % 7]}
                </p>
                <p
                  className={cn(
                    "mx-auto mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    isToday ? "bg-green text-on-green" : "text-text-primary"
                  )}
                >
                  {d.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="relative grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]"
          style={{ height: HOURS.length * hourHeight }}
        >
          {HOURS.map((hour, i) => (
            <div
              key={hour}
              className="pointer-events-none absolute inset-x-0 border-t border-gray-100"
              style={{ top: i * hourHeight }}
            >
              <span className="absolute -top-2 left-1 text-[10px] text-text-muted">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}

          <div />
          {days.map((d) => {
            const iso = toISODate(d);
            const events = byDate.get(iso) ?? [];
            return (
              <div key={iso} className="relative border-l border-gray-200">
                {events.map((h) => {
                  const start = parseHour(h.time);
                  const top = (start - HOUR_START) * hourHeight;
                  const clampedTop = Math.max(0, Math.min(top, (HOURS.length - 1) * hourHeight));
                  return (
                    <EventFlyout
                      key={h.id}
                      hearing={h}
                      onOpenCase={onEventClick}
                      className="absolute left-0.5 right-0.5 z-[1]"
                      style={{ top: clampedTop + 2, height: hourHeight - 6 }}
                    >
                      <button
                        type="button"
                        onClick={() => onEventClick(h)}
                        className={cn(
                          "h-full w-full overflow-hidden rounded px-1.5 py-1 text-left shadow-sm",
                          eventTone[h.type] ?? "bg-gray-500 text-white"
                        )}
                      >
                        <p className="truncate text-[10px] font-semibold leading-tight">{h.time}</p>
                        <p className="truncate text-[10px] leading-tight opacity-95">{h.caseName}</p>
                      </button>
                    </EventFlyout>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
