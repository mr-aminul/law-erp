"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubNavItem {
  href: string;
  label: string;
  exact?: boolean;
}

interface SubNavProps {
  items: SubNavItem[];
  className?: string;
}

export function SubNav({ items, className }: SubNavProps) {
  const pathname = usePathname();

  function isActive(item: SubNavItem) {
    if (item.exact) return pathname === item.href;
    if (pathname === item.href) return true;
    return (
      item.href !== "/" &&
      pathname.startsWith(item.href + "/") === false &&
      pathname.startsWith(item.href) &&
      !items.some(
        (other) =>
          other.href !== item.href &&
          other.href.length > item.href.length &&
          other.href.startsWith(item.href) &&
          (pathname === other.href || pathname.startsWith(other.href))
      )
    );
  }

  return (
    <nav
      className={cn(
        "flex flex-wrap gap-1 rounded-input border border-divider/70 bg-surface p-1",
        className
      )}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-input px-3 py-1.5 text-sm font-semibold transition-colors",
            isActive(item)
              ? "bg-active-nav text-white"
              : "text-text-sec hover:bg-cream-card hover:text-text-primary"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
