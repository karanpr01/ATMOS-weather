# ATMOS

A fast, responsive weather app built with React, Tailwind CSS and Open-Meteo.
Live conditions, hourly and 7-day forecasts, air quality, saved cities and a
world map, with light and dark themes.

> Status: in development (Day 2 of 5 complete).

## Features (so far)
- Live current weather for Mumbai from the Open-Meteo API
- Responsive layout: sidebar on desktop, bottom navigation on mobile
- Light, dark and system themes that remember your choice
- Loading and error states
- Keyboard-friendly navigation with a skip link
- Dashboard with hero, stats row and hourly forecast
- °C / °F units that are remembered
- Skeleton loading, error with retry, and offline states
- 7-day forecast with temperature range bars and day details
- Hourly forecast with temperature curve and rain chance chart
- Weather details: wind compass, UV scale, sun arc, pressure trend
- City search with debounce, saved locations and a default city
- Use current location, with a permission-denied state
- Air quality screen with AQI scale and pollutants
- Generated weather alerts with clear severity labels
- Settings: theme, units, notification preferences and accessibility options

## Tech stack
- React + Vite
- Tailwind CSS v4
- React Router
- Open-Meteo API (free, no key needed)
- Lucide icons, Fontsource (Manrope)

## Run it locally
```bash
git clone https://github.com/YOUR-USERNAME/atmos-weather.git
cd atmos-weather
npm install
npm run dev
```

## Roadmap
- [X] Day 1: setup, theme, layout, first live data
- [X] Day 2: dashboard, data layer 
- [X] Day 3: forecast, hourly, details
- [X] Day 4: search, saved cities, air quality, settings
- [ ] Day 5: map, motion, polish, deploy

