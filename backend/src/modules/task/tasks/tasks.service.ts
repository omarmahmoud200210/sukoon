import TaskRepository from "./tasks.repository.js";
import type {
  PaginatedResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../../../types/api.types.js";
import type { Task } from "@prisma/client";

class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  private cursorPaginate(tasks: Task[], limit: number) {
    const hasNextPage = tasks.length === limit;
    const results = tasks;

    return {
      data: results,
      nextCursor: hasNextPage ? results[results.length - 1]!.id : null,
      hasNextPage,
    };
  }

  async getAllCompletedTasks(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<PaginatedResponse<Task>> {
    const tasks = await this.taskRepository.getAllCompletedTasks(
      userId,
      cursor,
      limit,
    );

    return this.cursorPaginate(tasks, limit);
  }

  async getAllUncompletedTasks(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<PaginatedResponse<Task>> {
    const tasks = await this.taskRepository.getAllUncompletedTasks(
      userId,
      cursor,
      limit,
    );

    return this.cursorPaginate(tasks, limit);
  }

  async getTodaysTasks(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<PaginatedResponse<Task>> {
    const tasks = await this.taskRepository.getTodaysTasks(
      userId,
      cursor,
      limit,
    );

    return this.cursorPaginate(tasks, limit);
  }

  async getUpcomingTasks(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<PaginatedResponse<Task>> {
    const tasks = await this.taskRepository.getUpcomingTasks(
      userId,
      cursor,
      limit,
    );

    return this.cursorPaginate(tasks, limit);
  }

  async getOverdueTasks(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<PaginatedResponse<Task>> {
    const tasks = await this.taskRepository.getOverdueTasks(
      userId,
      cursor,
      limit,
    );

    return this.cursorPaginate(tasks, limit);
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

  async getAllTrashTasks(
    userId: number,
    cursor?: number,
    limit: number = 10,
  ): Promise<PaginatedResponse<Task>> {
    const tasks = await this.taskRepository.getAllTrashTasks(
      userId,
      cursor,
      limit,
    );

    return this.cursorPaginate(tasks, limit);
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
