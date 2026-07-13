import { cn } from "@/lib/utils/cn";
import { forwardRef } from "react";

export { Select } from "@/components/ui/Select";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[96px] w-full rounded-input border border-gray-200 bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export function Label({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-xs font-semibold text-text-sec"
    >
      {children}
      {required && <span className="ml-0.5 text-red">*</span>}
    </label>
  );
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error ? <p className="mt-1 text-xs text-red">{error}</p> : null}
    </div>
  );
}
