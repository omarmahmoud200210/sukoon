import { useNextPrayerByCoords } from "@/hooks/usePrayerTimes";
import useGeolocation from "@/hooks/useGeolocation";
import { usePrayerWorker } from "@/hooks/usePrayerWorker";
import { usePrayerCountdown } from "@/hooks/usePrayerCountdown";
import usePrayerNotifications from "@/hooks/usePrayerNotifications";
import { formatTo12Hour } from "@/lib/prayerUtils";
import { PrayerContext } from "./PrayerContext";
import { Outlet } from "react-router-dom";
import type { PrayerContextType } from "./PrayerContext";

const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;

export default function PrayerProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { coords, isLoading: isLoadingCoords } = useGeolocation();

  const lat = coords?.lat ?? DEFAULT_LAT;
  const lng = coords?.lng ?? DEFAULT_LNG;

  const {
    nextPrayer,
    allTimings,
    hijriDate,
    gregorianDate,
    isLoading,
    isError,
  } = useNextPrayerByCoords(lat, lng, 5, !isLoadingCoords);

  const { reminderPrayer, prayerArrived, clearReminderPrayer, clearPrayerArrived } = usePrayerWorker(allTimings);
  const { countdown, prayerMessage } = usePrayerCountdown(nextPrayer);

  usePrayerNotifications(reminderPrayer, prayerArrived, clearReminderPrayer, clearPrayerArrived);

  const value: PrayerContextType = {
    nextPrayer,
    allTimings,
    hijriDate,
    gregorianDate,
    isLoading: isLoading || isLoadingCoords,
    isError,
    reminderPrayer,
    prayerArrived,
    countdown,
    prayerMessage,
    formatTo12Hour,
  };

  return (
    <PrayerContext.Provider value={value}>
      {children || <Outlet />}
    </PrayerContext.Provider>
  );
}
