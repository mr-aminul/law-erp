"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Dropdown } from "@/components/ui/Dropdown";
import { dashboardAlerts } from "@/lib/mock/data";
import { useAppStore } from "@/lib/store/appStore";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary">Alerts</h3>
        <Dropdown
          options={alertFilterOptions}
          value={alertFilter}
          onChange={(v) =>
            setAlertFilter(v as "Today" | "This Week" | "This Month")
          }
        />
      </div>

      <Card size="sm" className="bg-cream-card">
        <CardContent className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-text-sec">Clients</p>
          <div className="flex gap-4">
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
        </CardContent>
      </Card>

      <div className="space-y-3">
        {alertCards.map(
          ({ key, label, value, icon: Icon, bg, text, iconColor }) => (
            <Card key={key} size="sm">
              <CardContent className="flex items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-card ${bg}`}
                >
                  <Icon className={iconColor} />
                </div>
                <div>
                  <p className="text-xs text-text-sec">{label}</p>
                  <p className={`text-xl font-bold ${text}`}>{value}</p>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
