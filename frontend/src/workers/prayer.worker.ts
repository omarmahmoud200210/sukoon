let intervalId: ReturnType<typeof setInterval> | null = null;

const firedPrayers = new Set<string>();
const remindedPrayers = new Set<string>();

self.onmessage = (e: MessageEvent) => {
  const { type, prayers } = e.data as {
    type: string;
    prayers: Record<string, number>;
  };
  const reminderTime = 5 * 60 * 1000;

  if (type === "start" && prayers) {
    if (intervalId) clearInterval(intervalId);

    firedPrayers.clear();
    remindedPrayers.clear();

    // Skip prayers that have already passed so they don't fire on startup
    const nowInit = Date.now();
    for (const [prayerName, prayerTime] of Object.entries(prayers)) {
      if (nowInit >= prayerTime) {
        firedPrayers.add(prayerName);
      }
      if (nowInit >= prayerTime - reminderTime) {
        remindedPrayers.add(prayerName);
      }
    }

    intervalId = setInterval(() => {
      const now = Date.now();

      for (const [prayerName, prayerTime] of Object.entries(prayers)) {
        if (!firedPrayers.has(prayerName) && now >= prayerTime) {
          firedPrayers.add(prayerName);
          self.postMessage({ type: "prayer", prayerName });
        }

        if (
          !remindedPrayers.has(prayerName) &&
          now >= prayerTime - reminderTime
        ) {
          remindedPrayers.add(prayerName);
          self.postMessage({ type: "prayer_reminder", prayerName });
        }
      }

      if (firedPrayers.size === Object.keys(prayers).length) {
        clearInterval(intervalId!);
        intervalId = null;
      }
    }, 10_000);
  }

  if (type === "stop") {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    firedPrayers.clear();
    remindedPrayers.clear();
  }
};
