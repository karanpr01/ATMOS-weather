import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function OfflineBanner({ updatedAt }) {
  const online = useOnlineStatus();
  if (online) return null;

  const time = updatedAt
    ? new Date(updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null;

  return (
    <div
      role="status"
      className="flex items-center gap-2 rounded-xl border border-border bg-warning/15 px-4 py-3 text-sm font-semibold"
    >
      <WifiOff className="size-4 shrink-0" aria-hidden="true" />
      <span>You're offline.{time && ` Showing data from ${time}.`}</span>
    </div>
  );
}