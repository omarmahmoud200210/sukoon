import { api } from "@/lib/api";
import type {
  PomodoroSession,
  PomodoroTask,
  PomodoroTaskType,
  PomodoroTaskUpdateType,
  StartSessionPayload,
  PomodoroHistory,
} from "@/types/timer";

const API_URL = "/pomodoro";

// 1. Pomodoro Timer Tasks API
const getAllPomodoroTasks = async (): Promise<PomodoroTask[]> => {
  const { data } = await api.get<PomodoroTask[]>(`${API_URL}/tasks`);
  return data;
};

const getPomodoroTaskById = async (id: string) => {
  const { data } = await api.get(`${API_URL}/tasks/${id}`);
  return data;
};

const getPomodoroAvailableTasks = async () => {
  const { data } = await api.get(`${API_URL}/tasks/available`);
  return data;
};

const createPomodoroTask = async (task: PomodoroTaskType) => {
  const { data } = await api.post(`${API_URL}/tasks`, task);
  return data;
};

const updatePomodoroTask = async (task: PomodoroTaskUpdateType) => {
  const { data } = await api.patch(`${API_URL}/tasks/${task.id}`, task);
  return data;
};

const deletePomodoroTask = async (id: string) => {
  const { data } = await api.delete(`${API_URL}/tasks/${id}`);
  return data;
};

// Statistics
const getPomdoroTaskStatistics = async () => {
  const { data } = await api.get(`${API_URL}/stats`);
  return data;
};

// 2. Sessions API
const startSession = async (payload: StartSessionPayload): Promise<PomodoroSession> => {
  const { data } = await api.post(`${API_URL}/session/start`, payload);
  return data;
};

const togglePauseSession = async (): Promise<PomodoroSession> => {
  const { data } = await api.patch(`${API_URL}/session/pause-toggle`);
  return data;
};

const completeSession = async (): Promise<PomodoroSession> => {
  const { data } = await api.patch(`${API_URL}/session/complete`);
  return data;
};

const endAndSaveSession = async (payload: { id: number, duration: number, endedAt: number }): Promise<PomodoroSession> => {
  const { data } = await api.patch(`${API_URL}/session/end-and-save`, payload);
  return data;
};

const resetSession = async (): Promise<void> => {
  await api.delete(`${API_URL}/session/reset`);
};

const deletePomodoroSession = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/session/${id}`);
};

const getActiveSession = async (): Promise<PomodoroSession | null> => {
  const { data } = await api.get(`${API_URL}/session/active`);
  return data;
};

const getAllSessions = async (): Promise<PomodoroSession[]> => {
  const { data } = await api.get(`${API_URL}/session`);
  return data;
};

const getPomodoroHistory = async (): Promise<PomodoroHistory[]> => {
  const { data } = await api.get<PomodoroHistory[]>(`${API_URL}/session/history`);
  return data;
};

const getTaskStatistics = async (id: string) => {
  const { data } = await api.get(`${API_URL}/session/task/${id}/stats`);
  return data;
}

export {
  getAllPomodoroTasks,
  getPomodoroTaskById,
  getPomodoroAvailableTasks,
  createPomodoroTask,
  updatePomodoroTask,
  deletePomodoroTask,
  getPomdoroTaskStatistics,
  startSession,
  togglePauseSession,
  completeSession,
  resetSession,
  getActiveSession,
  getAllSessions,
  getPomodoroHistory,
  getTaskStatistics,
  deletePomodoroSession,
  endAndSaveSession,
};
