import { Suspense } from "react";
import ServicesContent from "./ServicesContent";

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="text-sm text-text-muted">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
