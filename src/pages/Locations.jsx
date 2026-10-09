import { Link, useNavigate } from "react-router";
import { useQueries } from "@tanstack/react-query";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";
import { useSettings } from "../context/settings-context";
import { getWeather } from "../lib/api";
import { locKey } from "../lib/location";
import { describeWeather } from "../lib/weatherCodes";
import { formatTemp } from "../lib/units";
import WeatherIcon from "../components/WeatherIcon";

export default function Locations() {
  const { saved, removeSaved, defaultLocation, setDefaultLocation, setLocation, units } =
    useSettings();
  const navigate = useNavigate();

  const results = useQueries({
    queries: saved.map((loc) => ({
      queryKey: ["weather", loc.latitude, loc.longitude],
      queryFn: () => getWeather(loc.latitude, loc.longitude),
      staleTime: 10 * 60 * 1000,
    })),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Saved locations</h1>
        <Link
          to="/search"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add location
        </Link>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <MapPin className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-2 font-semibold">No saved locations yet.</p>
          <p className="text-sm text-muted-foreground">Search for a city and save it here.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {saved.map((loc, i) => {
            const q = results[i];
            const w = q?.data;
            const isDefault = locKey(loc) === locKey(defaultLocation);

            return (
              <li
                key={locKey(loc)}
                className="flex items-center gap-1 rounded-2xl border border-border bg-card pr-2 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <button
                  onClick={() => {
                    setLocation(loc);
                    navigate("/");
                  }}
                  className="flex min-h-16 flex-1 items-center gap-4 rounded-2xl p-4 text-left hover:bg-muted"
                >
                  {w ? (
                    <WeatherIcon
                      code={w.current.weather_code}
                      isDay={w.current.is_day === 1}
                      className="size-8 shrink-0"
                    />
                  ) : (
                    <span className="size-8 shrink-0 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">
                      {loc.name}
                      {isDefault && (
                        <span className="ml-2 rounded-md border border-border px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          Default
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {q?.isError
                        ? "Couldn't load weather"
                        : w
                          ? describeWeather(w.current.weather_code)
                          : "Loading…"}
                    </span>
                  </span>
                  {w && (
                    <span className="text-3xl font-light tracking-tight">
                      {formatTemp(w.current.temperature_2m, units.temp)}°
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setDefaultLocation(loc)}
                  aria-pressed={isDefault}
                  aria-label={`Set ${loc.name} as default`}
                  className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Star className={`size-5 ${isDefault ? "fill-current text-foreground" : ""}`} aria-hidden="true" />
                </button>
                <button
                  onClick={() => removeSaved(loc)}
                  aria-label={`Remove ${loc.name}`}
                  className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Trash2 className="size-5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}