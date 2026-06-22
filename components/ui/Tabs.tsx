"use client";

import { cn } from "@/lib/utils/cn";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 rounded-input bg-cream-card p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-input px-3 py-1.5 text-sm font-semibold transition-colors",
            activeTab === tab.id
              ? "bg-active-nav text-white shadow-sm"
              : "text-text-sec hover:text-text-primary hover:bg-white/60"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
