export const formatTemp = (celsius, unit) =>
  Math.round(unit === "F" ? (celsius * 9) / 5 + 32 : celsius);

export const formatSpeed = (kmh, unit) =>
  Math.round(unit === "mph" ? kmh * 0.621371 : kmh);

export const formatPressure = (hpa, unit) =>
  unit === "inhg" ? (hpa * 0.02953).toFixed(2) : Math.round(hpa);