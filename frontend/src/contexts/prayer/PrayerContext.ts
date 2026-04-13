import { createContext, useContext } from "react";
import type { PrayerTimings, HijriDate, GregorianDate } from "@/types/prayer";

export interface NextPrayerInfo {
  name: string;
  time: string;
}

export interface PrayerContextType {
  nextPrayer: NextPrayerInfo | null;
  allTimings: PrayerTimings | null;
  hijriDate: HijriDate | null;
  gregorianDate: GregorianDate | null;
  isLoading: boolean;
  isError: boolean;
  reminderPrayer: string | null;
  prayerArrived: string | null;
  countdown: { hours: number; minutes: number; seconds: number } | null;
  prayerMessage: string | null;
  formatTo12Hour: (time: string) => string;
}

export const PrayerContext = createContext<PrayerContextType | null>(null);

export function usePrayerContext() {
  const ctx = useContext(PrayerContext);
  if (!ctx) {
    throw new Error("usePrayerContext must be used within PrayerProvider");
  }
  return ctx;
}
