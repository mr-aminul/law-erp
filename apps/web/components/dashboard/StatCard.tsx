import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatMetric {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  primaryValue: string | number;
  primaryLabel: string;
  metrics?: StatMetric[];
  accent?: "green" | "blue" | "amber" | "sidebar";
  className?: string;
}

const ACCENT_STYLES = {
  green: { icon: "bg-green-light text-green", metric: "text-green" },
  blue: { icon: "bg-blue-light text-blue", metric: "text-blue" },
  amber: { icon: "bg-amber-light text-amber", metric: "text-amber" },
  sidebar: { icon: "bg-theme-subtle text-theme", metric: "text-theme" },
} as const;

export function StatCard({
  title,
  icon: Icon,
  primaryValue,
  primaryLabel,
  metrics = [],
  accent = "green",
  className,
}: StatCardProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div
      className={cn(
        "flex flex-col rounded-card border border-gray-200 bg-surface p-3 sm:p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-badge",
            styles.icon
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-sec">{title}</p>
          <p className="truncate text-2xl font-bold leading-tight text-text-primary">
            {primaryValue}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">{primaryLabel}</p>
        </div>
      </div>

      {metrics.length > 0 && (
        <>
          <Separator className="my-3" />
          <div className="flex gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0 flex-1">
                <p className="text-xs text-text-muted">{metric.label}</p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    metric.highlight ? styles.metric : "text-text-primary"
                  )}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
