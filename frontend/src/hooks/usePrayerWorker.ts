import { useEffect, useRef, useState } from "react";
import PrayerWorker from "@/workers/prayer.worker.ts?worker";
import type { PrayerTimings } from "@/types/prayer";
import { convertTimingsToTimestamps } from "@/lib/prayerUtils";

const PRAYER_KEYS: (keyof PrayerTimings)[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

export function usePrayerWorker(allTimings: PrayerTimings | null) {
  const workerRef = useRef<Worker | null>(null);
  const [reminderPrayer, setReminderPrayer] = useState<string | null>(null);
  const [prayerArrived, setPrayerArrived] = useState<string | null>(null);

  useEffect(() => {
    if (!allTimings) return;

    const worker = new PrayerWorker();
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, prayerName } = e.data;
      if (type === "prayer") {
        setPrayerArrived(prayerName);
      }
      if (type === "prayer_reminder") {
        setReminderPrayer(prayerName);
      }
    };

    const filteredTimings: Record<string, string> = {};
    for (const key of PRAYER_KEYS) {
      filteredTimings[key] = allTimings[key];
    }

    const prayersTiming = convertTimingsToTimestamps(filteredTimings);
    worker.postMessage({ type: "start", prayers: prayersTiming });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [allTimings]);

  const clearReminderPrayer = () => setReminderPrayer(null);
  const clearPrayerArrived = () => setPrayerArrived(null);

  return {
    reminderPrayer,
    prayerArrived,
    clearReminderPrayer,
    clearPrayerArrived,
  };
}
