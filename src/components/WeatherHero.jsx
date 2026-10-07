import WeatherIcon from "./WeatherIcon";
import { describeWeather } from "../lib/weatherCodes";
import { formatTemp } from "../lib/units";

export default function WeatherHero({ location, data, unit }) {
  const { current, daily } = data;
  const isDay = current.is_day === 1;
  const when = new Date(current.time);
  const glow = isDay ? "--warning" : "--primary";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 85% 0%, color-mix(in srgb, var(${glow}) 28%, transparent), transparent 60%)`,
        }}
      />
      <WeatherIcon
        code={current.weather_code}
        isDay={isDay}
        className="absolute -right-4 -top-4 size-40 text-foreground/10 md:size-56"
      />
      <div className="relative">
        <p className="text-sm text-muted-foreground">
          {when.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })} ·{" "}
          {when.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </p>
        <h1 id="hero-title" className="mt-1 text-lg font-bold">
          {location.name}, {location.region}
        </h1>
        <p className="mt-6 text-8xl font-light leading-none tracking-tighter md:text-9xl">
          {formatTemp(current.temperature_2m, unit)}°
        </p>
        <p className="mt-3 text-xl font-semibold">{describeWeather(current.weather_code)}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Feels like {formatTemp(current.apparent_temperature, unit)}° · H{" "}
          {formatTemp(daily.temperature_2m_max[0], unit)}° / L{" "}
          {formatTemp(daily.temperature_2m_min[0], unit)}°
        </p>
      </div>
    </section>
  );
}