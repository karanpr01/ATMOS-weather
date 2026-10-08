import { Link } from "react-router";
import { Bell } from "lucide-react";
import { useSettings } from "../context/settings-context";
import { useWeather } from "../hooks/useWeather";
import { buildAlerts } from "../lib/alerts";

export default function AlertsBell() {
  const { location } = useSettings();
  const { data } = useWeather(location);
  const count = data ? buildAlerts(data, location).length : 0;

  return (
    <Link
      to="/alerts"
      aria-label={count ? `Weather alerts, ${count} active` : "Weather alerts"}
      className="relative hidden size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground md:grid"
    >
      <Bell className="size-5" aria-hidden="true" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground"
        >
          {count}
        </span>
      )}
    </Link>
  );
}