import { useState } from "react";
import { Droplets, Wind, Sun, Sunrise, Sunset } from "lucide-react";
import { useSettings } from "../context/settings-context";
import { useWeather } from "../hooks/useWeather";
import WeatherIcon from "../components/WeatherIcon";
import { describeWeather } from "../lib/weatherCodes";
import { formatTemp, formatSpeed, uvLabel } from "../lib/units";

const local = (t) => new Date(`${t}T00:00`);
const clock = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function ForecastSkeleton() {
  return (
    <div role="status" className="max-w-4xl space-y-2">
      <span className="sr-only">Loading forecast…</span>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
      ))}
    </div>
  );
}

export default function Forecast() {
  const { location, units } = useSettings();
  const { data, isPending, isError, error, refetch } = useWeather(location);
  const [selected, setSelected] = useState(0);

  if (isPending) return <ForecastSkeleton />;

  if (isError) {
    return (
      <div role="alert" className="max-w-md rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
        >
          Retry
        </button>
      </div>
    );
  }

  const d = data.daily;
  const weekMin = Math.min(...d.temperature_2m_min);
  const weekMax = Math.max(...d.temperature_2m_max);
  const span = weekMax - weekMin || 1;

  const dayName = (t, i) =>
    i === 0 ? "Today" : i === 1 ? "Tomorrow" : local(t).toLocaleDateString([], { weekday: "long" });
  const dateText = (t) => local(t).toLocaleDateString([], { day: "numeric", month: "short" });

  const uv = Math.round(d.uv_index_max[selected]);
  const details = [
    { icon: Droplets, label: "Rain chance", value: `${d.precipitation_probability_max[selected]}%` },
    {
      icon: Wind,
      label: "Max wind",
      value: `${formatSpeed(d.wind_speed_10m_max[selected], units.speed)} ${units.speed === "mph" ? "mph" : "km/h"}`,
    },
    { icon: Sun, label: "UV index", value: `${uv} · ${uvLabel(uv)}` },
    { icon: Sunrise, label: "Sunrise", value: clock(d.sunrise[selected]) },
    { icon: Sunset, label: "Sunset", value: clock(d.sunset[selected]) },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-muted-foreground">
          {location.name}, {location.region}
        </p>
        <h1 className="text-3xl font-bold">7-day forecast</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <section
          aria-labelledby="day-detail"
          className="order-first rounded-3xl border border-border bg-card p-6 md:order-0 md:sticky md:top-6 md:col-start-2 md:row-start-1 md:self-start"
        >
          <h2 id="day-detail" className="text-sm font-semibold text-muted-foreground">
            {dayName(d.time[selected], selected)} · {dateText(d.time[selected])}
          </h2>
          <div className="mt-3 flex items-center gap-4">
            <WeatherIcon code={d.weather_code[selected]} className="size-12" />
            <div>
              <p className="text-3xl font-light tracking-tight">
                {formatTemp(d.temperature_2m_max[selected], units.temp)}°{" "}
                <span className="text-muted-foreground">
                  / {formatTemp(d.temperature_2m_min[selected], units.temp)}°
                </span>
              </p>
              <p className="font-semibold">{describeWeather(d.weather_code[selected])}</p>
            </div>
          </div>
          <dl className="mt-4 divide-y divide-border">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 text-sm">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ul className="space-y-1 md:col-start-1 md:row-start-1">
          {d.time.map((t, i) => {
            const min = d.temperature_2m_min[i];
            const max = d.temperature_2m_max[i];
            return (
              <li key={t}>
                <button
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors ${
                    selected === i ? "border-primary bg-muted" : "border-transparent hover:bg-muted"
                  }`}
                >
                  <span className="w-20 shrink-0 text-sm font-bold md:w-24">
                    {dayName(t, i)}
                    <span className="block text-xs font-medium text-muted-foreground">
                      {dateText(t)}
                    </span>
                  </span>
                  <WeatherIcon code={d.weather_code[i]} className="size-6 shrink-0" />
                  <span
                    className="w-9 shrink-0 text-xs font-semibold text-muted-foreground"
                    aria-label={`${d.precipitation_probability_max[i]}% chance of rain`}
                  >
                    {d.precipitation_probability_max[i]}%
                  </span>
                  <span className="w-8 shrink-0 text-right text-sm text-muted-foreground">
                    {formatTemp(min, units.temp)}°
                  </span>
                  <span className="relative h-1.5 flex-1 rounded-full bg-border" aria-hidden="true">
                    <span
                      className="absolute inset-y-0 rounded-full bg-primary"
                      style={{
                        left: `${((min - weekMin) / span) * 100}%`,
                        right: `${100 - ((max - weekMin) / span) * 100}%`,
                      }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-sm font-bold">{formatTemp(max, units.temp)}°</span>
                  <span className="sr-only">
                    {describeWeather(d.weather_code[i])}, low {formatTemp(min, units.temp)}, high{" "}
                    {formatTemp(max, units.temp)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}