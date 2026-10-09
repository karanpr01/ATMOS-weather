import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { RotateCcw } from "lucide-react";
import { useSettings } from "../context/settings-context";
import { getMapWeather } from "../lib/api";
import { WORLD_CITIES } from "../lib/worldCities";
import { describeWeather } from "../lib/weatherCodes";
import { formatTemp } from "../lib/units";
import WeatherIcon from "../components/WeatherIcon";
import ErrorCard from "../components/ErrorCard";

const makePin = (text, active) =>
  L.divIcon({
    className: "",
    html: `<span class="map-pin${active ? " map-pin-active" : ""}">${text}</span>`,
    iconSize: [56, 36],
    iconAnchor: [28, 18],
  });

export default function WorldMap() {
  const { units, setLocation, a11y } = useSettings();
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState(null);
  const reduced =
    a11y.reducedMotion ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["world-weather"],
    queryFn: () => getMapWeather(WORLD_CITIES),
    staleTime: 15 * 60 * 1000,
  });

  const cities = data
    ? WORLD_CITIES.map((c, i) => ({
        ...c,
        temp: data[i].current.temperature_2m,
        code: data[i].current.weather_code,
        rain: data[i].daily.precipitation_probability_max[0],
      }))
    : [];

  const pick = (city) => {
    setSelected(city);
    map?.flyTo([city.latitude, city.longitude], Math.max(map.getZoom(), 3), {
      animate: !reduced,
    });
  };

  const reset = () => {
    setSelected(null);
    map?.setView([20, 10], 2, { animate: !reduced });
  };

  const openDashboard = (city) => {
    setLocation({
      name: city.name,
      region: city.region,
      latitude: city.latitude,
      longitude: city.longitude,
    });
    navigate("/");
  };

  const label = (c) =>
    `${c.name}, ${formatTemp(c.temp, units.temp)}°, ${describeWeather(c.code)}`;

  return (
    <div className="max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Worldwide
          </p>
          <h1 className="text-3xl font-bold">Global weather</h1>
        </div>
        <button
          onClick={reset}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:bg-muted"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset view
        </button>
      </header>

      {isError && (
        <ErrorCard message={error.message} onRetry={() => refetch()} />
      )}

      <div
        role="region"
        aria-label="World weather map. The same cities are listed below the map."
        className="h-[60vh] min-h-90 overflow-hidden rounded-3xl border border-border md:h-140"
      >
        <MapContainer
          ref={setMap}
          center={[20, 10]}
          zoom={2}
          minZoom={2}
          worldCopyJump
          zoomAnimation={!reduced}
          fadeAnimation={!reduced}
          className="size-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {cities.map((c) => (
            <Marker
              key={c.name}
              position={[c.latitude, c.longitude]}
              icon={makePin(
                `${formatTemp(c.temp, units.temp)}°`,
                selected?.name === c.name,
              )}
              title={label(c)}
              alt={label(c)}
              eventHandlers={{ click: () => setSelected(c) }}
            />
          ))}

          {selected && (
            <Popup
              key={selected.name}
              position={[selected.latitude, selected.longitude]}
              offset={[0, -18]}
              eventHandlers={{
                remove: () =>
                  setSelected((cur) =>
                    cur?.name === selected.name ? null : cur,
                  ),
              }}
            >
              <div className="min-w-36">
                <p className="font-bold">{selected.name}</p>
                <p className="text-3xl font-light">
                  {formatTemp(selected.temp, units.temp)}°
                </p>
                <p className="text-sm">{describeWeather(selected.code)}</p>
                <p className="text-sm">{selected.rain}% rain</p>
                <button
                  onClick={() => openDashboard(selected)}
                  className="mt-2 min-h-11 rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground"
                >
                  Open dashboard
                </button>
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>

      <section aria-labelledby="cities-title">
        <h2 id="cities-title" className="text-lg font-bold">
          Cities on the map
        </h2>
        {isPending ? (
          <div role="status" className="mt-3 grid gap-2 sm:grid-cols-2">
            <span className="sr-only">Loading cities…</span>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none"
              />
            ))}
          </div>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {cities.map((c) => (
              <li key={c.name}>
                <button
                  onClick={() => pick(c)}
                  aria-pressed={selected?.name === c.name}
                  className={`flex min-h-16 w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    selected?.name === c.name
                      ? "border-primary bg-muted"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <WeatherIcon code={c.code} className="size-7 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{c.name}</span>
                    <span className="block text-sm text-muted-foreground">
                      {describeWeather(c.code)} · {c.rain}% rain
                    </span>
                  </span>
                  <span className="text-2xl font-light">
                    {formatTemp(c.temp, units.temp)}°
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
