import { useQuery } from "@tanstack/react-query";
import { getAirQuality } from "../lib/api";

export function useAirQuality(location) {
  return useQuery({
    queryKey: ["air", location.latitude, location.longitude],
    queryFn: () => getAirQuality(location.latitude, location.longitude),
    staleTime: 30 * 60 * 1000,
  });
}