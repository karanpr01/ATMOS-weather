import { useEffect, useMemo, useState } from "react";
import { SettingsContext } from "./settings-context";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_LOCATION, locKey } from "../lib/location";

export default function SettingsProvider({ children }) {
  const [units, setUnits] = useLocalStorage("atmos-units", {
    temp: "C",
    speed: "kmh",
    pressure: "hpa",
  });
  const [saved, setSaved] = useLocalStorage("atmos-saved", []);
  const [defaultLocation, setDefaultLocation] = useLocalStorage("atmos-default", DEFAULT_LOCATION);
  const [location, setLocation] = useState(defaultLocation);

  const [theme, setTheme] = useLocalStorage("atmos-theme-pref", "system");
  const [notify, setNotify] = useLocalStorage("atmos-notify", {
    alerts: true,
    rain: true,
    daily: false,
  });
  const [a11y, setA11y] = useLocalStorage("atmos-a11y", {
    reducedMotion: false,
    largerText: false,
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("reduce-motion", a11y.reducedMotion);
    root.classList.toggle("large-text", a11y.largerText);
  }, [a11y]);

  const value = useMemo(() => {
    const addSaved = (loc) =>
      setSaved((list) => (list.some((l) => locKey(l) === locKey(loc)) ? list : [...list, loc]));
    const removeSaved = (loc) =>
      setSaved((list) => list.filter((l) => locKey(l) !== locKey(loc)));

    return {
      units, setUnits,
      location, setLocation,
      saved, addSaved, removeSaved,
      defaultLocation, setDefaultLocation,
      theme, setTheme,
      notify, setNotify,
      a11y, setA11y,
    };
  }, [units, setUnits, location, saved, setSaved, defaultLocation, setDefaultLocation, theme, setTheme, notify, setNotify, a11y, setA11y]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}