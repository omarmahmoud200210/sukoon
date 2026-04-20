import { api } from "@/lib/api";
import type { CreateTask, UpdateTask } from "@/types/tasks";

const API_URL = "/tasks";

const getPendingTasks = async () => {
  const { data } = await api.get(`${API_URL}/pending`);
  return data;
};

const getCompletedTasks = async () => {
  const { data } = await api.get(`${API_URL}/completed`);
  return data;
};

const getTasksByList = async (
  listId: string | number,
  status?: "pending" | "completed" | "all",
) => {
  const params = status ? `?status=${status}` : "";
  const { data } = await api.get(`${API_URL}/list/${listId}${params}`);
  return data;
};

const getTasksByTag = async (
  tagId: string | number,
  status?: "pending" | "completed" | "all",
) => {
  const params = status ? `?status=${status}` : "";
  const { data } = await api.get(`${API_URL}/tag/${tagId}${params}`);
  return data;
};

const getTodayTasks = async (status?: "pending" | "completed" | "all") => {
  const params = status ? `?status=${status}` : "";
  const { data } = await api.get(`${API_URL}/today${params}`);
  return data;
};

const getUpcomingTasks = async (status?: "pending" | "completed" | "all") => {
  const params = status ? `?status=${status}` : "";
  const { data } = await api.get(`${API_URL}/upcoming${params}`);
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
  if (taskData.listId) {
    const { data } = await api.post(
      `${API_URL}/list/${taskData.listId}`,
      taskData,
    );
    return data;
  }

  if (taskData.tagIds && taskData.tagIds.length > 0) {
    const primaryTagId = taskData.tagIds[0];
    const { data } = await api.post(`${API_URL}/tag/${primaryTagId}`, taskData);
    return data;
  }

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

const createTodayTask = async (taskData: CreateTask) => {
  const { data } = await api.post(`${API_URL}/today`, taskData);
  return data;
};

const createUpcomingTask = async (taskData: CreateTask) => {
  const { data } = await api.post(`${API_URL}/upcoming`, taskData);
  return data;
};

export {
  getPendingTasks,
  getCompletedTasks,
  getTasksByList,
  getTasksByTag,
  getTodayTasks,
  getUpcomingTasks,
  getOverdueTasks,
  getTaskById,
  createTask,
  createTodayTask,
  createUpcomingTask,
  updateTask,
  deleteTask,
  getTrashTasks,
  deleteTrashTask,
  restoreTrashTask,
};
