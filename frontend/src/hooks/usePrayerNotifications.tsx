import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import CustomPrayerToast from "@/components/features/prayer/CustomPrayerToast";
import sound from "@/sound/notification.mp3";

export default function usePrayerNotifications(
  reminderPrayer: string | null,
  prayerArrived: string | null,
  clearReminderPrayer: () => void,
  clearPrayerArrived: () => void,
) {
  const { t } = useTranslation();

  const playPrayerSound = useCallback(() => {
    const alertSound = new Audio(sound);
    alertSound.play().catch(() => {});
  }, []);

  const triggerSessionPrayerAlert = useCallback(
    (title: string, body: string) => {
      playPrayerSound();
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      }
    },
    [playPrayerSound],
  );

  useEffect(() => {
    if (!reminderPrayer) return;
    toast.custom(
      (tId) => (
        <CustomPrayerToast
          id={tId}
          title={t("prayer.reminder.title", { name: reminderPrayer })}
          description={t("prayer.reminder.description", {
            name: reminderPrayer,
          })}
          isReminder={true}
        />
      ),
      { duration: 8000 },
    );
    playPrayerSound();
    clearReminderPrayer();
  }, [reminderPrayer, t, playPrayerSound, clearReminderPrayer]);

  useEffect(() => {
    if (!prayerArrived) return;
    toast.custom(
      (tId) => (
        <CustomPrayerToast
          id={tId}
          title={t("prayer.notification.title", { name: prayerArrived })}
          description={t("prayer.notification.body", { name: prayerArrived })}
          isReminder={false}
        />
      ),
      { duration: 10000 },
    );
    triggerSessionPrayerAlert(
      t("prayer.notification.title", { name: prayerArrived }),
      t("prayer.notification.body", { name: prayerArrived }),
    );
    clearPrayerArrived();
  }, [prayerArrived, t, triggerSessionPrayerAlert, clearPrayerArrived]);
}
