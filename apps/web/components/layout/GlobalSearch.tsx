"use client";

import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const hits = runGlobalSearch(query);
  const groups = groupSearchHits(hits);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function close() {
    onOpenChange(false);
  }

  function navigate(hit: SearchHit) {
    router.push(hit.href);
    close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hits.length === 0) return;
      setActiveIndex((i) => (i + 1) % hits.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hits.length === 0) return;
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
    <Modal open={open} onClose={close} title="Search" className="max-w-xl">
      <div onKeyDown={onKeyDown}>
        <div className="relative mb-3">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, clients, matters…"
            className="pl-9"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              hits[activeIndex] ? `${listId}-${hits[activeIndex].id}` : undefined
            }
          />
        </div>

        <div
          id={listId}
          role="listbox"
          className="max-h-[min(60dvh,420px)] overflow-y-auto"
        >
          {!query.trim() ? (
            <p className="py-6 text-center text-sm text-text-muted">
              Search pages, clients, employees, matters, documents…
            </p>
          ) : hits.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-muted">
              No results for “{query.trim()}”
            </p>
          ) : (
            groups.map(({ category, hits: categoryHits }) => {
              const Icon = CATEGORY_ICONS[category];
              return (
                <div key={category} className="mb-2 last:mb-0">
                  <p className="px-1 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    {category}
                  </p>
                  <ul className="space-y-0.5">
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
                              "flex w-full items-start gap-2.5 rounded-input px-2 py-2 text-left transition-colors",
                              isActive
                                ? "bg-cream-card text-text-primary"
                                : "text-text-primary hover:bg-cream-card/70"
                            )}
                          >
                            <Icon
                              className="mt-0.5 h-4 w-4 shrink-0 text-text-muted"
                              aria-hidden
                            />
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
      </div>
    </Modal>
  );
}

interface GlobalSearchTriggerProps {
  onOpen: () => void;
  className?: string;
}

export function GlobalSearchTrigger({
  onOpen,
  className,
}: GlobalSearchTriggerProps) {
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    setShortcut(
      /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"
    );
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 rounded-input border border-gray-200 bg-white px-2.5 text-sm text-text-muted transition-colors hover:bg-cream-card hover:text-text-primary sm:min-w-[200px] sm:px-3",
        className
      )}
      aria-label="Open search"
    >
      <Search className="h-4 w-4 shrink-0" aria-hidden />
      <span className="hidden flex-1 text-left sm:inline">Search…</span>
      <kbd className="ml-auto hidden font-sans text-[11px] font-normal tracking-wide text-gray-400 sm:inline">
        {shortcut}
      </kbd>
    </button>
  );
}
