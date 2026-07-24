"use client";

import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

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

  const active = items.find(isActive) ?? items[0];
  const segments = useMemo(
    () =>
      items.map((item) => ({
        id: item.href,
        label: item.label,
        href: item.href,
      })),
    [items]
  );

  return (
    <SegmentedControl
      items={segments}
      value={active?.href ?? ""}
      className={className}
    />
  );
}
