import { getWeatherIcon } from "../lib/weatherCodes";

export default function WeatherIcon({ code, isDay = true, className = "size-6" }) {
  const Icon = getWeatherIcon(code, isDay);
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} aria-hidden="true" />;
}