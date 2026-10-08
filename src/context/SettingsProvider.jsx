import { useMemo, useState } from "react";
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
  const [defaultLocation, setDefaultLocation] = useLocalStorage(
    "atmos-default",
    DEFAULT_LOCATION
  );
  const [location, setLocation] = useState(defaultLocation);

  const value = useMemo(() => {
    const addSaved = (loc) =>
      setSaved((list) =>
        list.some((l) => locKey(l) === locKey(loc)) ? list : [...list, loc]
      );
    const removeSaved = (loc) =>
      setSaved((list) => list.filter((l) => locKey(l) !== locKey(loc)));

    return {
      units, setUnits,
      location, setLocation,
      saved, addSaved, removeSaved,
      defaultLocation, setDefaultLocation,
    };
  }, [units, setUnits, location, saved, setSaved, defaultLocation, setDefaultLocation]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}