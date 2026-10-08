import { useSettings } from "../context/settings-context";
import { useAirQuality } from "../hooks/useAirQuality";
import ErrorCard from "../components/ErrorCard";
import { AQI_LEVELS, POLLUTANTS, aqiLevel, scalePosition } from "../lib/aqi";

export default function AirQuality() {
  const { location } = useSettings();
  const { data, isPending, isError, error, refetch } = useAirQuality(location);

  if (isPending) {
    return (
      <div role="status" className="max-w-4xl space-y-4">
        <span className="sr-only">Loading air quality…</span>
        <div className="h-56 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
        <div className="h-48 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
      </div>
    );
  }

  if (isError) return <ErrorCard message={error.message} onRetry={() => refetch()} />;

  const { current, hourly } = data;
  const aqi = Math.round(current.us_aqi);
  const level = aqiLevel(aqi);

  const main = POLLUTANTS.reduce((best, p) =>
    current[p.key] / p.guide > current[best.key] / best.guide ? p : best
  );

  const nowIndex = hourly.time.findIndex((t) => t.slice(0, 13) === current.time.slice(0, 13));
  const values = hourly.us_aqi.map((v) => v ?? 0);
  const maxV = Math.max(50, ...values);
  const x = (i) => 10 + (i / (values.length - 1)) * 340;
  const y = (v) => 70 - (v / maxV) * 60;
  const path = values.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const summary = `Air quality index ranges from ${Math.min(...values)} to ${Math.max(...values)} today.`;

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-muted-foreground">
          {location.name}, {location.region}
        </p>
        <h1 className="text-3xl font-bold">Air quality</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="aqi-title" className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 id="aqi-title" className="text-sm font-semibold text-muted-foreground">
            Air Quality Index (US)
          </h2>
          <div className="mt-3 flex flex-wrap items-baseline gap-4">
            <p className="text-8xl font-light leading-none tracking-tighter">{aqi}</p>
            <p className="rounded-lg border border-border bg-muted px-3 py-1 text-sm font-bold">
              {level.label}
            </p>
          </div>
          <p className="mt-4">{level.text}</p>
          <p className="mt-1 text-sm text-muted-foreground">Main pollutant: {main.label}</p>

          <div className="mt-6" role="img" aria-label={`AQI ${aqi}, ${level.label}, on a scale from 0 to 500`}>
            <div className="relative">
              <div className="flex h-3 gap-0.5">
                {AQI_LEVELS.map((l, i) => (
                  <span
                    key={l.label}
                    className={`flex-1 rounded-sm ${l.bar} ${i === level.index ? "" : "opacity-40"}`}
                  />
                ))}
              </div>
              <span
                className="absolute -top-1.5 h-6 w-1 rounded-full bg-foreground"
                style={{ left: `calc(${scalePosition(aqi)}% - 2px)` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>0 Good</span>
              <span>100</span>
              <span>200</span>
              <span>300+</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="pol-title" className="rounded-3xl border border-border bg-card p-6">
          <h2 id="pol-title" className="text-sm font-semibold text-muted-foreground">Pollutants</h2>
          <ul className="mt-2 divide-y divide-border">
            {POLLUTANTS.map((p) => {
              const value = current[p.key];
              const ratio = value / p.guide;
              return (
                <li key={p.key} className="py-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold">{p.label}</span>
                    <span className="text-sm">{Math.round(value)} µg/m³</span>
                  </div>
                  <div
                    className="mt-2 h-1.5 rounded-full bg-border"
                    role="img"
                    aria-label={`${Math.round(ratio * 100)}% of the WHO guideline level`}
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, ratio * 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            A full bar means the level reaches the WHO guideline.
          </p>
        </section>
      </div>

      <section aria-labelledby="trend-title" className="rounded-3xl border border-border bg-card p-6">
        <h2 id="trend-title" className="text-lg font-bold">Today's trend</h2>
        <svg viewBox="0 0 360 80" className="mt-3 w-full" role="img" aria-label={summary}>
          <line x1="10" x2="350" y1="70" y2="70" stroke="var(--border)" />
          <path className="draw" pathLength="1" d={path} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
          {nowIndex >= 0 && (
            <circle cx={x(nowIndex)} cy={y(values[nowIndex])} r="5" fill="var(--bg)" stroke="var(--primary)" strokeWidth="2.5" />
          )}
        </svg>
        <p className="mt-1 text-sm text-muted-foreground">{summary} The ring marks now.</p>
      </section>
    </div>
  );
}