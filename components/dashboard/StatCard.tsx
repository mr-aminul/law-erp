import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
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
  metrics: StatMetric[];
  accent?: "green" | "blue" | "amber" | "sidebar";
  className?: string;
}

const accentStyles = {
  green: {
    icon: "bg-accent text-accent-foreground",
    value: "text-green",
  },
  blue: {
    icon: "bg-blue-light text-blue",
    value: "text-foreground",
  },
  amber: {
    icon: "bg-amber-light text-amber",
    value: "text-foreground",
  },
  sidebar: {
    icon: "bg-primary text-primary-foreground",
    value: "text-foreground",
  },
};

export function StatCard({
  title,
  icon: Icon,
  primaryValue,
  primaryLabel,
  metrics,
  accent = "green",
  className,
}: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <Card size="sm" className={cn("h-full shadow-sm", className)}>
      <CardHeader className="border-b border-border/60 pb-3">
        <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardDescription>
        <CardAction>
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              styles.icon
            )}
          >
            <Icon data-icon="inline-start" />
          </div>
        </CardAction>
        <CardTitle
          className={cn(
            "font-sans text-3xl font-bold tabular-nums tracking-tight",
            styles.value
          )}
        >
          {primaryValue}
        </CardTitle>
        <CardDescription className="text-sm text-text-sec">
          {primaryLabel}
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="grid grid-cols-2 gap-2 pb-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col gap-1 rounded-lg bg-muted/80 px-3 py-2.5"
          >
            <span className="truncate text-[11px] font-medium text-muted-foreground">
              {metric.label}
            </span>
            <span
              className={cn(
                "text-sm font-bold tabular-nums",
                metric.highlight ? "text-green" : "text-foreground"
              )}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
