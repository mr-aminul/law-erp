"use client";

import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Circle } from "lucide-react";

interface ChecklistRowProps {
  title: string;
  completed: boolean;
  dueDate?: string;
  onToggle?: () => void;
  className?: string;
}

/** Shared checklist row for milestone/task lists — used by Case and Service Pipeline tabs. */
export function ChecklistRow({
  title,
  completed,
  dueDate,
  onToggle,
  className,
}: ChecklistRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-card border border-gray-200 px-3 py-2 text-left transition-colors",
        onToggle && "hover:bg-cream-card",
        className
      )}
    >
      {completed ? (
        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-green" />
      ) : (
        <Circle className="h-4.5 w-4.5 shrink-0 text-text-muted" />
      )}
      <span
        className={cn(
          "flex-1 text-sm",
          completed ? "text-text-muted line-through" : "font-medium text-text-primary"
        )}
      >
        {title}
      </span>
      {dueDate ? <span className="text-xs text-text-muted">{dueDate}</span> : null}
    </button>
  );
}
