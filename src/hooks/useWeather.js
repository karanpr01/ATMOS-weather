import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../lib/api";

export function useWeather(location) {
  return useQuery({
    queryKey: ["weather", location.latitude, location.longitude],
    queryFn: () => getWeather(location.latitude, location.longitude),
    staleTime: 10 * 60 * 1000,
  });
}