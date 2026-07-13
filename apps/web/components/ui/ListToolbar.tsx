"use client";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { Filter, Search, X } from "lucide-react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface ListToolbarSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ListToolbarProps {
  /** Filters (dropdowns). Collapse to a Filter button when the full row no longer fits. */
  filters?: React.ReactNode;
  search?: ListToolbarSearch;
  /** Primary actions (New X, Upload, etc.) */
  actions?: React.ReactNode;
  /** Active filter value count — badge on the Filter button */
  activeFilterCount?: number;
  /** Shown as Clear when count > 0 */
  onClearFilters?: () => void;
  /**
   * When false, filters stay visible (e.g. tab switchers) and only reflow.
   * Default true: collapse behind a Filter button when the wide row would break.
   */
  collapseFiltersOnMobile?: boolean;
  className?: string;
}

function SearchField({
  search,
  className,
}: {
  search: ListToolbarSearch;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <Input
        placeholder={search.placeholder ?? "Search..."}
        value={search.value}
        onChange={(e) => search.onChange(e.target.value)}
        className="h-10 pl-9"
      />
    </div>
  );
}

/**
 * Measures the natural width of the wide (filters + search + actions) row.
 * When that width exceeds the toolbar, switch to the compact UI.
 */
function useRowWouldBreak(
  containerRef: React.RefObject<HTMLElement | null>,
  measureRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  // Assume compact until measured — avoids a flash of a wrapping wide row.
  const [compact, setCompact] = useState(true);

  useLayoutEffect(() => {
    if (!enabled) {
      setCompact(false);
      return;
    }

    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    function update() {
      const available = container!.clientWidth;
      const needed = measure!.scrollWidth;
      setCompact(needed > available + 1);
    }

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(measure);
    return () => ro.disconnect();
  }, [containerRef, measureRef, enabled]);

  return compact;
}

/**
 * List page toolbar.
 * Wide: single row [filters] … [search] [action]
 * Compact (only when that row would overflow): [search] [filters] [action] + stacked panel
 */
export function ListToolbar({
  filters,
  search,
  actions,
  activeFilterCount = 0,
  onClearFilters,
  collapseFiltersOnMobile = true,
  className,
}: ListToolbarProps) {
  const panelId = useId();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const hasFilters = Boolean(filters);
  const canCollapse = collapseFiltersOnMobile && hasFilters;
  const hasActiveFilters = activeFilterCount > 0;

  const compact = useRowWouldBreak(containerRef, measureRef, canCollapse);

  useEffect(() => {
    if (hasActiveFilters) setFiltersOpen(true);
  }, [hasActiveFilters]);

  useEffect(() => {
    if (!compact) setFiltersOpen(false);
  }, [compact]);

  const actionSlot = actions ? (
    <div className="flex shrink-0 items-center gap-2">{actions}</div>
  ) : null;

  const clearControl =
    onClearFilters && hasActiveFilters ? (
      <button
        type="button"
        onClick={onClearFilters}
        className="shrink-0 self-end pb-2.5 text-xs font-semibold text-text-sec hover:text-text-primary"
      >
        Clear
      </button>
    ) : null;

  /* Tabs / non-collapsing filters — simple reflow, no Filter button */
  if (hasFilters && !canCollapse) {
    return (
      <div className={cn("flex w-full flex-col gap-3 sm:flex-row sm:items-center", className)}>
        <div className="min-w-0 overflow-x-auto">{filters}</div>
        <div className="flex min-w-0 items-center gap-2 sm:ml-auto">
          {search ? (
            <SearchField
              search={search}
              className="min-w-0 flex-1 sm:w-[240px] sm:flex-none"
            />
          ) : null}
          {actionSlot}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Off-flow measure of the ideal single-row width */}
      <div
        ref={measureRef}
        inert
        className="pointer-events-none absolute left-0 top-0 -z-10 flex w-max items-end gap-3 opacity-0"
        aria-hidden
      >
        {hasFilters ? (
          <div className="flex flex-nowrap items-end gap-3 [&>*]:w-auto [&>*]:shrink-0">
            {filters}
          </div>
        ) : null}
        {search ? (
          <SearchField search={search} className="w-[220px] shrink-0" />
        ) : null}
        {actionSlot}
      </div>

      {compact ? (
        <>
          <div className="flex items-center gap-2">
            {search ? (
              <SearchField search={search} className="min-w-0 flex-1" />
            ) : (
              <div className="min-w-0 flex-1" />
            )}
            {canCollapse ? (
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                className={cn(
                  "relative flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-input border px-3 text-sm font-semibold transition-colors",
                  filtersOpen || hasActiveFilters
                    ? "border-gray-300 bg-gray-100 text-text-primary"
                    : "border-gray-200 bg-white text-text-primary hover:bg-cream-card"
                )}
                aria-expanded={filtersOpen}
                aria-controls={panelId}
                aria-label={
                  hasActiveFilters
                    ? `Filters, ${activeFilterCount} active`
                    : "Filters"
                }
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-theme px-1.5 text-[11px] font-bold leading-none text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            ) : null}
            {actionSlot}
          </div>

          {canCollapse && filtersOpen ? (
            <div
              id={panelId}
              className="mt-3 flex flex-col gap-3 rounded-card border border-gray-200 bg-surface p-3 [&>*]:w-full"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                  Filters
                  {hasActiveFilters ? (
                    <span className="ml-1.5 font-semibold normal-case text-theme">
                      · {activeFilterCount} active
                    </span>
                  ) : null}
                </p>
                <div className="flex items-center gap-1">
                  {onClearFilters && hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-text-sec hover:bg-cream-card hover:text-text-primary"
                    >
                      Clear all
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-cream-card hover:text-text-primary"
                    aria-label="Close filters"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {filters}
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex min-w-0 flex-nowrap items-end gap-3">
          {hasFilters ? (
            <div className="flex min-w-0 flex-nowrap items-end gap-3 [&>*]:w-auto [&>*]:shrink-0">
              {filters}
              {clearControl}
            </div>
          ) : null}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            {search ? (
              <SearchField search={search} className="w-[220px]" />
            ) : null}
            {actionSlot}
          </div>
        </div>
      )}
    </div>
  );
}
