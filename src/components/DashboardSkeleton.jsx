const bar = "animate-pulse rounded-2xl bg-muted motion-reduce:animate-none";

export default function DashboardSkeleton() {
  return (
    <div role="status" className="max-w-4xl space-y-8">
      <span className="sr-only">Loading weather…</span>
      <div className={`${bar} h-80`} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${bar} h-20`} />
        ))}
      </div>
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`${bar} h-28 w-18 shrink-0`} />
        ))}
      </div>
    </div>
  );
}