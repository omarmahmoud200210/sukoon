import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import TimerWorker from "@/workers/timer.worker.ts?worker";
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

  const endTimeRef = useRef<number | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const prevSessionIdRef = useRef<string | number | undefined>(
    activeSession?.id,
  );

  const sessionCount = activeSession?.sessionCount ?? 0;

  const queryClient = useQueryClient();

  const onComplete = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    setIsActive(false);
    completeSession.mutate();

    if (mode === "work") {
      const nextSessionCount = sessionCount + 1;

      if (nextSessionCount % 4 === 0) {
        setMode("long_break");
        setTimeLeft(15 * 60);
      } else {
        setMode("short_break");
        setTimeLeft(5 * 60);
      }
    } else {
      setMode("work");
      setTimeLeft(25 * 60);
    }

    const taskId = activeSession?.pomodoroTaskId || activeSession?.taskId;

    if (taskId) {
      queryClient.invalidateQueries({
        queryKey: pomodoroTasksKeys.taskStatistics(String(taskId)),
      });
    }

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
  }, [
    mode,
    sessionCount,
    queryClient,
    activeSession,
    completeSession,
    setIsActive,
    setMode,
    setTimeLeft,
  ]);

  function triggerSessionCompleteAlert(title: string, body: string) {
    const alertSound = new Audio(sound);

    alertSound.play().catch((error) => {
      logger.info("Audio blocked by browser autoplay rules:", error);
    });

    if (Notification.permission === "granted") {
      new Notification(title, { body });
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
          endTimeRef.current = endedAt;
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
  ]);

  useEffect(() => {
    if (!isActive || !endTimeRef.current) return;

    const worker = new TimerWorker();
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, remaining } = e.data;

      if (type === "tick") {
        setTimeLeft(remaining);
      }

      if (type === "complete") {
        onComplete();
      }
    };

    worker.postMessage({
      type: "start",
      endTimestamp: endTimeRef.current,
    });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [isActive, mode, sessionCount, onComplete, setTimeLeft]);

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
    endTimeRef.current = Date.now() + durationInSeconds * 1000;
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
    endTimeRef.current = null;
    setMode("work");

    if (mode === "work") {
      resetSession.mutate();
    }
  };

  const resume = () => {
    if (isActive) return;

    setIsActive(true);
    endTimeRef.current = Date.now() + timeLeft * 1000;
    if (mode === "work") {
      togglePauseSession.mutate();
    }
  };

  const complete = () => {
    onComplete();
  };

  return {
    start,
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
