/* eslint-disable react-hooks/static-components */
import { Routes, Route } from "react-router";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Placeholder from "./pages/Placeholder";
import Forecast from "./pages/Forecast";
import Details from "./pages/Details";
import Search from "./pages/Search";
import { lazy } from "react";

export default function App() {
  const Hourly = lazy(() => import("./pages/Hourly"));

  return (
    <main className="min-h-screen p-8">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="hourly" element={<Hourly />} />
          <Route path="details" element={<Details />} />
          <Route path="search" element={<Search />} />
          <Route
            path="/locations"
            element={<Placeholder title="Locations" />}
          />
          <Route path="/map" element={<Placeholder title="Map" />} />
          <Route
            path="/air-quality"
            element={<Placeholder title="Air Quality" />}
          />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
          <Route path="*" element={<Placeholder title="Page Not Found" />} />
        </Route>
      </Routes>
    </main>
  );
}
