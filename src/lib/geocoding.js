const URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCities(query) {
  const params = new URLSearchParams({
    name: query,
    count: 8,
    language: "en",
    format: "json",
  });

  const response = await fetch(`${URL}?${params}`);
  if (!response.ok) throw new Error("We couldn't search right now.");

  const data = await response.json();
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    region: [r.admin1, r.country].filter(Boolean).join(", "),
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}