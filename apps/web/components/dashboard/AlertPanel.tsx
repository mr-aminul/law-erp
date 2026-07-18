"use client";

import { Dropdown } from "@/components/ui/Dropdown";
import { PageSection } from "@/components/ui/PageSection";
import { dashboardAlerts } from "@/lib/mock/data";
import { useAppStore } from "@/lib/store/appStore";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, Loader } from "lucide-react";

const alertFilterOptions = [
  { value: "Today", label: "Today" },
  { value: "This Week", label: "This Week" },
  { value: "This Month", label: "This Month" },
];

const alertCards = [
  {
    key: "overdue",
    label: "Cases Over Due",
    value: dashboardAlerts.overdue,
    icon: AlertTriangle,
    bg: "bg-red-light",
    text: "text-red",
    iconColor: "text-red",
  },
  {
    key: "due7",
    label: "Due Within 7 Days",
    value: dashboardAlerts.dueWithin7Days,
    icon: Clock,
    bg: "bg-amber-light",
    text: "text-amber",
    iconColor: "text-amber",
  },
  {
    key: "inProcess",
    label: "Cases In Process",
    value: dashboardAlerts.inProcess,
    icon: Loader,
    bg: "bg-green-light",
    text: "text-green",
    iconColor: "text-green",
  },
] as const;

export function AlertPanel() {
  const { alertFilter, setAlertFilter } = useAppStore();

  return (
    <PageSection
      title="Alerts"
      action={
        <Dropdown
          options={alertFilterOptions}
          value={alertFilter}
          onChange={(v) =>
            setAlertFilter(v as "Today" | "This Week" | "This Month")
          }
        />
      }
    >
      <div className="flex flex-col gap-3">
        <div className="rounded-card bg-cream-card px-3 py-3">
          <p className="text-xs font-semibold text-text-sec">Clients</p>
          <div className="mt-2 flex gap-4">
            <div>
              <p className="text-lg font-bold text-green">
                {dashboardAlerts.activeClients}
              </p>
              <p className="text-xs text-text-muted">Active</p>
            </div>
            <div>
              <p className="text-lg font-bold text-text-muted">
                {dashboardAlerts.inactiveClients}
              </p>
              <p className="text-xs text-text-muted">Inactive</p>
            </div>
          </div>
        </div>

        {alertCards.map(
          ({ key, label, value, icon: Icon, bg, text, iconColor }) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-card border border-gray-200 px-3 py-2.5"
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-badge",
                  bg
                )}
              >
                <Icon className={cn("size-5", iconColor)} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-text-sec">{label}</p>
                <p className={cn("text-xl font-bold", text)}>{value}</p>
              </div>
            </div>
          )
        )}
      </div>
    </PageSection>
  );
}
