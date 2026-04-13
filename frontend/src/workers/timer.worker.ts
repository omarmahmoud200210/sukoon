let intervalId: ReturnType<typeof setInterval> | null = null;

self.onmessage = (e: MessageEvent) => {
  const { type, endTimestamp } = e.data;

  if (type === "start") {
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((endTimestamp - Date.now()) / 1000),
      );

      if (remaining <= 0) {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        self.postMessage({ type: "complete" });
      } else {
        self.postMessage({ type: "tick", remaining });
      }
    }, 1000);
  }

  if (type === "stop") {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }
};
