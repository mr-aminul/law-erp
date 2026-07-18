"use client";

import { UserAvatar } from "@/components/ui/UserChip";
import { cn } from "@/lib/utils/cn";
import {
  groupSearchHits,
  runGlobalSearch,
  type SearchCategory,
  type SearchHit,
} from "@/lib/search/globalSearch";
import {
  Briefcase,
  FolderOpen,
  Gavel,
  Handshake,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const CATEGORY_ICONS: Record<SearchCategory, LucideIcon> = {
  Pages: LayoutDashboard,
  Clients: Users,
  Employees: Users,
  Cases: Briefcase,
  Services: Handshake,
  Documents: FolderOpen,
  Filings: Gavel,
  Invoices: Receipt,
  Communications: MessageSquare,
};

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shortcut, setShortcut] = useState("⌘K");

  const hits = runGlobalSearch(query);
  const groups = groupSearchHits(hits);
  const showPanel = open && query.trim().length > 0;

  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K");
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function navigate(hit: SearchHit) {
    router.push(hit.href);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!showPanel || hits.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % hits.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + hits.length) % hits.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const hit = hits[activeIndex];
      if (hit) navigate(hit);
    }
  }

  let flatIndex = 0;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted sm:left-3"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search…"
          className="h-9 w-full min-w-0 rounded-input border border-gray-200 bg-white py-0 pl-8 pr-14 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-gray-300 focus:ring-2 focus:ring-gray-200 sm:min-w-[200px] sm:pl-9 sm:pr-16"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showPanel && hits[activeIndex]
              ? `${listId}-${hits[activeIndex].id}`
              : undefined
          }
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 font-sans text-[11px] font-normal tracking-wide text-gray-400 sm:inline">
          {shortcut}
        </kbd>
      </div>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-[120] max-h-[min(60dvh,420px)] w-[min(100vw-2rem,360px)] overflow-y-auto rounded-input border border-gray-200 bg-white py-1 shadow-lg sm:w-[360px]"
        >
          {hits.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-text-muted">
              No results for “{query.trim()}”
            </p>
          ) : (
            groups.map(({ category, hits: categoryHits }) => {
              const Icon = CATEGORY_ICONS[category];
              return (
                <div key={category} className="mb-1 last:mb-0">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    {category}
                  </p>
                  <ul>
                    {categoryHits.map((hit) => {
                      const index = flatIndex++;
                      const isActive = index === activeIndex;
                      return (
                        <li key={hit.id} role="option" aria-selected={isActive}>
                          <button
                            type="button"
                            id={`${listId}-${hit.id}`}
                            onClick={() => navigate(hit)}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={cn(
                              "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                              isActive
                                ? "bg-gray-100 text-text-primary"
                                : "text-text-primary hover:bg-gray-50"
                            )}
                          >
                            {hit.initials ? (
                              <UserAvatar initials={hit.initials} size="sm" />
                            ) : (
                              <Icon
                                className="h-4 w-4 shrink-0 text-text-muted"
                                aria-hidden
                              />
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {hit.title}
                              </span>
                              {hit.subtitle ? (
                                <span className="mt-0.5 block truncate text-xs text-text-muted">
                                  {hit.subtitle}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
