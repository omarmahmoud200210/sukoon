import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function usePrayerCountdown(nextPrayer: { name: string; time: string } | null) {
  const [countdown, setCountdown] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [prayerMessage, setPrayerMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!nextPrayer?.time) return;

    const updateCountdown = () => {
      const [hours, minutes] = nextPrayer.time.split(":").map(Number);
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0, 0);

      if (prayerDate.getTime() <= Date.now()) {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }

      const diff = prayerDate.getTime() - Date.now();

      if (diff <= 0) {
        setCountdown(null);
        setPrayerMessage(t("common.prayer_time_message", { name: nextPrayer.name }));
        setTimeout(() => {
          setPrayerMessage(null);
        }, 30_000);
      } else {
        setPrayerMessage(null);
        setCountdown({
          hours: Math.floor(diff / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextPrayer, t]);

  return { countdown, prayerMessage };
}
