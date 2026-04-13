export type PomodoroTask = {
  id: number | string;
  title: string;
  duration: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PomodoroTaskType = {
  title: string;
  duration?: number;
};

export type PomodoroTaskUpdateType = {
  id: string;
  title?: string;
  duration?: number;
  isArchived?: boolean;
};

export type PomodoroSession = {
  id: number | string;
  taskId?: number | string;
  pomodoroTaskId?: number | string;
  startedAt: string;
  endedAt: string;
  duration: number;
  sessionCount: number;
  timezoneOffset: number;
  isPaused: boolean;
  isCompleted: boolean;
};

export type StartSessionPayload = {
  taskId?: number;
  pomodoroTaskId?: number;
  duration: number;
  sessionCount?: number;
};

export type PomodoroHistory = PomodoroTask & {
  pomodoroSessions: PomodoroSession[];
};
