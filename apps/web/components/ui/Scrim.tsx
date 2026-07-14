import { cn } from "@/lib/utils/cn";

/** Shared dark focus overlay for modals, drawers, and mobile nav. */
export const SCRIM_CLASS = "bg-black/50 backdrop-blur-[2px]";

interface ScrimProps {
  onClick?: () => void;
  className?: string;
}

export function Scrim({ onClick, className }: ScrimProps) {
  return (
    <div
      className={cn("inset-0", SCRIM_CLASS, className)}
      onClick={onClick}
      aria-hidden
    />
  );
}
