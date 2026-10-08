import { Sun, Moon, Monitor } from "lucide-react";
import { useSettings } from "../context/settings-context";

const order = ["light", "dark", "system"];
const icons = { light: Sun, dark: Moon, system: Monitor };

export default function ThemeToggle() {
  const { theme, setTheme } = useSettings();
  const Icon = icons[theme];
  const next = order[(order.indexOf(theme) + 1) % order.length];

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${theme}. Switch to ${next}`}
      className="grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}