export const AQI_LEVELS = [
  { max: 50, label: "Good", text: "Air quality is currently good.", bar: "bg-success" },
  { max: 100, label: "Moderate", text: "Air quality is acceptable for most people.", bar: "bg-primary" },
  { max: 150, label: "Unhealthy for sensitive groups", text: "Air quality is lower than usual. Check local guidance.", bar: "bg-warning" },
  { max: 200, label: "Unhealthy", text: "Air quality is poor. Check local guidance.", bar: "bg-destructive" },
  { max: 300, label: "Very unhealthy", text: "Air quality is very poor. Check local guidance.", bar: "bg-destructive" },
  { max: Infinity, label: "Hazardous", text: "Air quality is hazardous. Check local guidance.", bar: "bg-muted-foreground" },
];

export function aqiLevel(value) {
  const index = AQI_LEVELS.findIndex((l) => value <= l.max);
  return { ...AQI_LEVELS[index], index };
}

const BOUNDS = [0, 50, 100, 150, 200, 300, 500];

export function scalePosition(value) {
  const v = Math.min(Math.max(value, 0), 499);
  const i = BOUNDS.findIndex((b, n) => v >= b && v < BOUNDS[n + 1]);
  const fraction = (v - BOUNDS[i]) / (BOUNDS[i + 1] - BOUNDS[i]);
  return ((i + fraction) / 6) * 100;
}

// Reference levels from WHO 2021 guidelines, in µg/m³
export const POLLUTANTS = [
  { key: "pm2_5", label: "PM2.5", guide: 15 },
  { key: "pm10", label: "PM10", guide: 45 },
  { key: "ozone", label: "O₃", guide: 100 },
  { key: "nitrogen_dioxide", label: "NO₂", guide: 25 },
];