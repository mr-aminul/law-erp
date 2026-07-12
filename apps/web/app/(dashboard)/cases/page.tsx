import { Suspense } from "react";
import CasesContent from "./CasesContent";

export default function CasesPage() {
  return (
    <Suspense fallback={<div className="text-sm text-text-muted">Loading cases...</div>}>
      <CasesContent />
    </Suspense>
  );
}
