import { cn } from "@/lib/utils/cn";

interface TableProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
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
        /* overflow-x-auto must win over overflow-hidden so tables scroll on narrow screens */
        "overflow-x-auto overscroll-x-contain border border-gray-200 outline-none focus:outline-none",
        isRounded && "rounded-card",
        className
      )}
    >
      <table
        className={cn(
          "w-full border-separate border-spacing-0 text-xs [&_tbody_tr:last-child_td]:border-b-0",
          isRounded &&
            "[&_thead_th:first-child]:rounded-tl-card [&_thead_th:last-child]:rounded-tr-card",
          rounded === "full" &&
            "[&_tbody_tr:last-child_td:first-child]:rounded-bl-card [&_tbody_tr:last-child_td:last-child]:rounded-br-card",
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
  return <tbody>{children}</tbody>;
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
        "transition-colors duration-150 hover:bg-gray-100",
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
        "border-r border-white/15 px-3 py-2 font-bold last:border-r-0",
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
        "border-b border-r border-gray-200 px-3 py-1.5 text-xs text-text-primary last:border-r-0",
        className
      )}
    >
      {children}
    </td>
  );
}
