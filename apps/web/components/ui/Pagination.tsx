"use client";

import { cn } from "@/lib/utils/cn";
import { Dropdown } from "@/components/ui/Dropdown";
import { getPaginationRange } from "@/lib/utils/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100];

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  itemLabel?: string;
}

function PageButton({
  active,
  disabled,
  onClick,
  children,
  ariaLabel,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-6 min-w-6 items-center justify-center rounded-lg px-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-text-primary hover:bg-cream-card",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {children}
    </button>
  );
}

function IconButton({
  disabled,
  onClick,
  children,
  ariaLabel,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs text-text-primary transition-colors hover:bg-cream-card",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {children}
    </button>
  );
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
  itemLabel = "results",
}: PaginationProps) {
  const jumpInputId = useId();
  const pageSizeSelectId = useId();
  const [jumpValue, setJumpValue] = useState(String(page));
  const pages = getPaginationRange(page, totalPages);
  const isEmpty = totalItems === 0;
  const start = isEmpty ? 0 : (page - 1) * pageSize + 1;
  const end = isEmpty ? 0 : Math.min(page * pageSize, totalItems);
  const showRange = totalPages > 1;
  const pageSizeChoices = useMemo(() => {
    if (pageSizeOptions.includes(pageSize)) return pageSizeOptions;
    return [...pageSizeOptions, pageSize].sort((a, b) => a - b);
  }, [pageSize, pageSizeOptions]);
  const pageSizeDropdownOptions = useMemo(
    () =>
      pageSizeChoices.map((size) => ({
        value: String(size),
        label: String(size),
      })),
    [pageSizeChoices]
  );

  useEffect(() => {
    setJumpValue(String(page));
  }, [page]);

  function goToPage(next: number) {
    if (isEmpty) return;
    onPageChange(Math.min(Math.max(next, 1), totalPages));
  }

  function handleJumpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number.parseInt(jumpValue, 10);
    if (!Number.isNaN(parsed)) {
      goToPage(parsed);
    }
  }

  return (
    <div
      className={cn(
        "mt-4 flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-primary">
        {isEmpty ? (
          <p>
            <span className="font-semibold">0</span>
            <span className="text-text-muted"> {itemLabel}</span>
          </p>
        ) : (
          <p
            aria-label={
              showRange
                ? `${start} to ${end} of ${totalItems} ${itemLabel}`
                : `${totalItems} ${itemLabel}`
            }
          >
            {showRange ? (
              <>
                <span className="font-semibold">
                  {start}–{end}
                </span>
                <span className="text-text-muted"> of </span>
                <span className="font-semibold">{totalItems}</span>
              </>
            ) : (
              <span className="font-semibold">{totalItems}</span>
            )}
            <span className="text-text-muted"> {itemLabel}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-primary">
        {onPageSizeChange && (
          <div className="mr-0.5 flex items-center gap-1 border-r border-gray-200 pr-2">
            <label
              htmlFor={pageSizeSelectId}
              className="hidden text-xs text-text-muted sm:inline"
            >
              Items per page
            </label>
            <Dropdown
              id={pageSizeSelectId}
              size="sm"
              disabled={isEmpty}
              menuPlacement="auto"
              options={pageSizeDropdownOptions}
              value={String(pageSize)}
              onChange={(next) =>
                onPageSizeChange(Number.parseInt(next, 10))
              }
            />
          </div>
        )}

        <div className="flex items-center gap-1">
          <IconButton
            ariaLabel="First page"
            disabled={page <= 1 || isEmpty}
            onClick={() => goToPage(1)}
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            ariaLabel="Previous page"
            disabled={page <= 1 || isEmpty}
            onClick={() => goToPage(page - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </IconButton>
        </div>

        <div className="flex items-center gap-1">
          {pages.length === 0 ? (
            <PageButton active ariaLabel="Page 1" disabled onClick={() => {}}>
              1
            </PageButton>
          ) : (
            pages.map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-6 w-6 items-center justify-center text-xs text-text-primary"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <PageButton
                  key={item}
                  active={item === page}
                  ariaLabel={`Page ${item}`}
                  onClick={() => goToPage(item)}
                >
                  {item}
                </PageButton>
              )
            )
          )}
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            ariaLabel="Next page"
            disabled={page >= totalPages || isEmpty}
            onClick={() => goToPage(page + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            ariaLabel="Last page"
            disabled={page >= totalPages || isEmpty}
            onClick={() => goToPage(totalPages)}
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </IconButton>
        </div>

        {totalPages > 5 && (
          <form
            onSubmit={handleJumpSubmit}
            className="ml-0.5 flex items-center gap-1"
          >
            <label htmlFor={jumpInputId} className="sr-only">
              Jump to page
            </label>
            <input
              id={jumpInputId}
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              disabled={isEmpty}
              onChange={(e) => setJumpValue(e.target.value)}
              className="h-6 w-12 rounded-lg border border-gray-200 bg-white px-1.5 text-center text-xs text-text-primary focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={isEmpty}
              className="h-6 rounded-lg border border-gray-200 bg-white px-2 text-xs font-semibold text-text-primary transition-colors hover:bg-cream-card disabled:opacity-40"
            >
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
