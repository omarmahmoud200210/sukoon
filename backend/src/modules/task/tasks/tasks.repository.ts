import prisma from "../../../shared/database/prisma.js";
import type { Task } from "@prisma/client";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../../../types/api.types.js";
import { Prisma } from "@prisma/client";

class TaskRepository {
  private static readonly TASK_SELECT = {
    id: true,
    title: true,
    description: true,
    listId: true,
    priority: true,
    isCompleted: true,
    dueDate: true,
    createdAt: true,
    subTasks: {
      select: {
        id: true,
        title: true,
        isCompleted: true,
        taskId: true,
      },
    },
    tags: {
      include: {
        tag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };

  constructor() {}

  private transformTask(task: any) {
    if (!task) return task;
    const { subTasks, tags, ...rest } = task;
    return {
      ...rest,
      subtasks: subTasks,
      tags: tags?.map((t: any) => t.tag) || [],
    };
  }

  async getAllCompletedTasks(
    userId: number
  ): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: {
        isCompleted: true,
        userId,
        deletedAt: null,
        listId: null
      },
      orderBy: { id: "asc" },
      select: TaskRepository.TASK_SELECT,
    });

    return tasks.map((task) => this.transformTask(task)) as unknown as Task[];
  }

  async getAllUncompletedTasks(
    userId: number
  ) {
    const tasks = await prisma.task.findMany({
      where: {
        isCompleted: false,
        userId,
        deletedAt: null,
        listId: null
      },
      orderBy: { id: "asc" },
      select: TaskRepository.TASK_SELECT,
    });

    return tasks.map((task) => {
      const transformed = this.transformTask(task);
      return {
        ...transformed,
        isOverdue: this.checkIfOverdue(task as unknown as Task),
      };
    });
  }

  async getTodaysTasks(userId: number, status?: "pending" | "completed" | "all") {
    let isCompletedFilter: boolean | undefined = undefined;
    if (status === "pending") isCompletedFilter = false;
    if (status === "completed") isCompletedFilter = true;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(isCompletedFilter !== undefined && { isCompleted: isCompletedFilter }),
        listId: null
      },
      orderBy: [{ dueDate: "asc" }, { id: "asc" }],
      select: TaskRepository.TASK_SELECT,
    });

    return tasks.map((task) => {
      const transformed = this.transformTask(task);
      return {
        ...transformed,
        isOverdue: this.checkIfOverdue(task as unknown as Task),
      };
    });
  }

  async getUpcomingTasks(userId: number, status?: "pending" | "completed" | "all") {
    let isCompletedFilter: boolean | undefined = undefined;
    if (status === "pending") isCompletedFilter = false;
    if (status === "completed") isCompletedFilter = true;

    const startOfTomorrow = new Date();
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        dueDate: {
          gte: startOfTomorrow,
        },
        isCompleted: false,
        ...(isCompletedFilter !== undefined && { isCompleted: isCompletedFilter }),
        listId: null,
      },
      orderBy: [{ dueDate: "asc" }, { id: "asc" }],
      select: TaskRepository.TASK_SELECT,
    });

    return tasks.map((task) => this.transformTask(task));
  }

  async getOverdueTasks(userId: number) {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        dueDate: {
          lt: new Date(),
        },
        isCompleted: false,
      },
      orderBy: [{ dueDate: "asc" }, { id: "asc" }],
      select: TaskRepository.TASK_SELECT,
    });

    return tasks.map((task) => {
      const transformed = this.transformTask(task);
      return {
        ...transformed,
        isOverdue: this.checkIfOverdue(task as unknown as Task),
      };
    });
  }

  async getTasksByList(userId: number, listId: number, status?: "pending" | "completed" | "all") {
    let isCompletedFilter: boolean | undefined = undefined;
    if (status === "pending") isCompletedFilter = false;
    if (status === "completed") isCompletedFilter = true;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        listId,
        deletedAt: null,
        ...(isCompletedFilter !== undefined && { isCompleted: isCompletedFilter }),
      },
      orderBy: { id: "asc" },
      select: TaskRepository.TASK_SELECT,
    });

    return tasks.map((task) => {
      const transformed = this.transformTask(task);
      return {
        ...transformed,
        isOverdue: this.checkIfOverdue(task as unknown as Task),
      };
    });
  }

  async getTasksByTag(userId: number, tagId: number, status?: "pending" | "completed" | "all") {
    let isCompletedFilter: boolean | undefined = undefined;
    if (status === "pending") isCompletedFilter = false;
    if (status === "completed") isCompletedFilter = true;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        tags: {
          some: {
            tagId,
          },
        },
        deletedAt: null,
        ...(isCompletedFilter !== undefined && { isCompleted: isCompletedFilter }),
      },
      orderBy: { id: "asc" },
      select: TaskRepository.TASK_SELECT,
    });

    return tasks.map((task) => {
      const transformed = this.transformTask(task);
      return {
        ...transformed,
        isOverdue: this.checkIfOverdue(task as unknown as Task),
      };
    });
  }

  private checkIfOverdue(task: Task): boolean {
    if (task.isCompleted || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  }

  async getTaskById(id: string, userId: number) {
    const task = await prisma.task.findFirst({
      where: { id: Number(id), userId },
      select: TaskRepository.TASK_SELECT,
    });

    if (!task) {
      throw new Error(
        "Task not found or you are not authorized to access this task",
      );
    }

    return this.transformTask(task);
  }

  async createTask(userId: number, taskData: CreateTaskRequest) {
    const { tagIds = [], ...rest } = taskData;

    const task = await prisma.task.create({
      data: {
        ...rest,
        userId,
        ...(Array.isArray(tagIds) && tagIds.length > 0
          ? { tags: { create: tagIds.map((id: number) => ({ tagId: id })) } }
          : {}),
      },
      select: TaskRepository.TASK_SELECT,
    });

    return this.transformTask(task);
  }

  async updateTask(id: string, taskData: UpdateTaskRequest, userId: number) {
    const { tagIds, ...rest } = taskData;

    const tagsUpdate =
      tagIds !== undefined
        ? {
            tags: {
              deleteMany: {},
              create: tagIds.map((tagId) => ({ tagId })),
            },
          }
        : {};

    const task = await prisma.task.update({
      where: {
        id: Number(id),
        userId,
      },
      data: {
        ...rest,
        ...tagsUpdate,
      },
      select: TaskRepository.TASK_SELECT,
    });

    return this.transformTask(task);
  }

  async deleteTask(id: string, userId: number) {
    try {
      return await prisma.task.update({
        where: { id: Number(id), userId },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error(
          "Task not found or you are not authorized to delete this task",
        );
      }
      throw error;
    }
  }

  async restoreTask(id: string, userId: number) {
    try {
      return await prisma.task.update({
        where: { id: Number(id), userId, deletedAt: { not: null } },
        data: { deletedAt: null },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("Task not found, not authorized, or not in trash");
      }
      throw error;
    }
  }

  async getAllTrashTasks(userId: number) {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        deletedAt: { not: null },
      },
      orderBy: { id: "asc" },
      select: TaskRepository.TASK_SELECT,
    });

    return tasks.map((task) => this.transformTask(task));
  }

  async deleteTrashTask(id: string, userId: number) {
    const result = await prisma.task.deleteMany({
      where: { id: Number(id), userId, deletedAt: { not: null } },
    });
    if (result.count === 0) {
      throw new Error("Trash task not found or unauthorized");
    }
    return result;
  }

  async deleteAllTasks() {
    return await prisma.task.deleteMany();
  }
}

export default TaskRepository;
