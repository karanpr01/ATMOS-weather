import { useId } from "react";
import { Link } from "react-router";
import { useSettings } from "../context/settings-context";

function Section({ title, children }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="rounded-3xl border border-border bg-card p-6">
      <h2 id={id} className="text-sm font-semibold text-muted-foreground">{title}</h2>
      <div className="mt-2 divide-y divide-border">{children}</div>
    </section>
  );
}

function Row({ label, hint, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="font-semibold">{label}</p>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Segmented({ label, value, options, onChange }) {
  return (
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-xl border border-border bg-card p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`min-h-9 rounded-lg px-3 text-sm font-semibold transition-colors ${
            value === o.value ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Switch({ label, checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="grid min-h-11 min-w-14 place-items-center"
    >
      <span
        className={`relative h-7 w-12 rounded-full border border-border transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 size-5 rounded-full transition-transform ${
            checked ? "translate-x-5 bg-primary-foreground" : "bg-muted-foreground"
          }`}
        />
      </span>
    </button>
  );
}

export default function Settings() {
  const {
    theme, setTheme, units, setUnits, location, defaultLocation,
    notify, setNotify, a11y, setA11y,
  } = useSettings();

  const setUnit = (key) => (value) => setUnits((u) => ({ ...u, [key]: value }));
  const place = (l) => `${l.name}, ${l.region}`;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Appearance">
          <Row label="Theme">
            <Segmented
              label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ]}
            />
          </Row>
        </Section>

        <Section title="Units">
          <Row label="Temperature">
            <Segmented
              label="Temperature unit"
              value={units.temp}
              onChange={setUnit("temp")}
              options={[{ value: "C", label: "°C" }, { value: "F", label: "°F" }]}
            />
          </Row>
          <Row label="Wind speed">
            <Segmented
              label="Wind speed unit"
              value={units.speed}
              onChange={setUnit("speed")}
              options={[{ value: "kmh", label: "km/h" }, { value: "mph", label: "mph" }]}
            />
          </Row>
          <Row label="Pressure">
            <Segmented
              label="Pressure unit"
              value={units.pressure}
              onChange={setUnit("pressure")}
              options={[{ value: "hpa", label: "hPa" }, { value: "inhg", label: "inHg" }]}
            />
          </Row>
        </Section>

        <Section title="Location">
          <Row label="Viewing now" hint={place(location)} />
          <Row label="Default location" hint={place(defaultLocation)}>
            <Link to="/locations" className="inline-flex min-h-11 items-center text-sm font-semibold underline">
              Change
            </Link>
          </Row>
        </Section>

        <Section title="Notifications">
          <Row label="Weather alerts">
            <Switch label="Weather alerts" checked={notify.alerts} onChange={(v) => setNotify((n) => ({ ...n, alerts: v }))} />
          </Row>
          <Row label="Rain notifications">
            <Switch label="Rain notifications" checked={notify.rain} onChange={(v) => setNotify((n) => ({ ...n, rain: v }))} />
          </Row>
          <Row label="Daily summary">
            <Switch label="Daily summary" checked={notify.daily} onChange={(v) => setNotify((n) => ({ ...n, daily: v }))} />
          </Row>
          <p className="py-3 text-sm text-muted-foreground">
            Your choices are saved. Sending notifications isn't part of this version yet.
          </p>
        </Section>

        <Section title="Accessibility">
          <Row label="Reduce motion" hint="Turns off animations and transitions.">
            <Switch label="Reduce motion" checked={a11y.reducedMotion} onChange={(v) => setA11y((a) => ({ ...a, reducedMotion: v }))} />
          </Row>
          <Row label="Larger text" hint="Makes text and spacing about 12% bigger.">
            <Switch label="Larger text" checked={a11y.largerText} onChange={(v) => setA11y((a) => ({ ...a, largerText: v }))} />
          </Row>
        </Section>
      </div>
    </div>
  );
}