import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface PageSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageSection({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("rounded-card border border-gray-200 bg-surface p-3 sm:p-4", className)}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
            {Icon ? <Icon className="h-4 w-4 shrink-0 text-text-muted" aria-hidden /> : null}
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-text-muted">{description}</p>
          )}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
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

interface DetailFieldOption {
  value: string;
  label: string;
}

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  /** When set with onChange, renders an underline editor instead of plain text. */
  editing?: boolean;
  editValue?: string;
  onChange?: (value: string) => void;
  /** text (default), date, email, tel, number, or select when options are provided */
  inputType?: "text" | "date" | "email" | "tel" | "number";
  options?: DetailFieldOption[];
  /** Custom editor (e.g. status chip select). Takes precedence over input/select. */
  editSlot?: React.ReactNode;
  error?: string | null;
}

const underlineClass =
  "mt-0.5 w-full border-0 border-b border-gray-300 bg-transparent py-0.5 text-sm font-medium text-text-primary outline-none focus:border-text-primary";

export function DetailField({
  label,
  value,
  icon: Icon,
  editing,
  editValue,
  onChange,
  inputType = "text",
  options,
  editSlot,
  error,
}: DetailFieldProps) {
  const isEditable = Boolean(editing && (editSlot || onChange));

  return (
    <div className={Icon ? "flex gap-2.5" : undefined}>
      {Icon ? (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cream-card text-text-muted">
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </p>
        {isEditable && editSlot ? (
          <div className="mt-0.5">{editSlot}</div>
        ) : isEditable && options ? (
          <Select
            variant="underline"
            value={editValue ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        ) : isEditable ? (
          <input
            type={inputType}
            value={editValue ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            aria-invalid={Boolean(error) || undefined}
            className={cn(
              underlineClass,
              error && "border-red focus:border-red"
            )}
          />
        ) : (
          <p className="mt-0.5 text-sm font-medium text-text-primary">{value}</p>
        )}
        {error ? <p className="mt-1 text-xs text-red">{error}</p> : null}
      </div>
    </div>
  );
}
