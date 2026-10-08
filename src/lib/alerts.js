const HEAVY_RAIN = [65, 67, 82];
const THUNDER = [95, 96, 99];

export const LEVELS = ["Information", "Advisory", "Warning", "Severe"];

const hourText = (value) =>
  new Date(value).toLocaleTimeString([], { hour: "numeric" });
const endText = (iso) => hourText(new Date(iso).getTime() + 3600000);

function windowText(times, indexes) {
  const first = times[indexes[0]];
  const last = times[indexes[indexes.length - 1]];
  return `${hourText(first)} – ${endText(last)}`;
}

export function buildAlerts(data, location) {
  const { current, hourly, daily } = data;
  const found = hourly.time.findIndex((t) => t.slice(0, 13) === current.time.slice(0, 13));
  const start = Math.max(0, found);
  const end = Math.min(hourly.time.length, start + 24);
  const next = [];
  for (let i = start; i < end; i++) next.push(i);

  const place = `${location.name}, ${location.region}`;
  const alerts = [];

  const rain = next.filter((i) => HEAVY_RAIN.includes(hourly.weather_code[i]));
  if (rain.length) {
    const when = windowText(hourly.time, rain);
    alerts.push({
      id: "rain", level: 1, title: "Heavy rain advisory", time: when, place,
      text: `Heavy rainfall expected between ${when.replace(" – ", " and ")}.`,
    });
  }

  const storm = next.filter((i) => THUNDER.includes(hourly.weather_code[i]));
  if (storm.length) {
    const hail = storm.some((i) => hourly.weather_code[i] >= 96);
    const when = windowText(hourly.time, storm);
    alerts.push({
      id: "storm", level: hail ? 3 : 2, place, time: when,
      title: hail ? "Severe thunderstorm" : "Thunderstorm warning",
      text: hail
        ? `Thunderstorms with hail are possible between ${when.replace(" – ", " and ")}.`
        : `Thunderstorms are possible between ${when.replace(" – ", " and ")}.`,
    });
  }

  const wind = daily.wind_speed_10m_max[0];
  if (wind >= 40) {
    alerts.push({
      id: "wind", place, time: "Today",
      level: wind >= 75 ? 3 : wind >= 50 ? 2 : 1,
      title: wind >= 50 ? "Strong wind warning" : "Strong wind advisory",
      text: `Winds up to ${Math.round(wind)} km/h are expected today.`,
    });
  }

  const heat = daily.temperature_2m_max[0];
  if (heat >= 38) {
    alerts.push({
      id: "heat", place, time: "Today",
      level: heat >= 42 ? 2 : 1,
      title: heat >= 42 ? "Extreme heat warning" : "High heat advisory",
      text: `Temperatures up to ${Math.round(heat)}°C are expected today.`,
    });
  }

  const uv = Math.round(daily.uv_index_max[0]);
  if (uv >= 8) {
    alerts.push({
      id: "uv", place, time: "Daytime",
      level: uv >= 11 ? 1 : 0,
      title: uv >= 11 ? "Extreme UV advisory" : "High UV information",
      text: `The UV index is expected to reach ${uv} today.`,
    });
  }

  return alerts.sort((a, b) => b.level - a.level);
}

export function sampleAlerts(location) {
  const place = `${location.name}, ${location.region}`;
  return [
    { id: "s3", level: 3, title: "Severe thunderstorm", time: "9 PM – 11 PM", place, text: "Sample alert: thunderstorms with hail are possible." },
    { id: "s2", level: 2, title: "Strong wind warning", time: "5 PM – 9 PM", place, text: "Sample alert: winds up to 60 km/h are expected." },
    { id: "s1", level: 1, title: "Heavy rain advisory", time: "4 PM – 7 PM", place, text: "Sample alert: heavy rainfall expected between 4 PM and 7 PM." },
    { id: "s0", level: 0, title: "High UV information", time: "Daytime", place, text: "Sample alert: the UV index is expected to reach 8." },
  ];
}