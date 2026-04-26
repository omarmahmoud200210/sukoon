import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import timerWorker from "@/workers/timerWorkerSingleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  useActivePomodoroSession,
  useStartPomodoroSession,
  useTogglePausePomodoroSession,
  useCompletePomodoroSession,
  useResetPomodoroSession,
  pomodoroSessionsKeys,
  pomodoroTasksKeys,
} from "@/hooks/useTimer";
import { useUIStore } from "@/store/uiStore";
import setupSuccessNotification from "@/lib/notifications";
import sound from "@/sound/notification.mp3";
import logger from "@/lib/logger";

export default function useTimerControls() {
  const { data: activeSession, isLoading: isActiveSessionLoading } =
    useActivePomodoroSession();
  const startSession = useStartPomodoroSession();
  const togglePauseSession = useTogglePausePomodoroSession();
  const completeSession = useCompletePomodoroSession();
  const resetSession = useResetPomodoroSession();

  const isActive = useUIStore((s) => s.isActive);
  const setIsActive = useUIStore((s) => s.setIsActive);
  const timeLeft = useUIStore((s) => s.timeLeft);
  const setTimeLeft = useUIStore((s) => s.setTimeLeft);
  const mode = useUIStore((s) => s.mode);
  const setMode = useUIStore((s) => s.setMode);

  const endTimestamp = useUIStore((s) => s.endTimestamp);
  const setEndTimestamp = useUIStore((s) => s.setEndTimestamp);
  const prevSessionIdRef = useRef<string | number | undefined>(
    activeSession?.id,
  );
  const sessionCount = activeSession?.sessionCount ?? 0;
  const queryClient = useQueryClient();
  const manualActiveTask = useUIStore((s) => s.manualActiveTask);

  const setIsTimerFinishedNaturally = useUIStore((s) => s.setIsTimerFinishedNaturally);

  const onComplete = useCallback(() => {
    timerWorker.postMessage({ type: "stop" });
    setEndTimestamp(null);

    setIsActive(false);

    if (mode === "work") {
      completeSession.mutate();

      const nextSessionCount = sessionCount + 1;

      if (nextSessionCount % 4 === 0) {
        setMode("long_break");
        setTimeLeft(15 * 60);
      } else {
        setMode("short_break");
        setTimeLeft(5 * 60);
      }

      queryClient.invalidateQueries({
        queryKey: pomodoroTasksKeys.taskStatistics(
          String(activeSession?.taskId),
        ),
      });
      queryClient.invalidateQueries({ queryKey: pomodoroTasksKeys.statistics });
      queryClient.invalidateQueries({ queryKey: pomodoroSessionsKeys.history });
      queryClient.invalidateQueries({
        queryKey: pomodoroSessionsKeys.activeSession,
      });
      queryClient.invalidateQueries({
        queryKey: pomodoroTasksKeys.taskStatistics(
          String(activeSession?.pomodoroTaskId),
        ),
      });
    } else {
      setMode("work");
      const taskDuration = manualActiveTask?.duration ?? 25;
      setTimeLeft(taskDuration * 60);
    }
    
    setIsTimerFinishedNaturally(true);
  }, [
    mode,
    sessionCount,
    queryClient,
    activeSession,
    completeSession,
    manualActiveTask,
    setIsActive,
    setMode,
    setTimeLeft,
    setEndTimestamp,
    setIsTimerFinishedNaturally,
  ]);

  function triggerSessionCompleteAlert(title: string, body: string) {
    const alertSound = new Audio(sound);

    alertSound.play().catch((error) => {
      logger.info("Audio blocked by browser autoplay rules:", error);
    });

    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body });
      } catch (error) {
        logger.error("Failed to create notification:", error);
      }
    }
  }

  useLayoutEffect(() => {
    if (
      activeSession &&
      activeSession.id !== prevSessionIdRef.current &&
      !isActiveSessionLoading
    ) {
      prevSessionIdRef.current = activeSession.id;

      if (activeSession.isPaused) {
        const elapsedMs =
          new Date(activeSession.endedAt).getTime() -
          new Date(activeSession.startedAt).getTime();
        const remainingMs = activeSession.duration * 60 * 1000 - elapsedMs;
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

        setTimeLeft(remainingSeconds);
        setIsActive(false);
        setMode("work");
      } else {
        const endedAt = new Date(activeSession.endedAt).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endedAt - now) / 1000));

        if (remaining > 0) {
          setTimeLeft(remaining);
          setIsActive(true);
          setEndTimestamp(endedAt);
          setMode("work");
        } else {
          onComplete();
        }
      }
    }
  }, [
    activeSession,
    isActiveSessionLoading,
    onComplete,
    setTimeLeft,
    setIsActive,
    setMode,
    setEndTimestamp,
  ]);

  useEffect(() => {
    if (!isActive || !endTimestamp) return;
    const handleMessage = (e: MessageEvent) => {
      const { type, remaining } = e.data;
      if (type === "tick") {
        setTimeLeft(remaining);
      }
      if (type === "complete") {
        onComplete();
      }
    };
    timerWorker.addEventListener("message", handleMessage);
    timerWorker.postMessage({ type: "start", endTimestamp });
    return () => {
      timerWorker.removeEventListener("message", handleMessage);
    };
  }, [isActive, endTimestamp, onComplete, setTimeLeft]);

  useEffect(() => {
    setupSuccessNotification();
  }, []);

  const start = (
    durationInMinutes: number,
    id?: number | string | null,
    isPomodoroTask: boolean = true,
  ) => {
    setIsActive(true);

    const durationInSeconds = durationInMinutes * 60;
    setEndTimestamp(Date.now() + durationInSeconds * 1000);
    setTimeLeft(durationInSeconds);
    setMode("work");

    startSession.mutate({
      duration: durationInMinutes,
      taskId: !isPomodoroTask && id ? Number(id) : undefined,
      pomodoroTaskId: isPomodoroTask && id ? Number(id) : undefined,
      sessionCount,
    });
  };

  const pause = () => {
    setIsActive(false);
    if (mode === "work") {
      togglePauseSession.mutate();
    }
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(0);
    setEndTimestamp(null);
    setMode("work");

    if (mode === "work") {
      resetSession.mutate();
    }
  };

  const resume = () => {
    if (isActive) return;

    setIsActive(true);
    setEndTimestamp(Date.now() + timeLeft * 1000);
    if (mode === "work") {
      togglePauseSession.mutate();
    }
  };

  const complete = () => {
    onComplete();
  };

  const startBreak = (durationInMinutes: number) => {
    setIsActive(true);
    const durationInSeconds = durationInMinutes * 60;
    setEndTimestamp(Date.now() + durationInSeconds * 1000);
    setTimeLeft(durationInSeconds);
  };

  return {
    start,
    startBreak,
    pause,
    reset,
    resume,
    complete,
    isActive,
    timeLeft,
    mode,
    sessionCount,
    activeSession,
    isActiveSessionLoading,
    triggerSessionCompleteAlert,
  };
}
