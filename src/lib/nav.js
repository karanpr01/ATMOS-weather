import { Home, CalendarDays, MapPin, Map as MapIcon, Wind, Settings } from "lucide-react";

export const navItems = [
  { to: "/", label: "Dashboard", icon: Home, mobile: true },
  { to: "/forecast", label: "Forecast", icon: CalendarDays, mobile: true },
  { to: "/locations", label: "Locations", icon: MapPin, mobile: true },
  { to: "/map", label: "Map", icon: MapIcon, mobile: true },
  { to: "/air-quality", label: "Air Quality", icon: Wind, mobile: false },
  { to: "/settings", label: "Settings", icon: Settings, mobile: true },
];