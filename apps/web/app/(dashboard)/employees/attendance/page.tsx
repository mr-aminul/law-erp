"use client";

import { AttendanceBoard } from "@/components/employees/AttendanceBoard";
import { LeaveRequestsPanel } from "@/components/employees/LeaveRequestsPanel";
import { Tabs } from "@/components/ui/Tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "attendance", label: "Attendance" },
  { id: "leave", label: "Leave" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function parseSection(value: string | null): SectionId {
  return value === "leave" ? "leave" : "attendance";
}

export default function AttendanceAndLeavePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [section, setSection] = useState<SectionId>(() =>
    parseSection(searchParams.get("tab"))
  );

  useEffect(() => {
    setSection(parseSection(searchParams.get("tab")));
  }, [searchParams]);

  function changeSection(id: string) {
    const next = parseSection(id);
    setSection(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "attendance") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    const query = params.toString();
    router.replace(
      `/employees/attendance${query ? `?${query}` : ""}`,
      { scroll: false }
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Tabs
          tabs={[...SECTIONS]}
          activeTab={section}
          onChange={changeSection}
        />
      </div>

      <div className={section === "attendance" ? "block" : "hidden"}>
        <AttendanceBoard />
      </div>
      <div className={section === "leave" ? "block" : "hidden"}>
        <LeaveRequestsPanel />
      </div>
    </div>
  );
}
