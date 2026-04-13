import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as timerService from "@/services/timerService";
import {
  onCreatePomodoroTaskError,
  onUpdatePomodoroTaskError,
  onDeletePomodoroTaskError,
} from "@/errors/pomodoroTasks.errors";
import {
  onStartSessionError,
  onPauseSessionError,
  onCompleteSessionError,
  onResetSessionError,
} from "@/errors/pomodoroSessions.errors";

export const pomodoroTasksKeys = {
  all: ["pomodoro-tasks"],
  allTasks: ["pomodoro-tasks", "all"],
  availableTasks: ["pomodoro-tasks", "available"],
  task: (id: string) => ["pomodoro-tasks", "task", id],
  taskStatistics: (id: string) => ["pomodoro-tasks", "task", id, "statistics"],
  statistics: ["pomodoro-tasks", "statistics"],
};

export const pomodoroSessionsKeys = {
  all: ["pomodoro-sessions"],
  allSessions: ["pomodoro-sessions", "all"],
  activeSession: ["pomodoro-sessions", "active"],
  history: ["pomodoro-sessions", "history"],
  session: (id: string) => ["pomodoro-sessions", "session", id],
};

// ... existing hooks ...

export const usePomodoroHistory = () => {
  return useQuery({
    queryKey: pomodoroSessionsKeys.history,
    queryFn: timerService.getPomodoroHistory,
  });
};

// 1. Pomodoro Tasks Hooks
export const usePomodoroTasks = () => {
  return useQuery({
    queryKey: pomodoroTasksKeys.allTasks,
    queryFn: timerService.getAllPomodoroTasks,
  });
};

export const usePomodoroTask = (id: string) => {
  return useQuery({
    queryKey: pomodoroTasksKeys.task(id),
    queryFn: () => timerService.getPomodoroTaskById(id),
  });
};

export const usePomodoroAvailableTasks = () => {
  return useQuery({
    queryKey: pomodoroTasksKeys.availableTasks,
    queryFn: timerService.getPomodoroAvailableTasks,
  });
};

export const useCreatePomodoroTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timerService.createPomodoroTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroTasksKeys.allTasks });
      queryClient.invalidateQueries({
        queryKey: pomodoroTasksKeys.availableTasks,
      });
    },
    onError: onCreatePomodoroTaskError,
  });
};

export const useUpdatePomodoroTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timerService.updatePomodoroTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pomodoroTasksKeys.allTasks });
      queryClient.invalidateQueries({
        queryKey: pomodoroTasksKeys.task(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: pomodoroTasksKeys.availableTasks,
      });
    },
    onError: onUpdatePomodoroTaskError,
  });
};

export const useDeletePomodoroTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timerService.deletePomodoroTask,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: pomodoroTasksKeys.allTasks });
      queryClient.invalidateQueries({ queryKey: pomodoroTasksKeys.task(id) });
      queryClient.invalidateQueries({
        queryKey: pomodoroTasksKeys.availableTasks,
      });
    },
    onError: onDeletePomodoroTaskError,
  });
};

export const usePomodoroTaskStatistics = () => {
  return useQuery({
    queryKey: pomodoroTasksKeys.statistics,
    queryFn: timerService.getPomdoroTaskStatistics,
  });
};

export const useTaskStatistics = (id: string) => {
  return useQuery({
    queryKey: pomodoroTasksKeys.taskStatistics(id),
    queryFn: () => timerService.getTaskStatistics(id),
    enabled: !!id,
  });
};

// 2. Pomodoro Sessions Hooks
export const usePomodoroSessions = () => {
  return useQuery({
    queryKey: pomodoroSessionsKeys.allSessions,
    queryFn: timerService.getAllSessions,
  });
};

export const useActivePomodoroSession = () => {
  return useQuery({
    queryKey: pomodoroSessionsKeys.activeSession,
    queryFn: timerService.getActiveSession,
  });
};

export const useStartPomodoroSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timerService.startSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroSessionsKeys.activeSession });
    },
    onError: onStartSessionError,
  });
};

export const useTogglePausePomodoroSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timerService.togglePauseSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroSessionsKeys.activeSession });
    },
    onError: onPauseSessionError,
  });
};

export const useCompletePomodoroSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timerService.completeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroSessionsKeys.activeSession });
      queryClient.invalidateQueries({ queryKey: pomodoroTasksKeys.statistics });
      queryClient.invalidateQueries({ queryKey: pomodoroSessionsKeys.history });
    },
    onError: onCompleteSessionError,
  });
};

export const useResetPomodoroSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timerService.resetSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroSessionsKeys.all });
      queryClient.invalidateQueries({ queryKey: pomodoroTasksKeys.statistics });
    },
    onError: onResetSessionError,
  });
};

export const useDeletePomdoroSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timerService.deletePomodoroSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroSessionsKeys.all });
      queryClient.invalidateQueries({ queryKey: pomodoroTasksKeys.statistics });
    },
    onError: onDeletePomodoroTaskError,
  });
}
