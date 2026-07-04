"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageSection } from "@/components/ui/PageSection";
import { Tabs } from "@/components/ui/Tabs";
import { mockHearings } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { AlertTriangle, Calendar, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const typeColors: Record<string, "green" | "amber" | "blue"> = {
  "Court Hearing": "green",
  "Filing Deadline": "amber",
  "Internal Meeting": "blue",
};

export default function CalendarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState("list");
  const caseFilter = searchParams.get("case");

  const hearings = useMemo(() => {
    if (!caseFilter) return mockHearings;
    return mockHearings.filter((h) => h.caseId === caseFilter);
  }, [caseFilter]);

  const today = "2026-06-03";
  const todayHearings = hearings.filter((h) => h.date === today);
  const upcoming = hearings.filter((h) => h.date >= today).slice(0, 7);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs
          tabs={[
            { id: "list", label: "List View" },
            { id: "week", label: "Week View" },
            { id: "month", label: "Month View" },
          ]}
          activeTab={view}
          onChange={setView}
        />
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Hearing
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-4">
        <div className="space-y-4">
          <PageSection title="Today's Hearings" description={`${todayHearings.length} scheduled for ${formatDate(today)}`}>
            {todayHearings.length === 0 ? (
              <p className="text-sm text-text-muted">No hearings today.</p>
            ) : (
              <div className="space-y-2">
                {todayHearings.map((h) => (
                  <HearingCard key={h.id} hearing={h} onClick={() => router.push(`/cases/${h.caseId}`)} />
                ))}
              </div>
            )}
          </PageSection>

          <PageSection title="All Scheduled Events">
            <div className="space-y-2">
              {hearings.map((h) => (
                <HearingCard key={h.id} hearing={h} onClick={() => router.push(`/cases/${h.caseId}`)} />
              ))}
            </div>
          </PageSection>
        </div>

        <div className="space-y-4">
          <PageSection title="Upcoming — 7 Days">
            <div className="space-y-2">
              {upcoming.map((h) => (
                <div key={h.id} className="rounded-card border border-divider/60 px-3 py-2 text-sm">
                  <p className="font-semibold">{formatDate(h.date)} · {h.time}</p>
                  <p className="truncate text-xs text-text-sec">{h.caseName}</p>
                </div>
              ))}
            </div>
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
    </div>
  );
}

function HearingCard({
  hearing,
  onClick,
}: {
  hearing: (typeof mockHearings)[0];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-card border border-divider/60 bg-white p-3 text-left transition-colors hover:bg-cream-card"
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
  );
}
