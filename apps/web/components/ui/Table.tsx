import { cn } from "@/lib/utils/cn";

interface TableProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  /** Use "top" when pagination or another footer sits below the table */
  rounded?: "full" | "top" | "none";
}

export function Table({
  children,
  className,
  compact,
  rounded = "full",
}: TableProps) {
  const isRounded = rounded !== "none";

  return (
    <div
      className={cn(
        "overflow-x-auto outline-none focus:outline-none",
        isRounded && "overflow-hidden rounded-lg",
        className
      )}
    >
      <table
        className={cn(
          "w-full table-auto border-separate border-spacing-0 text-xs",
          isRounded &&
            "[&_thead_th:first-child]:rounded-tl-lg [&_thead_th:last-child]:rounded-tr-lg",
          rounded === "full" &&
            "[&_tbody_tr:last-child_td:first-child]:rounded-bl-lg [&_tbody_tr:last-child_td:last-child]:rounded-br-lg",
          compact && "[&_th]:px-3 [&_th]:py-1.5 [&_td]:px-3 [&_td]:py-1.5"
        )}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-white/15 bg-primary text-left text-xs font-bold text-primary-foreground">
        {children}
      </tr>
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-divider/40">{children}</tbody>;
}

export function TableRow({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "transition-colors duration-150 hover:bg-cream-card",
        onClick && "group cursor-pointer",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <th
      colSpan={colSpan}
      className={cn(
        "border-r border-white/15 px-4 py-2.5 font-bold last:border-r-0",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-r border-divider/40 px-4 py-3 text-xs text-text-primary last:border-r-0",
        className
      )}
    >
      {children}
    </td>
  );
}
