import { WifiOff } from "lucide-react";
import { useSettings } from "../context/settings-context";
import { useWeather } from "../hooks/useWeather";
import WeatherHero from "../components/WeatherHero";
import StatsRow from "../components/StatsRow";
import HourlyStrip from "../components/HourlyStrip";
import DashboardSkeleton from "../components/DashboardSkeleton";
import OfflineBanner from "../components/OfflineBanner";
import { Link } from "react-router";

export default function Dashboard() {
  const { location, units } = useSettings();
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchStatus,
    dataUpdatedAt,
  } = useWeather(location);

  if (isPending && fetchStatus === "paused") {
    return (
      <div
        role="status"
        className="max-w-md rounded-2xl border border-border bg-card p-6"
      >
        <WifiOff className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 font-semibold">You're offline.</p>
        <p className="text-sm text-muted-foreground">
          Connect to the internet and the weather will load by itself.
        </p>
      </div>
    );
  }

  if (isPending) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div
        role="alert"
        className="max-w-md rounded-2xl border border-border bg-card p-6"
      >
        <p className="font-semibold">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <OfflineBanner updatedAt={dataUpdatedAt} />
      <WeatherHero location={location} data={data} unit={units.temp} />
      <StatsRow data={data} speedUnit={units.speed} />
      <nav aria-label="More weather" className="flex flex-wrap gap-x-6">
        <Link
          to="/details"
          className="inline-flex min-h-11 items-center text-sm font-semibold underline"
        >
          All weather details
        </Link>
        <Link
          to="/air-quality"
          className="inline-flex min-h-11 items-center text-sm font-semibold underline"
        >
          Air quality
        </Link>
      </nav>
      <HourlyStrip data={data} unit={units.temp} />
    </div>
  );
}
