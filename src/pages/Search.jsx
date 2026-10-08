import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, MapPin, Plus, Search as SearchIcon, SearchX, WifiOff } from "lucide-react";
import { useSettings } from "../context/settings-context";
import { useDebounce } from "../hooks/useDebounce";
import { searchCities } from "../lib/geocoding";
import { locKey } from "../lib/location";

export default function Search() {
  const [text, setText] = useState("");
  const query = useDebounce(text).trim();
  const enabled = query.length >= 2;
  const { setLocation, saved, addSaved, removeSaved } = useSettings();
  const navigate = useNavigate();

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["geocode", query],
    queryFn: () => searchCities(query),
    enabled,
    staleTime: 60 * 60 * 1000,
  });

  const choose = (city) => {
    setLocation({
      name: city.name,
      region: city.region,
      latitude: city.latitude,
      longitude: city.longitude,
    });
    navigate("/");
  };

  let body;
  if (!enabled) {
    body = (
      <p className="text-muted-foreground">Type at least 2 letters to search for a city.</p>
    );
  } else if (isFetching && !data) {
    body = (
      <div role="status" className="space-y-2">
        <span className="sr-only">Searching…</span>
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-16 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
        ))}
      </div>
    );
  } else if (isError) {
    body = (
      <div role="alert" className="rounded-2xl border border-border bg-card p-6">
        <WifiOff className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="mt-2 font-semibold">We couldn't load weather data.</p>
        <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
        >
          Retry
        </button>
      </div>
    );
  } else if (data?.length === 0) {
    body = (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-2 font-semibold">No matching locations found.</p>
        <p className="text-sm text-muted-foreground">Check the spelling or try a nearby city.</p>
      </div>
    );
  }  else if (data) {
  body = (
    <ul className="space-y-2">
      {data.map((city) => {
        const loc = {
          name: city.name,
          region: city.region,
          latitude: city.latitude,
          longitude: city.longitude,
        };
        const isSaved = saved.some((l) => locKey(l) === locKey(loc));

        return (
          <li
            key={city.id}
            className="flex items-center gap-1 rounded-2xl border border-border bg-card pr-2"
          >
            <button
              onClick={() => choose(city)}
              className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-left hover:bg-muted"
            >
              <MapPin className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>
                <span className="block font-bold">{city.name}</span>
                <span className="block text-sm text-muted-foreground">{city.region}</span>
              </span>
            </button>
            <button
              onClick={() => (isSaved ? removeSaved(loc) : addSaved(loc))}
              aria-pressed={isSaved}
              aria-label={`Save ${city.name}, ${city.region}`}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-border hover:bg-muted"
            >
              {isSaved ? (
                <Check className="size-5" aria-hidden="true" />
              ) : (
                <Plus className="size-5" aria-hidden="true" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Search city</h1>

      <div>
        <label htmlFor="city-search" className="sr-only">Search city</label>
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 focus-within:border-primary">
          <SearchIcon className="size-5 text-muted-foreground" aria-hidden="true" />
          <input
            id="city-search"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search city..."
            autoComplete="off"
            autoFocus
            className="h-12 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {data ? `${data.length} results found` : ""}
      </p>

      {body}
    </div>
  );
}