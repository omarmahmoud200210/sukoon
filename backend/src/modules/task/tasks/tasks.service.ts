import TaskRepository from "./tasks.repository.js";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../../../types/api.types.js";


class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async getAllCompletedTasks(userId: number) {
    return await this.taskRepository.getAllCompletedTasks(userId);
  }

  async getAllUncompletedTasks(userId: number) {
    return await this.taskRepository.getAllUncompletedTasks(userId);
  }

  async getTodaysTasks(userId: number, status?: "pending" | "completed" | "all") {
    return await this.taskRepository.getTodaysTasks(userId, status);
  }

  async getUpcomingTasks(userId: number, status?: "pending" | "completed" | "all") {
    return await this.taskRepository.getUpcomingTasks(userId, status);
  }

  async getOverdueTasks(userId: number) {
    return await this.taskRepository.getOverdueTasks(userId);
  }

  async getTasksByList(userId: number, listId: number, status?: "pending" | "completed" | "all") {
    return await this.taskRepository.getTasksByList(userId, listId, status);
  }

  async getTasksByTag(userId: number, tagId: number, status?: "pending" | "completed" | "all") {
    return await this.taskRepository.getTasksByTag(userId, tagId, status);
  }

  async getTaskById(id: string, userId: number) {
    return await this.taskRepository.getTaskById(id, userId);
  }

  async createTask(taskData: CreateTaskRequest, userId: number) {
    return await this.taskRepository.createTask(userId, taskData);
  }

  async updateTask(id: string, taskData: UpdateTaskRequest, userId: number) {
    return await this.taskRepository.updateTask(id, taskData, userId);
  }

  async deleteTask(id: string, userId: number) {
    return await this.taskRepository.deleteTask(id, userId);
  }

  async getAllTrashTasks(userId: number) {
    return await this.taskRepository.getAllTrashTasks(userId);
  }

  async deleteTrashTask(id: string, userId: number) {
    return await this.taskRepository.deleteTrashTask(id, userId);
  }

  async restoreTask(id: string, userId: number) {
    return await this.taskRepository.restoreTask(id, userId);
  }

  async deleteAllTasks() {
    return await this.taskRepository.deleteAllTasks();
  }
}

export default TaskService;
