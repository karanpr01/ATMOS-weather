import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useSettings } from "../context/settings-context";
import { useWeather } from "../hooks/useWeather";
import { describeWeather } from "../lib/weatherCodes";
import { formatTemp } from "../lib/units";

const hourLabel = (t) => new Date(t).toLocaleTimeString([], { hour: "numeric" });
const margin = { top: 22, right: 8, left: 0, bottom: 0 };

function ChartTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="font-bold">{hourLabel(p.time)}</p>
      <p>{p.temp}°</p>
      <p className="text-muted-foreground">{p.rain}% rain</p>
    </div>
  );
}

export default function Hourly() {
  const { location, units } = useSettings();
  const { data, isPending, isError, error, refetch } = useWeather(location);
  const [selected, setSelected] = useState(0);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isPending) {
    return (
      <div role="status" className="max-w-4xl space-y-4">
        <span className="sr-only">Loading hourly forecast…</span>
        <div className="h-16 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
        <div className="h-72 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
      </div>
    );
  }

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

  const { current, hourly } = data;
  const found = hourly.time.findIndex((t) => t.slice(0, 13) === current.time.slice(0, 13));
  const start = Math.max(0, found);

  const items = hourly.time.slice(start, start + 24).map((time, i) => ({
    time,
    label: i === 0 ? "Now" : hourLabel(time),
    temp: formatTemp(hourly.temperature_2m[start + i], units.temp),
    rain: hourly.precipitation_probability[start + i],
    code: hourly.weather_code[start + i],
  }));

  const temps = items.map((i) => i.temp);
  const pick = items[selected];
  const summary = `Temperature ranges from ${Math.min(...temps)} to ${Math.max(...temps)} degrees over the next 24 hours.`;

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-muted-foreground">
          {location.name}, {location.region}
        </p>
        <h1 className="text-3xl font-bold">Hourly forecast</h1>
      </header>

      <div
        role="group"
        aria-label="Choose an hour"
        className="scroll-thin flex gap-2 overflow-x-auto pb-2"
      >
        {items.map((item, i) => (
          <button
            key={item.time}
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
            className={`min-h-11 shrink-0 rounded-xl border px-3 text-sm font-semibold ${
              selected === i ? "border-primary bg-muted" : "border-border hover:bg-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-lg font-semibold">
        {pick.label} · {pick.temp}° · {describeWeather(pick.code)} · {pick.rain}% rain
      </p>

      <section aria-labelledby="temp-title" className="rounded-3xl border border-border bg-card p-4 md:p-6">
        <h2 id="temp-title" className="text-lg font-bold">Temperature</h2>
        <div role="img" aria-label={summary} className="mt-3 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={items} margin={margin}>
              <defs>
                <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="time"
                tickFormatter={hourLabel}
                interval={3}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                width={36}
                domain={["dataMin - 1", "dataMax + 1"]}
                allowDecimals={false}
                tickFormatter={(v) => `${Math.round(v)}°`}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine
                x={items[0].time}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                label={{ value: "Now", position: "top", fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <ReferenceLine x={pick.time} stroke="var(--primary)" />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#tempFill)"
                isAnimationActive={!reduced}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section aria-labelledby="rain-title" className="rounded-3xl border border-border bg-card p-4 md:p-6">
        <h2 id="rain-title" className="text-lg font-bold">Chance of rain</h2>
        <div role="img" aria-label="Chance of rain for each of the next 24 hours." className="mt-3 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items} margin={margin}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="time"
                tickFormatter={hourLabel}
                interval={3}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                width={36}
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTip />} cursor={{ fill: "var(--muted)" }} />
              <ReferenceLine x={pick.time} stroke="var(--primary)" />
              <Bar
                dataKey="rain"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={!reduced}
                animationDuration={700}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}