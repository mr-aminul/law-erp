function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200/80 ${className ?? ""}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>

      <div className="grid-stats">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-card border border-gray-200 bg-surface p-4"
          >
            <Bone className="h-3 w-20" />
            <Bone className="mt-3 h-7 w-28" />
            <Bone className="mt-4 h-3 w-full" />
          </div>
        ))}
      </div>

      <section className="rounded-card border border-gray-200 bg-surface p-3 sm:p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Bone className="h-4 w-36" />
          <Bone className="h-8 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bone key={i} className="h-10 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}
