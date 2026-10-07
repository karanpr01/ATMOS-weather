import WeatherIcon from "./WeatherIcon";
import { formatTemp } from "../lib/units";

export default function HourlyStrip({ data, unit }) {
  const { current, hourly, daily } = data;
  const found = hourly.time.findIndex((t) => t.slice(0, 13) === current.time.slice(0, 13));
  const start = Math.max(0, found);
  const sunrise = Number(daily.sunrise[0].slice(11, 13));
  const sunset = Number(daily.sunset[0].slice(11, 13));

  const items = hourly.time.slice(start, start + 9).map((time, i) => {
    const index = start + i;
    const hour = Number(time.slice(11, 13));
    return {
      time,
      label: i === 0 ? "Now" : new Date(time).toLocaleTimeString([], { hour: "numeric" }),
      code: hourly.weather_code[index],
      temp: hourly.temperature_2m[index],
      rain: hourly.precipitation_probability[index],
      isDay: hour >= sunrise && hour < sunset,
    };
  });

  return (
    <section aria-labelledby="hourly-title">
      <h2 id="hourly-title" className="text-lg font-bold">Next hours</h2>
      <div
        role="region"
        aria-label="Hourly forecast, scrolls sideways"
        tabIndex={0}
        className="scroll-thin mt-3 snap-x snap-proximity overflow-x-auto pb-2"
      >
        <ul className="flex gap-2">
          {items.map((item, i) => (
            <li
              key={item.time}
              className={`flex snap-start min-w-18 flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-sm font-semibold ${
                i === 0 ? "border-primary bg-muted" : "border-transparent"
              }`}
            >
              <span className="text-muted-foreground">{item.label}</span>
              <WeatherIcon code={item.code} isDay={item.isDay} className="size-6" />
              <span>{formatTemp(item.temp, unit)}°</span>
              <span className="text-xs text-muted-foreground" aria-label={`${item.rain}% chance of rain`}>
                {item.rain}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}