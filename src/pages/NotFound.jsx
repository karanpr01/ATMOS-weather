import { Link } from "react-router";
import { CloudOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md rounded-3xl border border-dashed border-border p-10 text-center">
      <CloudOff className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
      <p className="mt-1 text-muted-foreground">That page doesn't exist or has moved.</p>
      <Link
        to="/"
        className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
      >
        Back to dashboard
      </Link>
    </div>
  );
}