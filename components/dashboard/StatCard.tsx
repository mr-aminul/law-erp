import { FolderCard, type FolderCardVariant } from "@/components/ui/FolderCard";
import type { LucideIcon } from "lucide-react";

interface StatMetric {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface StatCardProps {
  title: string;
  icon?: LucideIcon;
  primaryValue: string | number;
  primaryLabel: string;
  metrics: StatMetric[];
  accent?: "green" | "blue" | "amber" | "sidebar";
  className?: string;
}

const ACCENT_VARIANT: Record<
  NonNullable<StatCardProps["accent"]>,
  FolderCardVariant
> = {
  green: "green",
  blue: "blue",
  amber: "amber",
  sidebar: "sidebar",
};

export function StatCard({
  title,
  primaryValue,
  primaryLabel,
  metrics,
  accent = "green",
  className,
}: StatCardProps) {
  return (
    <FolderCard
      size="sm"
      fluid
      variant={ACCENT_VARIANT[accent]}
      title={title}
      subtitle={primaryLabel}
      highlightValue={primaryValue}
      metrics={metrics}
      className={className}
    />
  );
}
