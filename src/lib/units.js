export const formatTemp = (celsius, unit) =>
  Math.round(unit === "F" ? (celsius * 9) / 5 + 32 : celsius);

export const formatSpeed = (kmh, unit) =>
  Math.round(unit === "mph" ? kmh * 0.621371 : kmh);

export const formatPressure = (hpa, unit) =>
  unit === "inHg" ? (hpa * 0.02953).toFixed(2) : Math.round(hpa);

export function toCompass(degrees) {
  const names = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return names[Math.round(degrees / 45) % 8];
}

export function uvLabel(uv) {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}