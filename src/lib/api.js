const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day,surface_pressure",
    hourly:
  "temperature_2m,precipitation_probability,weather_code,surface_pressure,visibility,dew_point_2m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset,wind_speed_10m_max",
    forecast_days: 7,
    timezone: "auto",
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error("We couldn't load weather data.");
  return response.json();
}