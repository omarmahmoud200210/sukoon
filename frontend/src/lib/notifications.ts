import logger from "@/lib/logger";

export default function setupSuccessNotification() {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        logger.info("Notification permission granted");
      }
    });
  }
}