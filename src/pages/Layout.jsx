import { Suspense } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { CloudSun, Search } from "lucide-react";
import { navItems } from "../lib/nav";
import ThemeToggle from "../components/ThemeToggle";
import UnitSwitch from "../components/UnitSwitch";
import AlertsBell from "../components/AlertsBell";

const desktopLink = ({ isActive }) =>
  `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted"
  }`;

const mobileLink = ({ isActive }) =>
  `flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-semibold ${
    isActive ? "text-primary" : "text-muted-foreground"
  }`;

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen md:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-card p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2 font-extrabold tracking-[0.2em]">
          <CloudSun className="size-5 text-primary" aria-hidden="true" />
          ATMOS
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={desktopLink}>
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between px-4 py-4 md:justify-end md:px-9 md:py-6">
          <div className="flex items-center gap-2 font-extrabold tracking-[0.2em] md:hidden">
            <CloudSun className="size-5 text-primary" aria-hidden="true" />
            ATMOS
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/search"
              aria-label="Search city"
              className="grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <Search className="size-5" aria-hidden="true" />
            </Link>
            <AlertsBell />
            <UnitSwitch />
            <ThemeToggle />
          </div>
        </header>

        <main id="main" className="px-4 pb-28 md:px-9 md:pb-10">
          <Suspense
            fallback={
              <p role="status" className="text-muted-foreground">
                Loading…
              </p>
            }
          >
            <div key={pathname} className="page-in">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-border bg-card px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
      >
        {navItems
          .filter((n) => n.mobile)
          .map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={mobileLink}>
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
      </nav>
    </div>
  );
}
