import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import useTimerControls from "@/hooks/useTimerControls";
import type { PomodoroTask } from "@/types/timer";
import CustomTimerToast from "./CustomTimerToast";
import { useUIStore } from "@/store/uiStore";

export default function useNotifications(
  currentActiveTask: PomodoroTask | null | undefined,
  { mode, isActive, start, startBreak, triggerSessionCompleteAlert }: ReturnType<typeof useTimerControls>
) {
  const lastModeRef = useRef(mode);
  const { t } = useTranslation();
  const isTimerFinishedNaturally = useUIStore((s) => s.isTimerFinishedNaturally);
  const setIsTimerFinishedNaturally = useUIStore((s) => s.setIsTimerFinishedNaturally);

  useEffect(() => {
    if (lastModeRef.current !== mode) {
      lastModeRef.current = mode;

      if (isTimerFinishedNaturally) {
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
                        startBreak(mode === "short_break" ? 5 : 15),
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
        
        setIsTimerFinishedNaturally(false);
      }
    }
  }, [mode, isActive, currentActiveTask, start, t, triggerSessionCompleteAlert, isTimerFinishedNaturally, setIsTimerFinishedNaturally, startBreak]);
}
