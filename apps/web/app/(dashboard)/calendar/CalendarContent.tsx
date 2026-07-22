"use client";

import { NewHearingForm } from "@/components/calendar/NewHearingForm";
import {
  CalendarBoard,
  monthLabel,
  parseISODate,
  shiftCalendarCursor,
  weekLabel,
} from "@/components/calendar/CalendarBoard";
import { EventFlyout } from "@/components/calendar/EventFlyout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, PageSection } from "@/components/ui/PageSection";
import { Tabs } from "@/components/ui/Tabs";
import {
  type CreateHearingInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { formatDate } from "@/lib/utils/formatDate";
import type { Hearing } from "@/types/hearing";
import { AlertTriangle, Calendar, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const typeColors: Record<string, "green" | "amber" | "blue"> = {
  "Court Hearing": "green",
  "Filing Deadline": "amber",
  "Internal Meeting": "blue",
};

// ponytail: pinned to mock hearing month so demo data is visible
const TODAY = "2026-06-03";

export default function CalendarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"list" | "week" | "month">("month");
  const [cursor, setCursor] = useState(() => new Date(2026, 5, 3));
  const [newHearingOpen, setNewHearingOpen] = useState(false);
  const caseFilter = searchParams.get("case");
  const storeHearings = useDomainStore((s) => s.hearings);
  const createHearing = useDomainStore((s) => s.createHearing);

  const hearings = useMemo(() => {
    if (!caseFilter) return storeHearings;
    return storeHearings.filter((h) => h.caseId === caseFilter);
  }, [caseFilter, storeHearings]);

  const openCase = (h: Hearing) => router.push(`/cases/${h.caseId}`);

  const todayHearings = hearings.filter((h) => h.date === TODAY);
  const upcoming = hearings.filter((h) => h.date >= TODAY).slice(0, 7);

  function shift(delta: number) {
    setCursor((prev) => shiftCalendarCursor(prev, view === "week" ? "week" : "month", delta));
  }

  function handleCreateHearing(input: CreateHearingInput) {
    createHearing(input);
    setNewHearingOpen(false);
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        collapseFiltersOnMobile={false}
        filters={
          <div className="flex flex-wrap items-center gap-3">
            <Tabs
              tabs={[
                { id: "month", label: "Month" },
                { id: "week", label: "Week" },
                { id: "list", label: "Agenda" },
              ]}
              activeTab={view}
              onChange={(id) => setView(id as "list" | "week" | "month")}
            />
            {view !== "list" ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setCursor(parseISODate(TODAY))}>
                  Today
                </Button>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" aria-label="Previous" onClick={() => shift(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Next" onClick={() => shift(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-sm font-semibold text-text-primary">
                  {view === "month" ? monthLabel(cursor) : weekLabel(cursor)}
                </h2>
              </div>
            ) : null}
          </div>
        }
        actions={
          <Button onClick={() => setNewHearingOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Hearing
          </Button>
        }
      />

      {view === "list" ? (
        <div className="grid-split">
          <div className="min-w-0 space-y-4">
            <PageSection title="Today's Hearings" description={`${todayHearings.length} scheduled for ${formatDate(TODAY)}`}>
              {todayHearings.length === 0 ? (
                <EmptyState title="No hearings today" />
              ) : (
                <div className="space-y-2">
                  {todayHearings.map((h) => (
                    <HearingCard key={h.id} hearing={h} onClick={() => openCase(h)} />
                  ))}
                </div>
              )}
            </PageSection>

            <PageSection title="All Scheduled Events">
              {hearings.length === 0 ? (
                <EmptyState title="No scheduled events" description="Hearings, deadlines, and meetings will appear here." />
              ) : (
                <div className="space-y-2">
                  {hearings.map((h) => (
                    <HearingCard key={h.id} hearing={h} onClick={() => openCase(h)} />
                  ))}
                </div>
              )}
            </PageSection>
          </div>

          <div className="min-w-0 space-y-4">
            <PageSection title="Upcoming — 7 Days">
              {upcoming.length === 0 ? (
                <EmptyState title="Nothing scheduled in the next 7 days" />
              ) : (
                <div className="space-y-2">
                  {upcoming.map((h) => (
                    <EventFlyout key={h.id} hearing={h} onOpenCase={openCase}>
                      <button
                        type="button"
                        onClick={() => openCase(h)}
                        className="w-full rounded-card border border-gray-200 px-3 py-2 text-left text-sm transition-colors hover:bg-cream-card"
                      >
                        <p className="font-semibold">{formatDate(h.date)} · {h.time}</p>
                        <p className="truncate text-xs text-text-sec">{h.caseName}</p>
                      </button>
                    </EventFlyout>
                  ))}
                </div>
              )}
            </PageSection>

            <PageSection title="Limitation Tracker">
              <div className="flex items-start gap-2 rounded-card bg-amber-light/50 p-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber" />
                <div>
                  <p className="text-sm font-semibold text-amber">2 deadlines this month</p>
                  <p className="mt-0.5 text-xs text-text-sec">Labour tribunal filing — 20 Jun</p>
                </div>
              </div>
            </PageSection>

            <PageSection title="Reminders">
              <p className="text-xs text-text-muted">SMS + email cause list reminders enabled for all court hearings.</p>
              <Link href="/communications" className="mt-2 inline-block text-xs font-semibold text-green hover:underline">
                View sent reminders →
              </Link>
            </PageSection>
          </div>
        </div>
      ) : (
        <CalendarBoard
          hearings={hearings}
          view={view}
          cursor={cursor}
          today={TODAY}
          onCursorChange={setCursor}
          onDaySelect={(d) => {
            setCursor(d);
            setView("week");
          }}
          onEventClick={openCase}
        />
      )}

      <Modal
        open={newHearingOpen}
        onClose={() => setNewHearingOpen(false)}
        title="Add Hearing"
        className="max-w-xl"
      >
        <NewHearingForm
          defaultCaseId={caseFilter ?? undefined}
          onSubmit={handleCreateHearing}
          onCancel={() => setNewHearingOpen(false)}
        />
      </Modal>
    </div>
  );
}

function HearingCard({
  hearing,
  onClick,
}: {
  hearing: Hearing;
  onClick: () => void;
}) {
  return (
    <EventFlyout hearing={hearing} onOpenCase={() => onClick()}>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-start gap-3 rounded-card border border-gray-200 bg-surface p-3 text-left transition-colors hover:bg-cream-card"
      >
        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-input bg-green-light text-green">
          <Calendar className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{hearing.caseName}</span>
            <Badge variant={typeColors[hearing.type] ?? "muted"}>{hearing.type}</Badge>
            {hearing.adjourned && <Badge variant="amber">Adjourned</Badge>}
          </div>
          <p className="mt-0.5 text-xs text-text-sec">{hearing.courtName}</p>
          <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(hearing.date)} · {hearing.time}
            </span>
            {hearing.judge && <span>Judge: {hearing.judge}</span>}
          </div>
          {hearing.adjournmentReason && (
            <p className="mt-1 text-xs text-amber">Reason: {hearing.adjournmentReason}</p>
          )}
        </div>
      </button>
    </EventFlyout>
  );
}
