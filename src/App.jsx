/* eslint-disable react-hooks/static-components */
import { Routes, Route } from "react-router";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Placeholder from "./pages/Placeholder";
import Forecast from "./pages/Forecast";
import Details from "./pages/Details";
import Search from "./pages/Search";
import Locations from "./pages/Locations.jsx";
import AirQuality from "./pages/AirQuality.jsx";
import Alerts from "./pages/Alerts.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import { lazy } from "react";

export default function App() {
  const Hourly = lazy(() => import("./pages/Hourly"));
  const WorldMap = lazy(() => import("./pages/WorldMap"));

  return (
    <main className="min-h-screen p-8">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/forecast" element={<Forecast />} />

          <Route path="hourly" element={<Hourly />} />

          <Route path="details" element={<Details />} />

          <Route path="search" element={<Search />} />

          <Route path="locations" element={<Locations />} />

          <Route path="map" element={<WorldMap />} />

          <Route path="air-quality" element={<AirQuality />} />

          <Route path="alerts" element={<Alerts />} />

          <Route path="settings" element={<Settings />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </main>
  );
}
