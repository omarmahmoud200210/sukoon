import { api } from "@/lib/api";
import type {
  SubtaskData,
  DeleteSubTask,
  UpdateSubTask,
} from "@/types/subtasks";

const API_URL = "/subtasks";

const getAllSubTasks = async (taskId: string) => {
  const { data } = await api.get(`${API_URL}/${taskId}`);
  return data;
};

const createSubtask = async (subtaskData: SubtaskData) => {
  const { data } = await api.post(`${API_URL}/`, subtaskData);
  return data;
};

const updateSubtasks = async (subtaskData: UpdateSubTask) => {
  const { data } = await api.put(
    `${API_URL}/${subtaskData.taskId}/${subtaskData.subTaskId}`,
    subtaskData,
  );
  return data;
};

const deleteSubtask = async (subtaskData: DeleteSubTask) => {
  const { data } = await api.delete(
    `${API_URL}/${subtaskData.taskId}/${subtaskData.subTaskId}`,
  );
  return data;
};

export { getAllSubTasks, createSubtask, updateSubtasks, deleteSubtask };
