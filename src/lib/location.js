export const DEFAULT_LOCATION = {
  name: "Mumbai",
  region: "India",
  latitude: 19.076,
  longitude: 72.8777,
};

export const locKey = (loc) =>
  `${loc.latitude.toFixed(2)},${loc.longitude.toFixed(2)}`;