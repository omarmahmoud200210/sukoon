import { api } from "@/lib/api";
import type { CreateTask, UpdateTask } from "@/types/tasks";

const API_URL = "/tasks";

const getAllTasks = async (cursor?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor.toString());
  if (limit) params.append("limit", limit.toString());

  const { data } = await api.get(`${API_URL}?${params.toString()}`);
  return data;
};

const getTodayTasks = async () => {
  const { data } = await api.get(`${API_URL}/today`);
  return data;
};

const getUpcomingTasks = async () => {
  const { data } = await api.get(`${API_URL}/upcoming`);
  return data;
};

const getOverdueTasks = async () => {
  const { data } = await api.get(`${API_URL}/overdue`);
  return data;
};

const getTaskById = async (id: string) => {
  const { data } = await api.get(`${API_URL}/${id}`);
  return data;
};

const createTask = async (taskData: CreateTask) => {
  const { data } = await api.post(API_URL, taskData);
  return data;
};

const updateTask = async (id: string, taskData: UpdateTask) => {
  const { data } = await api.put(`${API_URL}/${id}`, taskData);
  return data;
};

const deleteTask = async (id: string) => {
  const { data } = await api.delete(`${API_URL}/${id}`);
  return data;
};

const getTrashTasks = async () => {
  const { data } = await api.get(`${API_URL}/trash`);
  return data;
};

const deleteTrashTask = async (id: string) => {
  const { data } = await api.delete(`${API_URL}/trash/${id}`);
  return data;
};

const restoreTrashTask = async (id: string) => {
  const { data } = await api.post(`${API_URL}/trash/${id}/restore`);
  return data;
};

export {
  getAllTasks,
  getTodayTasks,
  getUpcomingTasks,
  getOverdueTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTrashTasks,
  deleteTrashTask,
  restoreTrashTask,
};
