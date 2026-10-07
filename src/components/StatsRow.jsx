import { Wind, Droplets, Sun, CloudRain } from "lucide-react";
import { formatSpeed, toCompass, uvLabel } from "../lib/units";

export default function StatsRow({ data, speedUnit }) {
  const { current, daily } = data;
  const uv = Math.round(daily.uv_index_max[0]);

  const stats = [
    {
      icon: Wind,
      label: "Wind",
      value: `${formatSpeed(current.wind_speed_10m, speedUnit)} ${speedUnit === "mph" ? "mph" : "km/h"}`,
      note: toCompass(current.wind_direction_10m),
    },
    { icon: Droplets, label: "Humidity", value: `${current.relative_humidity_2m}%` },
    { icon: Sun, label: "UV index", value: String(uv), note: uvLabel(uv) },
    {
      icon: CloudRain,
      label: "Rain chance",
      value: `${daily.precipitation_probability_max[0]}%`,
      note: "Today",
    },
  ];

  return (
    <dl className="grid grid-cols-2 border-y border-border md:grid-cols-4">
      {stats.map(({ icon: Icon, label, value, note }) => (
        <div key={label} className="flex flex-col gap-1 py-4 pr-4">
          <dt className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </dt>
          <dd className="text-xl font-bold">{value}</dd>
          {note && <dd className="text-xs text-muted-foreground">{note}</dd>}
        </div>
      ))}
    </dl>
  );
}