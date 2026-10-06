import { useEffect, useState } from "react";
import { getWeather } from "../lib/api";
import { describeWeather } from "../lib/weatherCodes";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getWeather(19.076, 72.8777)
    .then(setWeather)
    .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!weather) {
    return <p>Loading weather…</p>;
  }

  const current = weather.current;

  return (
    <section className="max-w-sm rounded-3xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <h1 className="text-sm font-semibold text-muted-foreground">
          Mumbai, India
        </h1>
      </div>
      <p className="mt-2 text-7xl font-light tracking-tighter">
        {Math.round(current.temperature_2m)}°</p>
      <p className="mt-1 text-lg font-semibold">{describeWeather(current.weather_code)}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Feels like {Math.round(current.apparent_temperature)}° · Humidity{" "}
        {current.relative_humidity_2m}%
      </p>
    </section>
  );
}
