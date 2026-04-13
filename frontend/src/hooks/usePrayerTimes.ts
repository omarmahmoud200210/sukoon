import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrayerTimesByCoords, getNextPrayer } from "@/services/aladhanService";

export const prayerTimesKeys = {
  all: ["prayerTimes"] as const,
  byCoords: (latitude: number, longitude: number) =>
    [...prayerTimesKeys.all, latitude, longitude] as const,
};

export function useNextPrayerByCoords(
  latitude: number,
  longitude: number,
  method = 5,
  enabled = true,
) {
  const {
    data: prayerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: prayerTimesKeys.byCoords(latitude, longitude),
    queryFn: () => getPrayerTimesByCoords(latitude, longitude, method),
    enabled: enabled && !!latitude && !!longitude,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const nextPrayerRaw = prayerData ? getNextPrayer(prayerData.timings) : null;
  const nextPrayer = useMemo(
    () => nextPrayerRaw,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextPrayerRaw?.name, nextPrayerRaw?.time, tick],
  );

  return {
    nextPrayer,
    allTimings: prayerData?.timings ?? null,
    hijriDate: prayerData?.date.hijri ?? null,
    gregorianDate: prayerData?.date.gregorian ?? null,
    isLoading,
    isError,
  };
}
