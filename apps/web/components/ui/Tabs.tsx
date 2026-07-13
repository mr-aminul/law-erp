"use client";

import {
  SegmentedControl,
  type SegmentedItem,
} from "@/components/ui/SegmentedControl";

interface TabsProps {
  tabs: SegmentedItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
  fill?: boolean;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  size = "md",
  fill = false,
}: TabsProps) {
  return (
    <SegmentedControl
      items={tabs}
      value={activeTab}
      onChange={onChange}
      className={className}
      size={size}
      fill={fill}
    />
  );
}
