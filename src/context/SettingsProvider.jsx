import { useMemo } from "react";
import { SettingsContext } from "./settings-context";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_LOCATION } from "../lib/location";

export default function SettingsProvider({ children }) {
  const [units, setUnits] = useLocalStorage("atmos-units", {
    temp: "C",
    speed: "kmh",
    pressure: "hpa",
  });
  const [location, setLocation] = useLocalStorage("atmos-location", DEFAULT_LOCATION);

  const value = useMemo(
    () => ({ units, setUnits, location, setLocation }),
    [units, setUnits, location, setLocation]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}