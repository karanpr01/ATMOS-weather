import { useSettings } from "../context/settings-context";

export default function UnitSwitch() {
  const { units, setUnits } = useSettings();

  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="inline-flex rounded-xl border border-border bg-muted p-0.5"
    >
      {["C", "F"].map((unit) => (
        <button
          key={unit}
          onClick={() => setUnits((u) => ({ ...u, temp: unit }))}
          aria-pressed={units.temp === unit}
          className={`min-h-11 min-w-11 rounded-[10px] px-3 text-sm font-bold ${
            units.temp === unit ? "bg-active text-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          °{unit}
        </button>
      ))}
    </div>
  );
}