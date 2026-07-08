import { cn } from "@/lib/utils/cn";

interface PageSectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageSection({
  title,
  description,
  action,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("rounded-card border border-divider/70 bg-surface p-4 shadow-sm", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-text-primary">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-text-muted">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

interface FeatureTagProps {
  label: string;
  variant?: "must" | "nice";
}

export function FeatureTag({ label, variant = "must" }: FeatureTagProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-badge px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        variant === "must"
          ? "bg-green-light text-green"
          : "bg-blue-light text-blue"
      )}
    >
      {label}
    </span>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
}

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
