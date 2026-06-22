import { Suspense } from "react";
import CalendarContent from "./CalendarContent";

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="text-sm text-text-muted">Loading calendar...</div>}>
      <CalendarContent />
    </Suspense>
  );
}
