import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import useTimerControls from "@/hooks/useTimerControls";
import type { PomodoroTask } from "@/types/timer";
import CustomTimerToast from "./CustomTimerToast";

export default function useNotifications(
  currentActiveTask: PomodoroTask | null | undefined,
  { mode, isActive, start, triggerSessionCompleteAlert }: ReturnType<typeof useTimerControls>
) {
  const lastModeRef = useRef(mode);
  const { t } = useTranslation();

  useEffect(() => {
    if (lastModeRef.current !== mode) {
      lastModeRef.current = mode;

      if (!isActive && mode !== "work") {
        triggerSessionCompleteAlert(
          t("timer.notification.workComplete.title"),
          t("timer.notification.workComplete.body")
        );
        toast.custom((tId) => (
          <CustomTimerToast
            id={tId}
            title={t("timer.pomodoroComplete")}
            description={t("timer.timeForBreak")}
            isBreak={true}
            action={
              currentActiveTask
                ? {
                    label: t("timer.startBreak"),
                    onClick: () =>
                      start(currentActiveTask.duration || 25, currentActiveTask.id),
                  }
                : undefined
            }
          />
        ), { duration: 8000 });
      } else if (!isActive && mode === "work") {
        triggerSessionCompleteAlert(
          t("timer.notification.breakComplete.title"),
          t("timer.notification.breakComplete.body")
        );
        toast.custom((tId) => (
          <CustomTimerToast
            id={tId}
            title={t("timer.breakIsOver")}
            description={t("timer.readyToFocus")}
            isBreak={false}
            action={
              currentActiveTask
                ? {
                    label: t("timer.startFocus"),
                    onClick: () =>
                      start(currentActiveTask.duration || 25, currentActiveTask.id),
                  }
                : undefined
            }
          />
        ), { duration: 8000 });
      }
    }
  }, [mode, isActive, currentActiveTask, start, t, triggerSessionCompleteAlert]);
}
