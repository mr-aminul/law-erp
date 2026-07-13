"use client";

import { SubNav } from "@/components/layout/SubNav";
import { cn } from "@/lib/utils/cn";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface SubNavItem {
  href: string;
  label: string;
  exact?: boolean;
}

interface SubNavSectionProps {
  items: readonly SubNavItem[] | SubNavItem[];
  children: ReactNode;
}

/** Keeps SubNav mounted across sibling routes so the active pill can slide. */
export function SubNavSection({ items, children }: SubNavSectionProps) {
  const pathname = usePathname();
  const list = items as SubNavItem[];
  const show = list.some((item) => pathname === item.href);

  return (
    <div className={cn(show && "space-y-4")}>
      {show ? <SubNav items={list} /> : null}
      {children}
    </div>
  );
}
