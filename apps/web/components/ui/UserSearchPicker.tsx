"use client";

import { UserAvatar, UserChip } from "@/components/ui/UserChip";
import { cn } from "@/lib/utils/cn";
import { Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export interface UserSearchOption {
  id: string;
  name: string;
  role: string;
  initials: string;
  email?: string;
}

interface UserSearchPickerProps {
  users: UserSearchOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  hint?: string;
}

export function UserSearchPicker({
  users,
  selectedIds,
  onChange,
  placeholder = "Search users by name, role, or email…",
  hint = "Type to search and assign team members",
}: UserSearchPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedIds.includes(u.id)),
    [users, selectedIds]
  );

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return users
      .filter((u) => !selectedIds.includes(u.id))
      .filter(
        (u) =>
          u.name.toLowerCase().includes(trimmed) ||
          u.role.toLowerCase().includes(trimmed) ||
          u.email?.toLowerCase().includes(trimmed)
      )
      .slice(0, 6);
  }, [users, selectedIds, query]);

  function addUser(id: string) {
    onChange([...selectedIds, id]);
    setQuery("");
    setOpen(false);
  }

  function removeUser(id: string) {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  }

  function handleBlur(e: React.FocusEvent) {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="space-y-2" onBlur={handleBlur}>
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedUsers.map((user) => (
            <UserChip
              key={user.id}
              name={user.name}
              initials={user.initials}
              onRemove={() => removeUser(user.id)}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="h-10 w-full rounded-input border border-divider bg-white py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
        />

        {open && query.trim().length > 0 && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-input border border-divider bg-white shadow-lg">
            {results.length > 0 ? (
              <ul className="max-h-48 overflow-y-auto py-1">
                {results.map((user) => (
                  <li key={user.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addUser(user.id)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-cream-card"
                    >
                      <UserAvatar initials={user.initials} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          {user.role}
                          {user.email ? ` · ${user.email}` : ""}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-3 text-sm text-text-muted">
                No users match &ldquo;{query.trim()}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      <p
        className={cn(
          "text-xs",
          selectedUsers.length === 0 ? "text-text-muted" : "text-text-sec"
        )}
      >
        {selectedUsers.length === 0
          ? hint
          : `${selectedUsers.length} assigned · search to add more`}
      </p>
    </div>
  );
}
