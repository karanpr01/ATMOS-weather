import ThemeToggle from "../components/ThemeToggle";

export default function Dashboard() {
  return (
    <section className="max-w-sm rounded-3xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <h1 className="text-sm font-semibold text-muted-foreground">
          Mumbai, India
        </h1>
        <ThemeToggle />
      </div>
      <p className="mt-2 text-7xl font-light tracking-tighter">28°</p>
      <p className="mt-1 text-lg font-semibold">Partly Cloudy</p>
    </section>
  );
}
