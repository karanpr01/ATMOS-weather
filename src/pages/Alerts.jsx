import { useState } from "react";
import { BellOff, CircleAlert, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import { useSettings } from "../context/settings-context";
import { useWeather } from "../hooks/useWeather";
import ErrorCard from "../components/ErrorCard";
import { LEVELS, buildAlerts, sampleAlerts } from "../lib/alerts";

const STYLE = [
  { icon: Info, token: "primary" },
  { icon: CircleAlert, token: "warning" },
  { icon: TriangleAlert, token: "destructive" },
  { icon: OctagonAlert, token: "destructive" },
];

export default function Alerts() {
  const { location } = useSettings();
  const { data, isPending, isError, error, refetch } = useWeather(location);
  const [preview, setPreview] = useState(false);

  if (isPending) {
    return (
      <div role="status" className="max-w-2xl space-y-3">
        <span className="sr-only">Loading alerts…</span>
        {[1, 2].map((n) => (
          <div key={n} className="h-28 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorCard message={error.message} onRetry={() => refetch()} />;

  const alerts = preview ? sampleAlerts(location) : buildAlerts(data, location);

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-muted-foreground">
          {location.name}, {location.region}
        </p>
        <h1 className="text-3xl font-bold">Weather alerts</h1>
      </header>

      <p className="rounded-xl border border-border bg-muted px-4 py-3 text-sm">
        These alerts are generated from the forecast for this project. They are not official
        warnings. For official warnings, check your national weather service.
      </p>

      <button
        onClick={() => setPreview((p) => !p)}
        aria-pressed={preview}
        className="min-h-11 rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:bg-muted"
      >
        {preview ? "Showing sample alerts" : "Preview sample alerts"}
      </button>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <BellOff className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-2 text-lg font-bold">No active alerts</p>
          <p className="text-sm text-muted-foreground">Weather conditions are currently stable.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => {
            const { icon: Icon, token } = STYLE[a.level];
            return (
              <li
                key={a.id}
                className={`flex gap-4 rounded-2xl border border-l-4 border-border bg-card p-5 ${
                  a.level === 3 ? "ring-2 ring-destructive/40" : ""
                }`}
                style={{ borderLeftColor: `var(--${token})` }}
              >
                <Icon className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="inline-block rounded-md border border-border px-2 py-0.5 text-xs font-bold">
                    {LEVELS[a.level]}
                  </span>
                  <h2 className="mt-2 text-lg font-bold">{a.title}</h2>
                  <p className="mt-1">{a.text}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {a.time} · {a.place}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}