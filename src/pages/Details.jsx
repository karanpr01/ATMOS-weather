import { Droplets, Eye, Gauge, Thermometer, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useSettings } from "../context/settings-context";
import { useWeather } from "../hooks/useWeather";
import ErrorCard from "../components/ErrorCard";
import { formatPressure, formatSpeed, formatTemp, toCompass, uvLabel } from "../lib/units";

const clock = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const P0 = [10, 80];
const P1 = [200, -50];
const P2 = [390, 80];
const arcPoint = (t) => [
  (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t ** 2 * P2[0],
  (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t ** 2 * P2[1],
];

function Compass({ degrees }) {
  return (
    <svg width="120" height="120" viewBox="0 0 110 110" aria-hidden="true">
      <circle cx="55" cy="55" r="48" fill="none" stroke="var(--border)" strokeWidth="2" />
      <g fontSize="10" fontWeight="700" fill="var(--muted-foreground)" textAnchor="middle">
        <text x="55" y="15">N</text>
        <text x="97" y="59">E</text>
        <text x="55" y="104">S</text>
        <text x="13" y="59">W</text>
      </g>
      <g transform={`rotate(${degrees + 180} 55 55)`}>
        <path d="M55 22l9 34H46z" fill="var(--primary)" />
        <path d="M55 56v22" stroke="var(--muted-foreground)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function Details() {
  const { location, units } = useSettings();
  const { data, isPending, isError, error, refetch } = useWeather(location);

  if (isPending) {
    return (
      <div role="status" className="max-w-4xl space-y-4">
        <span className="sr-only">Loading details…</span>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-44 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
          <div className="h-44 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
        </div>
        <div className="h-52 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
      </div>
    );
  }

  if (isError) return <ErrorCard message={error.message} onRetry={() => refetch()} />;

  const { current, hourly, daily } = data;
  const found = hourly.time.findIndex((t) => t.slice(0, 13) === current.time.slice(0, 13));
  const i = Math.max(0, found);

  const uv = Math.round(daily.uv_index_max[0]);
  const uvIndex = Math.min(11, Math.max(1, uv));
  const speedText = `${formatSpeed(current.wind_speed_10m, units.speed)} ${units.speed === "mph" ? "mph" : "km/h"}`;

  const now = new Date(current.time).getTime();
  const rise = new Date(daily.sunrise[0]).getTime();
  const set = new Date(daily.sunset[0]).getTime();
  const t = (now - rise) / (set - rise);
  const sunUp = t >= 0 && t <= 1;
  const [sx, sy] = arcPoint(Math.min(1, Math.max(0, t)));
  const hours = Math.floor((set - rise) / 3600000);
  const mins = Math.round(((set - rise) % 3600000) / 60000);

  const diff = hourly.surface_pressure[i + 6] - hourly.surface_pressure[i];
  const trend = diff > 1 ? "Rising" : diff < -1 ? "Falling" : "Steady";
  const TrendIcon = trend === "Rising" ? TrendingUp : trend === "Falling" ? TrendingDown : Minus;

  const rows = [
    { icon: Droplets, label: "Humidity", value: `${current.relative_humidity_2m}%` },
    { icon: Eye, label: "Visibility", value: `${Math.round(hourly.visibility[i] / 1000)} km` },
    { icon: Thermometer, label: "Dew point", value: `${formatTemp(hourly.dew_point_2m[i], units.temp)}°` },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-muted-foreground">
          {location.name}, {location.region}
        </p>
        <h1 className="text-3xl font-bold">Weather details</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="wind-title" className="rounded-3xl border border-border bg-card p-6">
          <h2 id="wind-title" className="text-sm font-semibold text-muted-foreground">Wind</h2>
          <div className="mt-3 flex items-center gap-5">
            <Compass degrees={current.wind_direction_10m} />
            <div>
              <p className="text-3xl font-bold">{speedText}</p>
              <p className="text-muted-foreground">
                From {toCompass(current.wind_direction_10m)} ({Math.round(current.wind_direction_10m)}°)
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="uv-title" className="rounded-3xl border border-border bg-card p-6">
          <h2 id="uv-title" className="text-sm font-semibold text-muted-foreground">UV index today</h2>
          <p className="mt-3 text-3xl font-bold">
            {uv} <span className="text-lg font-semibold text-muted-foreground">{uvLabel(uv)}</span>
          </p>
          <div className="mt-5 flex items-end gap-1" role="img" aria-label={`UV index ${uv} on a scale of 1 to 11 and above, ${uvLabel(uv)}`}>
            {Array.from({ length: 11 }, (_, n) => n + 1).map((n) => (
              <span
                key={n}
                className={`flex-1 rounded-md border border-border ${
                  n === uvIndex ? "h-6 bg-primary" : n < uvIndex ? "h-3 bg-muted-foreground/40" : "h-3 bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Extreme</span>
          </div>
        </section>
      </div>

      <section aria-labelledby="sun-title" className="rounded-3xl border border-border bg-card p-6">
        <h2 id="sun-title" className="text-sm font-semibold text-muted-foreground">Sun</h2>
        <svg
          viewBox="0 0 400 90"
          className="mt-3 w-full"
          role="img"
          aria-label={`Sunrise ${clock(daily.sunrise[0])}, sunset ${clock(daily.sunset[0])}. ${sunUp ? "The sun is up." : "The sun is down."}`}
        >
          <path d="M10 80Q200-50 390 80" fill="none" stroke="var(--border)" strokeWidth="2" />
          {sunUp && (
            <>
              <path
                d="M10 80Q200-50 390 80"
                pathLength="1"
                strokeDasharray={`${Math.min(1, Math.max(0, t))} 1`}
                fill="none"
                stroke="var(--warning)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx={sx} cy={sy} r="8" fill="var(--warning)" />
            </>
          )}
          <line x1="0" y1="80" x2="400" y2="80" stroke="var(--border)" />
        </svg>
        <div className="mt-1 flex items-start justify-between text-sm">
          <p>
            <span className="block text-muted-foreground">Sunrise</span>
            <b>{clock(daily.sunrise[0])}</b>
          </p>
          <p className="text-center text-muted-foreground">
            {hours}h {mins}m of daylight
            <span className="block text-xs">{sunUp ? "Sun is up" : "Sun is down"}</span>
          </p>
          <p className="text-right">
            <span className="block text-muted-foreground">Sunset</span>
            <b>{clock(daily.sunset[0])}</b>
          </p>
        </div>
      </section>

      <section aria-labelledby="cond-title" className="rounded-3xl border border-border bg-card p-6">
        <h2 id="cond-title" className="text-sm font-semibold text-muted-foreground">Conditions</h2>
        <dl className="mt-2 divide-y divide-border">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between py-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Gauge className="size-4" aria-hidden="true" />
              Pressure
            </dt>
            <dd className="flex items-center gap-2 font-bold">
              {formatPressure(current.surface_pressure, units.pressure)} {units.pressure === "inhg" ? "inHg" : "hPa"}
              <span className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                <TrendIcon className="size-4" aria-hidden="true" />
                {trend}
              </span>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}