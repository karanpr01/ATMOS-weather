import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import Placeholder from "./pages/Placeholder"

export default function App() {
  return (
    <main className="min-h-screen p-8">
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/forecast" element={<Placeholder title="Forecast" />}/>
        <Route path="/locations" element={<Placeholder title="Locations"/>}/>
        <Route path="/map" element={<Placeholder title="Map" />}/>
        <Route path="/air-quality" element={<Placeholder title="Air Quality" />}/>
        <Route path="/settings" element={<Placeholder title="Settings" />}/>
        <Route path="*" element={<Placeholder title="Page Not Found" />}/>
      </Routes>
    </main>
  )
}