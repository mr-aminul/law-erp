import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-input border border-gray-200 bg-surface px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200",
        props["aria-invalid"] &&
          "border-red focus:border-red focus:ring-red/20",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
