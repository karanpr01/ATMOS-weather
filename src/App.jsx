export default function App() {
  return (
    <main className="min-h-screen p-8">
      <section className="max-w-sm rounded-3xl border border-border bg-card p-6">
        <p className="text-sm font-semibold text-muted-foreground">Mumbai,India</p>
        <p className=" mt-2 text-7xl font-light tracking-tighter">28°</p>
        <p className="mt-1 text-xl font-semibold">Partly Cloudy</p>
        <button
        onClick={
          () => document.documentElement.classList.toggle("dark")
        }
        >Toggle Theme</button>
      </section>
    </main>
  )
}