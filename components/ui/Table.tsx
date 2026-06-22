import { cn } from "@/lib/utils/cn";

interface TableProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function Table({ children, className, compact }: TableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table
        className={cn(
          "w-full text-sm",
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
      <tr className="border-b border-divider text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
        {children}
      </tr>
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-divider/60">{children}</tbody>;
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
        "transition-colors",
        onClick && "cursor-pointer hover:bg-cream-card/80",
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
    <th colSpan={colSpan} className={cn("px-4 py-3 font-semibold", className)}>
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
    <td className={cn("px-4 py-3.5 text-text-primary", className)}>{children}</td>
  );
}
