import { useWeather } from "../hooks/useWeather";
import { DEFAULT_LOCATION } from "../lib/location";
import { describeWeather } from "../lib/weatherCodes";

export default function Dashboard() {
  const { data, isPending, isError, error, refetch } = useWeather(DEFAULT_LOCATION);

  if (isPending) return <p>Loading weather…</p>;

  if (isError) {
    return (
      <div role="alert" className="max-w-sm rounded-2xl border border-border bg-card p-6">
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

  const current = data.current;

  return (
    <section className="max-w-sm rounded-3xl border border-border bg-card p-6">
      <h1 className="text-sm font-semibold text-muted-foreground">
        {DEFAULT_LOCATION.name}, {DEFAULT_LOCATION.region}
      </h1>
      <p className="mt-2 text-7xl font-light tracking-tighter">
        {Math.round(current.temperature_2m)}°
      </p>
      <p className="mt-1 text-lg font-semibold">{describeWeather(current.weather_code)}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Feels like {Math.round(current.apparent_temperature)}° · Humidity{" "}
        {current.relative_humidity_2m}%
      </p>
    </section>
  );
}