"use client";

import { ApiStatusBadge } from "@/components/dashboard/ApiStatusBadge";
import { logout } from "@/lib/auth/client";
import { useAppStore } from "@/lib/store/appStore";
import { formatLongDate } from "@/lib/utils/formatDate";
import { ChevronDown, LogOut, Menu, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface TopbarProps {
  title: string;
  icon: LucideIcon;
  subtitle?: string;
  userName: string;
  userRole: string;
  userInitials: string;
  userEmail?: string;
  userAvatarUrl?: string | null;
}

export function Topbar({
  title,
  icon: Icon,
  subtitle,
  userName,
  userRole,
  userInitials,
  userEmail,
  userAvatarUrl,
}: TopbarProps) {
  const toggleMobileNav = useAppStore((s) => s.toggleMobileNav);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [dateLabel, setDateLabel] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setDateLabel(subtitle ?? formatLongDate());
  }, [subtitle]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
      setMenuOpen(false);
    }
  }

  return (
    <header className="shrink-0 border-b border-gray-200 bg-[#f4f5f6] px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleMobileNav}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input border border-gray-200 bg-white text-text-primary transition-colors hover:bg-cream-card lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="flex min-w-0 items-center gap-2 text-base font-bold tracking-tight text-text-primary sm:text-lg">
            <Icon className="hidden h-5 w-5 shrink-0 sm:block" aria-hidden />
            <span className="truncate">{title}</span>
          </h1>
          <ApiStatusBadge />
          {dateLabel ? (
            <span className="hidden text-xs text-text-primary sm:inline">
              {dateLabel}
            </span>
          ) : null}
        </div>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-input px-1 py-0.5 pr-1 transition-colors hover:bg-cream-card"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar text-[11px] font-bold text-white">
              {userAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-text-primary">
                {userName}
              </p>
              <p className="text-[11px] capitalize text-text-muted">{userRole}</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-input border border-divider bg-white py-1 shadow-lg"
            >
              {userEmail ? (
                <div className="border-b border-divider px-3 py-2">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-text-muted">{userEmail}</p>
                </div>
              ) : null}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={signingOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-cream-card disabled:opacity-60"
              >
                <LogOut className="h-4 w-4 text-text-muted" />
                {signingOut ? "Signing out…" : "Log out"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
