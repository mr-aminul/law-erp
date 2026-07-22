"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils/cn";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CURRENT_USER = {
  name: "Aminul Islam",
  email: "aminul@ukil.ai",
  initials: "AI",
};

export function UserMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-green-light text-[11px] font-bold text-green transition-colors hover:bg-theme-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {CURRENT_USER.initials}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 w-52 origin-top-right pt-1.5"
        >
          <div className="overflow-hidden rounded-input border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-light text-[11px] font-bold text-green">
                {CURRENT_USER.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold leading-tight text-text-primary">
                  {CURRENT_USER.name}
                </p>
                <p className="mt-0.5 truncate text-[11px] leading-tight text-text-muted">
                  {CURRENT_USER.email}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 py-1">
              <Link
                href="/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-primary transition-colors hover:bg-[#eceef1]"
              >
                <Settings className="h-3.5 w-3.5 shrink-0 text-text-sec" />
                Settings
              </Link>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setLogoutConfirmOpen(true);
              }}
              className="flex w-full items-center gap-2 bg-red px-3 py-2 text-[13px] text-white transition-colors hover:bg-[color-mix(in_srgb,var(--color-red)_85%,black)]"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={() => {
          window.location.href = "/";
        }}
        tone="danger"
        title="Sign out?"
        description="Are you sure you want to sign out?"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
      />
    </div>
  );
}
