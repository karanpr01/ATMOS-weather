export default function ErrorCard({ message, onRetry }) {
  return (
    <div role="alert" className="max-w-md rounded-2xl border border-border bg-card p-6">
      <p className="font-semibold">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
      >
        Retry
      </button>
    </div>
  );
}